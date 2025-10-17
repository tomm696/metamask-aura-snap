import { Box, Section, Text } from '@metamask/snaps-sdk/jsx';
import type { StrategiesResponse } from 'src/types';

import { Action } from './Action';
import { Risk } from './Risk';

export const Strategy = ({ strategy }: { strategy: StrategiesResponse }) => {
  return (
    <Section>
      <Box direction="horizontal">
        <Risk risk={strategy.risk}></Risk>
        <Text>{strategy.name}</Text>
      </Box>
      <Box>
        {strategy.actions.map((el) => (
          <Action action={el}></Action>
        ))}
      </Box>
    </Section>
  );
};
