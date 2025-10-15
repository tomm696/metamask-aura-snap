import { Address, Banner, Box, Card, Divider, Link, Heading, Section, Text, Bold, Button } from '@metamask/snaps-sdk/jsx';
import { ButtonEvents, PortfolioStrategiesResponse, StrategiesResponse, StrategyAction } from './../types';
import { Strategy } from './Strategy';

export const Strategies = ({ address, portfolioStrategies }: { address: `0x${string}`, portfolioStrategies: PortfolioStrategiesResponse[] }) => {
    const strategies: StrategiesResponse[] = []

    for (const portfolioStrategy of portfolioStrategies) {
        if (portfolioStrategy.response && portfolioStrategy.response.length) {
            strategies.push(...portfolioStrategy.response)
        }
    }

  return (
    <Box>
        <Heading>
            Strategies for
        </Heading>
        <Box alignment='space-between' direction='horizontal'>
            <Address address={address}/>
            <Button name={ButtonEvents.ChooseAddress}>Change</Button>
        </Box>
        <Divider />
        {/* Strategies */}
        <Box>
        {
            strategies.map((el) => <Strategy strategy={el}></Strategy>)
        }
        </Box>
    </Box>
  );
};
