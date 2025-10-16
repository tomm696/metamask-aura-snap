import { Box, Image, Tooltip, Text, Option, Button, Checkbox, Dropdown, Form, Heading, Card, Selector, SelectorOption, AccountSelector } from '@metamask/snaps-sdk/jsx';
import { ButtonEvents, FormEvents } from './../types';

export const ChooseAccount = () => {
  return (
    <Box>
    <Heading>
        Choose account:
    </Heading>
    <Form name={FormEvents.AccountSelected}>
        <AccountSelector name="account" switchGlobalAccount={false} chainIds={['eip155:1']}></AccountSelector>
        <Checkbox name="default" label="Use this account by default" checked={true} />
        <Button type="submit">Show strategies</Button>
    </Form>
    </Box>
  );
};
