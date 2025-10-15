import { Box, Image, Tooltip, Text, Option, Button, Checkbox, Dropdown, Form, Heading, Card, Selector, SelectorOption, AccountSelector } from '@metamask/snaps-sdk/jsx';
import { ButtonEvents } from './../types';

export const ChooseAccount = () => {
  return (
    <Box>
    <Heading>
        Choose account:
    </Heading>
    <Form name="show-strategies">
        <AccountSelector name="address" switchGlobalAccount={false} chainIds={['eip155:1']}></AccountSelector>
        <Checkbox name="default" label="Use this account by default" checked={true} />
        {/* <Dropdown name="address">
        {accounts.map(el => <Option value={el}>{el}</Option>)}
        </Dropdown> */}
        <Button type="submit">Show strategies</Button>
    </Form>
    </Box>
  );
};
