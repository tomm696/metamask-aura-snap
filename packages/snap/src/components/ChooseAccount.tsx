import { Box, Image, Tooltip, Text, Option, Divider, Button, Checkbox, Dropdown, Form, Heading, Card, Selector, SelectorOption, AccountSelector } from '@metamask/snaps-sdk/jsx';
import { ButtonEvents, FormEvents } from './../types';
import logo from './../assets/logo.svg'

export const ChooseAccount = ({ selectedAccount }: { selectedAccount: any}) => {
  return (
    <Box>
      <Box alignment='center' direction='horizontal'>
        <Image src={logo}></Image>
      </Box>
      <Text color='alternative' alignment='center' fontWeight='bold'>Metamask Aura Snap (Unofficial)</Text>
      <Heading>
          Choose account:
      </Heading>
      <Form name={FormEvents.AccountSelected}>
          <AccountSelector 
            name="account" 
            switchGlobalAccount={false} 
            chainIds={['eip155:1']} 
            {...(selectedAccount ? { value: selectedAccount } : {})}
            ></AccountSelector>
          <Button type="submit">Show strategies</Button>
      </Form>
      <Divider />
      <Box>
        <Text color='muted' size='sm' alignment='center'>Please note that the Metamask Aura Snap is not
        affiliated with Metamask or Aura. It's an open source project
        built by the community to add Aura to your Metamask. Use at 
        your own risk. Aura does not provide financial advice, nor
        does this snap.</Text>
      </Box>
    </Box>
  );
};
