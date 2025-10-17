import {
  Box,
  Text,
  Button,
  Field,
  Input,
  Form,
  Heading,
  Section,
} from '@metamask/snaps-sdk/jsx';

import { ButtonEvents, FormEvents } from '../types';

export const Settings = ({ apiKey }: { apiKey: string }) => {
  return (
    <Box>
      <Heading>Settings</Heading>
      <Form name={FormEvents.SettingsUpdated}>
        <Field label="Aura API Key">
          <Input
            name="apiKey"
            placeholder="Enter an API key"
            {...(apiKey ? { value: apiKey } : {})}
          />
        </Field>
        <Text color="muted" size="sm" alignment="center">
          If you have an Aura API key you can provide it here, to increase your
          request rate limits. If no API key is provided the public API can
          still be used.
        </Text>
        <Box alignment="center" direction="horizontal">
          {/* this box of empty texts around the button helps highlight it a bit with the section background color */}
          <Box>
            <Text> </Text>
          </Box>
          <Section alignment="center">
            <Button type="submit">Save</Button>
          </Section>
          <Box>
            <Text> </Text>
          </Box>
        </Box>
        <Box alignment="center" direction="horizontal">
          <Text>or</Text>
        </Box>
        <Button
          type="button"
          name={ButtonEvents.ChooseAddress}
          variant="destructive"
        >
          Go back
        </Button>
      </Form>
    </Box>
  );
};
