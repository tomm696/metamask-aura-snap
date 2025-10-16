import { type OnRpcRequestHandler, type OnHomePageHandler, OnUserInputHandler, UserInputEventType } from '@metamask/snaps-sdk';
import { Address, Banner, Box, Link, Container, Heading, Text, Bold, Button, Skeleton, Option, Footer, Row, Value, Field, Form, Input, Dropdown } from '@metamask/snaps-sdk/jsx';
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

async function showStrategies(id: string, address: `0x${string}`): Promise<void> {
  // show loading screen before making the Aura request
  await snap.request({
    method: "snap_updateInterface",
    params: {
      id,
      ui: (
        <StrategiesSkeleton address={address}></StrategiesSkeleton>
      )
    },
  });

  const strategies = await getPortfolioStrategies(address as string)

  if (!strategies?.address && !strategies?.strategies) {
    await snap.request({
      method: "snap_updateInterface",
      params: {
        id,
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
      id,
      ui: (
        <Strategies address={strategies.address} portfolioStrategies={strategies.strategies}></Strategies>
      )
    },
  });
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
      return snap.request({
        method: 'snap_dialog',
        params: {
          content: (
            <Container>
              <ChooseAccount></ChooseAccount>
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
        await snap.request({
          method: "snap_updateInterface",
          params: {
            id,
            ui: (
              <ChooseAccount></ChooseAccount>
            )
          },
        })
        break
    }
  } else if (event.type === UserInputEventType.FormSubmitEvent) {
    switch(event.name) {
      case FormEvents.AccountSelected:
        const account = event.value['account'] as AccountSelectorEventValue
        let address: `0x${string}` = '0x'

        // map addresses from the CAIP-10 values to 0x.. string values
        const addresses = account.addresses.map(el => el.split(':').pop() as `0x${string}`)
        addresses.push("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045") // vitalik.eth - for debug

        if (addresses.length > 1) {
          // multiple addresses in account, show additional selector
          await snap.request({
            method: "snap_updateInterface",
            params: {
              id,
              ui: (
                <ChooseAddress addresses={addresses}></ChooseAddress>
              )
            },
          })
          return
        }

        await showStrategies(id, addresses[0] as `0x${string}`)
        break;
      case FormEvents.AddressSelected:
        const selectedAddress = event.value['address'] as `0x${string}`

        await showStrategies(id, selectedAddress)
        break;
    }
  }
}

export const onHomePage: OnHomePageHandler = async () => {
  return {
    content: (
      <Box>
        <ChooseAccount></ChooseAccount>
      </Box>
    ),
  };
};