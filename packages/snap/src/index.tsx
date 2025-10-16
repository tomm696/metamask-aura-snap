import { type OnRpcRequestHandler, type OnHomePageHandler, OnUserInputHandler, UserInputEventType, ManageStateResult, SnapMethods } from '@metamask/snaps-sdk';
import { Address, Banner, Box, Link, Container, Heading, Text, Image, Bold, Button, Skeleton, Option, Footer, Row, Value, Field, Form, Input, Dropdown, Divider } from '@metamask/snaps-sdk/jsx';
import { Strategy } from './components/Strategy';
import { AccountSelectorEventValue, ButtonEvents, FormEvents, PortfolioResponse, PortfolioStrategiesResponse } from './types';
import { ChooseAddress } from './components/ChooseAddress';
import { Strategies } from './components/Strategies';
import { StrategiesSkeleton } from './components/StrategiesSkeleton';
import { ChooseAccount } from './components/ChooseAccount';
import { ErrorMessage } from './components/ErrorMessage';

async function getPortfolioStrategies(address: string): Promise<PortfolioResponse> {
  try {
    const response = await fetch(`https://aura.adex.network/api/portfolio/strategies?address=${address}`)

    return response.json()
  } catch (err) {
    throw new Error(`Aura call failed, please try again later: ${JSON.stringify(err)}`)
  }
}

async function showStrategies(address: `0x${string}`, id?: string): Promise<void> {
  let interfaceId = id
  // show loading screen before making the Aura request
  if (!interfaceId) {
    interfaceId = await snap.request({
      method: 'snap_createInterface',
      params: {
        ui: (
          <StrategiesSkeleton address={address}></StrategiesSkeleton>
        )
      },
    });

    await snap.request({
      method: 'snap_dialog',
      params: {
        id: interfaceId,
      },
    })
  } else {
    await snap.request({
      method: "snap_updateInterface",
      params: {
        id: interfaceId,
        ui: (
          <StrategiesSkeleton address={address}></StrategiesSkeleton>
        )
      },
    });
  }

  const strategies = await getPortfolioStrategies(address as string)

  if (!strategies?.address && !strategies?.strategies) {
    await snap.request({
      method: "snap_updateInterface",
      params: {
        id: interfaceId,
        ui: (
          <ErrorMessage message={ strategies?.message || "" }></ErrorMessage>
        )
      },
    });
    return
  }

  await snap.request({
    method: "snap_updateInterface",
    params: {
      id: interfaceId,
      ui: (
        <Strategies address={strategies.address} portfolioStrategies={strategies.strategies}></Strategies>
      )
    },
  });
}

async function getAddressForAccount(addresses: `0x${string}`[]): Promise<`0x${string}` | null> {
  if (addresses.length > 1) {
    const defaultAddress = await getState('defaultAddress')

    if (defaultAddress && addresses.includes(defaultAddress)) {
      return defaultAddress
    } else {
      return null
    }
  }

  return addresses[0] as `0x${string}`
}

async function getState(key: string, defaultValue: any = null): Promise<any | null> {
  const currentState = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  })
  
  if (!currentState || !currentState[key]) return defaultValue

  return currentState[key]
}

async function updateState(key: string, value: any): Promise<ManageStateResult> {
  const currentState = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  }) || {}
  currentState[key] = value

  return snap.request({
    method: "snap_manageState",
    params: {
      operation: "update",
      newState: currentState,
    },
  })
}

async function deleteState(key: string): Promise<ManageStateResult> {
  const currentState = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  }) || {}

  if (currentState[key]) {
    delete currentState[key]
  }

  return snap.request({
    method: "snap_manageState",
    params: {
      operation: "update",
      newState: currentState,
    },
  })
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      const defaultAccount = await getState('defaultAccount') as AccountSelectorEventValue
      const selectedAddress = defaultAccount?.addresses?.length > 0 ? defaultAccount.addresses[0] : null
      return snap.request({
        method: 'snap_dialog',
        params: {
          content: (
            <Container>
              <ChooseAccount selectedAccount={selectedAddress}></ChooseAccount>
            </Container>
          ),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch(event.name) {
      case ButtonEvents.ChooseAddress:
        // clear default address, so we can choose a new one after selecting an account
        await deleteState('defaultAddress')

        const defaultAccount = await getState('defaultAccount') as AccountSelectorEventValue
        const selectedAddress = defaultAccount?.addresses?.length > 0 ? defaultAccount.addresses[0] : null

        await snap.request({
          method: "snap_updateInterface",
          params: {
            id,
            ui: (
              <Container>
                <ChooseAccount selectedAccount={selectedAddress}></ChooseAccount>
              </Container>
            )
          },
        })
        break
    }
  } else if (event.type === UserInputEventType.FormSubmitEvent) {
    switch(event.name) {
      case FormEvents.AccountSelected:
        const account = event.value['account'] as AccountSelectorEventValue

        // map addresses from the CAIP-10 values to 0x.. string values
        const addresses = account.addresses.map(el => el.split(':').pop() as `0x${string}`)
        addresses.push("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045") // vitalik.eth - for debug

        // save account as default account
        await updateState('defaultAccount', account)

        const lastDefaultAddressCheckBoxState = await getState('lastDefaultAddressCheckBoxState', true)

        const address = await getAddressForAccount(addresses)

        if (!address) {
          // multiple addresses in account, show additional selector
          await snap.request({
            method: "snap_updateInterface",
            params: {
              id,
              ui: (
                <Container>
                  <ChooseAddress addresses={addresses} lastDefaultAddressCheckBoxState={lastDefaultAddressCheckBoxState}></ChooseAddress>
                </Container>
              )
            },
          })
          return
        }

        await showStrategies(address, id)
        break;
      case FormEvents.AddressSelected:
        const selectedAddress = event.value['address'] as `0x${string}`

        if (event.value['default']) {
          // save address as default address
          await updateState('defaultAddress', selectedAddress)
          await updateState('lastDefaultAddressCheckBoxState', event.value['default'])
        } else {
          // clear default address
          await deleteState('defaultAddress')
        }

        await showStrategies(selectedAddress, id)
        break;
    }
  }
}

export const onHomePage: OnHomePageHandler = async () => {
  const defaultAccount = await getState('defaultAccount') as AccountSelectorEventValue
  const selectedAddress = defaultAccount?.addresses?.length > 0 ? defaultAccount.addresses[0] : null
  return {
    content: (
      <Container>
        <ChooseAccount selectedAccount={selectedAddress}></ChooseAccount>
      </Container>
    ),
  };
};