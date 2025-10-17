import {
  Box,
  Text,
  Option,
  Button,
  Checkbox,
  Dropdown,
  Form,
  Heading,
  Section,
  Divider,
} from '@metamask/snaps-sdk/jsx';

import { FormEvents } from '../types';

export const ChooseAddress = ({
  addresses,
  lastDefaultAddressCheckBoxState,
}: {
  addresses: `0x${string}`[];
  lastDefaultAddressCheckBoxState: boolean;
}) => {
  return (
    <Box>
      <Heading>Multiple addresses found in account</Heading>
      <Divider />
      <Heading>Choose address:</Heading>
      <Form name={FormEvents.AddressSelected}>
        <Dropdown name="address">
          {addresses.map((el) => (
            <Option value={el}>{el}</Option>
          ))}
        </Dropdown>
        <Checkbox
          name="default"
          label="Use this address by default"
          checked={lastDefaultAddressCheckBoxState}
        />
        <Box alignment="center" direction="horizontal">
          {/* this box of empty texts around the button helps highlight it a bit with the section background color */}
          <Box>
            <Text> </Text>
          </Box>
          <Section alignment="center">
            <Button type="submit">Show strategies</Button>
          </Section>
          <Box>
            <Text> </Text>
          </Box>
        </Box>
      </Form>
    </Box>
  );
};
