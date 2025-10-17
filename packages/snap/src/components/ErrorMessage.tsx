import { Banner, Box, Divider, Text, Button } from '@metamask/snaps-sdk/jsx';

import { ButtonEvents } from '../types';

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Box>
      <Banner title="Error" severity="danger">
        <Text>
          An error has occured. {message ? `Aura response: ${message}` : ''}
        </Text>
      </Banner>
      <Divider />
      <Banner title="Suggestion" severity="info">
        <Text>Please retry again later</Text>
      </Banner>

      <Button name={ButtonEvents.ChooseAddress}>Go back</Button>
    </Box>
  );
};
