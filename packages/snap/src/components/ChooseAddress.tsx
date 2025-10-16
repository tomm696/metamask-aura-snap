import { Box, Image, Tooltip, Text, Option, Button, Checkbox, Dropdown, Form, Heading, Card, Selector, SelectorOption, AccountSelector, Divider } from '@metamask/snaps-sdk/jsx';
import { ButtonEvents, FormEvents } from './../types';

export const ChooseAddress = ({ addresses, lastDefaultAddressCheckBoxState }: { addresses: `0x${string}`[], lastDefaultAddressCheckBoxState: boolean}) => {
  return (
    <Box>
    <Heading>
      Multiple addresses found in account
    </Heading>
    <Divider />
    <Heading>
        Choose address:
    </Heading>
    <Form name={FormEvents.AddressSelected}>
        <Dropdown name="address">
        {addresses.map(el => <Option value={el}>{el}</Option>)}
        </Dropdown>
        <Checkbox name="default" label="Use this address by default" checked={lastDefaultAddressCheckBoxState} />
        <Button type="submit">Show strategies</Button>
    </Form>
    </Box>
  );
};
