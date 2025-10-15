import { Box, Image, Tooltip, Text, Option, Button, Checkbox, Dropdown, Form, Heading, Card, Selector, SelectorOption, AccountSelector } from '@metamask/snaps-sdk/jsx';
import { ButtonEvents } from './../types';

export const ChooseAddress = ({ accounts }: { accounts: `0x${string}`[]}) => {
  return (
    <Box>
    <Heading>
        Choose address:
    </Heading>
    <Form name="show-strategies">
        <Dropdown name="address">
        {accounts.map(el => <Option value={el}>{el}</Option>)}
        </Dropdown>
        <Checkbox name="default" label="Use this address by default" checked={true} />
        <Button type="submit">Show strategies</Button>
    </Form>
    </Box>
  );
};
