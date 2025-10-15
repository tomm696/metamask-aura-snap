import { Address, Banner, Box, Card, Divider, Link, Heading, Section, Text, Bold } from '@metamask/snaps-sdk/jsx';
import { StrategyAction } from 'src/types';

export const Action = ({ action }: { action: StrategyAction}) => {
  return (
    <Section>
        <Text>- {action.description}</Text>
        <Text>Tokens: {action.tokens}</Text>
        <Divider />
    </Section>
  );
};
