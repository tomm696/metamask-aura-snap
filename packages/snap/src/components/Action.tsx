import { Box, Divider, Link, Section, Text } from '@metamask/snaps-sdk/jsx';
import { StrategyAction } from 'src/types';

export const Action = ({ action }: { action: StrategyAction}) => {
  // default values
  if (!action.platforms?.length) {
    action.platforms = []
  }
  if (!action.flags?.length) {
    action.flags = []
  }
  if (!action.networks?.length) {
    action.networks = []
  }
  if (!action.operations?.length) {
    action.operations = []
  } else {
    // unique filtering, in case of duplicate elements
    action.operations = [...new Set(action.operations)];
  }
  if (!action.tokens) {
    action.tokens = ''
  }

  return (
    <Section>
        <Text>- {action.description}</Text>
        <Box direction='vertical'>
          {action.networks?.length > 0 && (
            <Box direction='horizontal'>
              <Text size='sm' color='muted'>NETWORKS: </Text><Text size='sm' color='alternative'>{action.networks.join(', ')}</Text>
            </Box>
          )}
          {action.platforms?.length > 0 && (
            <Box direction='horizontal'>
              <Text size='sm' color='muted'>PLATFORMS: </Text>
              <Text size="sm" color="alternative">
                {action.platforms.flatMap((p, i) =>
                  i < action.platforms.length - 1
                    ? [<Link href={p.url}>{p.name}</Link>, ', ']
                    : [<Link href={p.url}>{p.name}</Link>]
                )}
              </Text>
            </Box>
          )}
          {action.operations?.length > 0 && (
            <Box direction='horizontal'>
              <Text size='sm' color='muted'>OPERATIONS: </Text><Text size='sm' color='alternative'>{action.operations.join(', ')}</Text>
            </Box>
          )}
          {action.tokens?.length > 0 && action.tokens !== 'N/A' && (
            <Box direction='horizontal'>
              <Text size='sm' color='muted'>TOKENS: </Text><Text size='sm' color='alternative'>{action.tokens}</Text>
            </Box>
          )}
          {action.apy?.length > 0 && action.apy !== 'N/A' && (
            <Box direction='horizontal'>
              <Text size='sm' color='muted'>APY: </Text><Text size='sm' color='alternative'>{action.apy}</Text>
            </Box>
          )}
        </Box>
        <Divider />
    </Section>
  );
};
