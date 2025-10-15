import { type OnRpcRequestHandler, type OnHomePageHandler, OnUserInputHandler, UserInputEventType } from '@metamask/snaps-sdk';
import { Address, Banner, Box, Link, Container, Heading, Text, Bold, Button, Skeleton, Option, Footer, Row, Value, Field, Form, Input, Dropdown } from '@metamask/snaps-sdk/jsx';
import { Strategy } from './components/Strategy';
import { ButtonEvents, FormEvents, PortfolioResponse, PortfolioStrategiesResponse } from './types';
import { ChooseAddress } from './components/ChooseAddress';
import { Strategies } from './components/Strategies';
import { StrategiesSkeleton } from './components/StrategiesSkeleton';
import { ChooseAccount } from './components/ChooseAccount';
import { ErrorMessage } from './components/ErrorMessage';

async function getCurrentAccounts(): Promise<string[] | null> {
  try {
    const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[] | undefined;

    if (!accounts) return [];
    accounts.push("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045") // vitalik.eth - for debug
    return accounts;
  } catch (err) {
    throw new Error(`getCurrentAccount failed: ${String(err)}`);
  }
}

async function getPortfolioStrategies(address: string): Promise<PortfolioResponse> {
  try {
    const response = await fetch(`https://aura.adex.network/api/portfolio/strategies?address=${address}`)

    return response.json()
  } catch (err) {
    throw new Error(`Aura call failed, please try again later: ${JSON.stringify(err)}`)
  }
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
      // const accounts = await getCurrentAccounts() as `0x${string}`[]

      return snap.request({
        method: 'snap_dialog',
        params: {
          content: (
            <Container>
              {/* <ChooseAddress accounts={accounts}></ChooseAddress> */}
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
              // todo?
              // <ChooseAddress accounts={accounts}></ChooseAddress>
              <ChooseAccount></ChooseAccount>
            )
          },
        });
        break
    }
  } else if (event.type === UserInputEventType.FormSubmitEvent) {
    switch(event.name) {
      case FormEvents.ShowStrategies:

        // await snap.request({
        //   method: "snap_updateInterface",
        //   params: {
        //     id,
        //     ui: (
        //       <Box><Text>{JSON.stringify(event.value)}</Text></Box>
        //     )
        //   },
        // });

        const account = event.value['address'] as any
        let address: `0x${string}` = '0x'

        if (account?.addresses?.length) {
          address = (account.addresses[0].split(':').pop()) as `0x${string}`
        } else {
          address = account
        }

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
      break;
    }
  }
}

export const onHomePage: OnHomePageHandler = async () => {
  const accounts = await getCurrentAccounts() as `0x${string}`[]

  return {
    content: (
      <Box>
        <ChooseAddress accounts={accounts}></ChooseAddress>
      </Box>
    ),
  };
};