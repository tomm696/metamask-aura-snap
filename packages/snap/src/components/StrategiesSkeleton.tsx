import { Address, Banner, Box, Card, Divider, Link, Heading, Section, Text, Bold, Button, Skeleton } from '@metamask/snaps-sdk/jsx';
import { ButtonEvents, PortfolioStrategiesResponse, StrategiesResponse, StrategyAction } from './../types';
import { Strategy } from './Strategy';

export const StrategiesSkeleton = ({ address }: { address: `0x${string}` }) => {
    const strategies: StrategiesResponse[] = [{} as StrategiesResponse, {} as StrategiesResponse, {} as StrategiesResponse]

  return (
    <Box>
        <Heading>
            Strategies for
        </Heading>
        <Box alignment='space-between' direction='horizontal'>
            <Address address={address}/>
        </Box>
        <Divider />
        <Text>Updating strategies from Aura..</Text>
        <Divider />
        <Text>Please wait..</Text>
        <Divider />
        <Box>
        {
            strategies.map((el) => <Section><Skeleton></Skeleton></Section>)
        }
        </Box>
    </Box>
  );
};
