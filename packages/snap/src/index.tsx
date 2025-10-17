import type {
  OnUserInputHandler,
  ManageStateResult,
  OnRpcRequestHandler,
  OnHomePageHandler,
  Json,
} from '@metamask/snaps-sdk';
import { UserInputEventType } from '@metamask/snaps-sdk';
import { Banner, Box, Text, Container } from '@metamask/snaps-sdk/jsx';

import { ChooseAccount } from './components/ChooseAccount';
import { ChooseAddress } from './components/ChooseAddress';
import { ErrorMessage } from './components/ErrorMessage';
import { Howto } from './components/Howto';
import { Settings } from './components/Settings';
import { Strategies } from './components/Strategies';
import { StrategiesSkeleton } from './components/StrategiesSkeleton';
import { ButtonEvents, FormEvents } from './types';
import type { AccountSelectorEventValue, PortfolioResponse } from './types';

/**
 *
 * @param address the address to get strategies for
 */
async function getPortfolioStrategies(
  address: string,
): Promise<PortfolioResponse> {
  try {
    const apiKey = await getState('apiKey');
    const response = await fetch(
      `https://aura.adex.network/api/portfolio/strategies?address=${address}${apiKey ? `&apiKey=${apiKey}` : ''}`,
    );

    return response.json();
  } catch (error) {
    throw new Error(
      `Aura call failed, please try again later: ${JSON.stringify(error)}`,
    );
  }
}

/**
 *
 * @param address the address to show strategies for
 * @param id interface id - if no interface a dialog will be created, otherwise will update
 */
async function showStrategies(
  address: `0x${string}`,
  id?: string,
): Promise<void> {
  let interfaceId = id;
  // show loading screen before making the Aura request
  if (!interfaceId) {
    interfaceId = await snap.request({
      method: 'snap_createInterface',
      params: {
        ui: <StrategiesSkeleton address={address}></StrategiesSkeleton>,
      },
    });

    await snap.request({
      method: 'snap_dialog',
      params: {
        id: interfaceId,
      },
    });
  } else {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id: interfaceId,
        ui: <StrategiesSkeleton address={address}></StrategiesSkeleton>,
      },
    });
  }

  const strategies = await getPortfolioStrategies(address as string);

  if (!strategies?.address && !strategies?.strategies) {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id: interfaceId,
        ui: <ErrorMessage message={strategies?.message || ''}></ErrorMessage>,
      },
    });
    return;
  }

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id: interfaceId,
      ui: (
        <Strategies
          address={strategies.address}
          portfolioStrategies={strategies.strategies}
        ></Strategies>
      ),
    },
  });
}

/**
 *
 * @param addresses
 */
async function getAddressForAccount(
  addresses: `0x${string}`[],
): Promise<`0x${string}` | null> {
  if (addresses.length > 1) {
    const defaultAddress = await getState('defaultAddress') as `0x${string}`;

    if (defaultAddress && addresses.includes(defaultAddress)) {
      return defaultAddress;
    }
    return null;
  }

  return addresses[0] as `0x${string}`;
}

/**
 *
 * @param key
 * @param defaultValue
 */
async function getState(
  key: string,
  defaultValue: Json = null,
): Promise<Json> {
  const currentState = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  if (!currentState?.[key]) {
    return defaultValue;
  }

  return currentState[key];
}

/**
 *
 * @param key
 * @param value
 */
async function updateState(
  key: string,
  value: Json,
): Promise<ManageStateResult> {
  const currentState =
    (await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) || {};
  currentState[key] = value;

  return snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: currentState,
    },
  });
}

/**
 *
 * @param key
 */
async function deleteState(key: string): Promise<ManageStateResult> {
  const currentState =
    (await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) || {};

  if (currentState[key]) {
    delete currentState[key];
  }

  return snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: currentState,
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
    case 'chooseAccount':
      const defaultAccount = (await getState(
        'defaultAccount',
      )) as AccountSelectorEventValue;
      const selectedAddress =
        defaultAccount?.addresses?.length > 0
          ? defaultAccount.addresses[0]
          : null;
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
    switch (event.name) {
      case ButtonEvents.ChooseAddress:
        // clear default address, so we can choose a new one after selecting an account
        await deleteState('defaultAddress');

        const defaultAccount = (await getState(
          'defaultAccount',
        )) as AccountSelectorEventValue;
        const selectedAddress =
          defaultAccount?.addresses?.length > 0
            ? defaultAccount.addresses[0]
            : null;

        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: (
              <Container>
                <ChooseAccount
                  selectedAccount={selectedAddress}
                ></ChooseAccount>
              </Container>
            ),
          },
        });
        break;
      case ButtonEvents.OpenSettings:
        const apiKey = await getState('apiKey') as string;

        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: (
              <Container>
                <Settings apiKey={apiKey}></Settings>
              </Container>
            ),
          },
        });
        break;
      case ButtonEvents.OpenHowto:
        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: (
              <Container>
                <Howto></Howto>
              </Container>
            ),
          },
        });
        break;
    }
  } else if (event.type === UserInputEventType.FormSubmitEvent) {
    switch (event.name) {
      case FormEvents.AccountSelected:
        const account = event.value.account as AccountSelectorEventValue;

        // map addresses from the CAIP-10 values to 0x.. string values
        const addresses = account.addresses.map(
          (el) => el.split(':').pop() as `0x${string}`,
        );

        // save account as default account
        await updateState('defaultAccount', account);

        const lastDefaultAddressCheckBoxState = await getState(
          'lastDefaultAddressCheckBoxState',
          true,
        ) as boolean;

        const address = await getAddressForAccount(addresses);

        if (!address) {
          // multiple addresses in account, show additional selector
          await snap.request({
            method: 'snap_updateInterface',
            params: {
              id,
              ui: (
                <Container>
                  <ChooseAddress
                    addresses={addresses}
                    lastDefaultAddressCheckBoxState={
                      lastDefaultAddressCheckBoxState
                    }
                  ></ChooseAddress>
                </Container>
              ),
            },
          });
          return;
        }

        await showStrategies(address, id);
        break;
      case FormEvents.AddressSelected:
        const selectedAddress = event.value.address as `0x${string}`;

        if (event.value.default) {
          // save address as default address
          await updateState('defaultAddress', selectedAddress);
          await updateState(
            'lastDefaultAddressCheckBoxState',
            event.value.default,
          );
        } else {
          // clear default address
          await deleteState('defaultAddress');
        }

        await showStrategies(selectedAddress, id);
        break;
      case FormEvents.SettingsUpdated:
        if (event.value.apiKey) {
          await updateState('apiKey', event.value.apiKey);
        } else {
          await deleteState('apiKey');
        }
        const defaultAcct = (await getState(
          'defaultAccount',
        )) as AccountSelectorEventValue;
        const selectedAddr =
          defaultAcct?.addresses?.length > 0 ? defaultAcct.addresses[0] : null;

        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: (
              <Container>
                <Box>
                  <Banner severity="info" title="Settings saved">
                    <Text> </Text>
                  </Banner>
                  <ChooseAccount selectedAccount={selectedAddr}></ChooseAccount>
                </Box>
              </Container>
            ),
          },
        });
        break;
    }
  }
};

export const onHomePage: OnHomePageHandler = async () => {
  const defaultAccount = (await getState(
    'defaultAccount',
  )) as AccountSelectorEventValue;
  const selectedAddress =
    defaultAccount?.addresses?.length > 0 ? defaultAccount.addresses[0] : null;
  return {
    content: (
      <Container>
        <ChooseAccount selectedAccount={selectedAddress}></ChooseAccount>
      </Container>
    ),
  };
};
