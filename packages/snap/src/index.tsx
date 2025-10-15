import type { OnRpcRequestHandler, OnHomePageHandler } from '@metamask/snaps-sdk';
import { Address, Banner, Box, Link, Heading, Text, Bold, Button, Skeleton, Footer, Row, Value } from '@metamask/snaps-sdk/jsx';
import { Strategy } from './components/Strategy';
import { PortfolioResponse, PortfolioStrategiesResponse } from './types';


async function getCurrentAccount(): Promise<string | null> {
  try {
    
    const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[] | undefined;

    if (!accounts || accounts.length === 0) return null;
    return accounts[0] || null;
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
      // const account = await getCurrentAccount() as `0x${string}`
      const account = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth
      let strategies: PortfolioStrategiesResponse[] = {} as any
      let strategy: PortfolioStrategiesResponse = {} as any

      if (account) {
        const auraRes = await getPortfolioStrategies(account)
        strategies = auraRes.strategies
        strategy = strategies[0] as PortfolioStrategiesResponse
      }

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Heading>
                Connected accounts:
              </Heading>
              <Address address={account}/>
              <Heading>
                Strategies:
              </Heading>
              {/* <Text>
                {strategies && JSON.stringify(strategies)}
              </Text> */}

              {/* Strategies */}
              <Box>
                {
                  strategy.response.map((el) => <Strategy strategy={el}></Strategy>)
                }
              </Box>
            </Box>
          ),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onHomePage: OnHomePageHandler = async () => {
  const account = await getCurrentAccount()
  let strategies = {}
  let strategy = {}

  if (account) {
    const auraRes = await getPortfolioStrategies(account)
    strategies = auraRes?.strategies
    strategy = (strategies as any).response[0]
  }
  
  return {
    content: (
      <Box>
        <Heading>Hello!</Heading>
        <Text>Welcome to Metamask Aura Snap (unofficial) home page!</Text>
        <Text>
          <Bold>Account:</Bold>
        </Text>
        <Text>
          {account}
        </Text>
        <Text>
          <Bold>Strategies:</Bold>
        </Text>
        <Text>
          {strategies && JSON.stringify(strategies)}
        </Text>
      </Box>
    ),
  };
};