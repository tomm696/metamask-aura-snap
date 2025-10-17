import { Box, Text, Divider, Button, Link, Heading } from '@metamask/snaps-sdk/jsx';
import { ButtonEvents } from './../types';

export const Howto = () => {
  return (
    <Box>
      <Heading>
          How to Use (FAQ)
      </Heading>
      <Box>
        <Heading>What is Aura Connect snap?</Heading>
        <Text>Aura Connect is an unofficial, community built and fully open source AdEx Aura integration for MetaMask. It let's you explore personalized DeFi insights and wallet-based recommendations through Aura’s public APIs for your MetaMask accounts</Text>

        <Divider />
        <Heading>What is AdEx Aura?</Heading>
        <Text>AdEx AURA is your personal AI agent framework, generating secure and high-impact DeFi strategy recommendations.</Text>
        <Link href="https://www.adex.network/">Click here to learn more about AdEx Aura</Link>

        <Divider />
        <Heading>How to use this snap:</Heading>
        <Text>1. Open the Aura Connect snap:</Text>
        <Text> - Open MetaMask, Click the menu icon in the upper right corner, Choose Snaps, select the Aura Connect Snap</Text>
        <Text> - Or follow the "Get started" link on the snap website</Text>
        <Text>2. Choose your preffered MetaMask account</Text>
        <Text color='alternative'>* aura connect will remember your last used account and select if for you next time</Text>
        <Text>2. Click on "Show Strategies"</Text>
        <Text color='alternative'>* if you have multiple addresses in this account, we'll ask you to select which address to use</Text>
        <Text>3. Wait for the Aura recommendations to load</Text>
        <Text color='alternative'>* we're fetching data right from the Aura public API, nerdy stuff</Text>
        <Text>4. Check out what strategies and actions Aura has prepared for you</Text>
        <Text color='alternative'>* this is not financial advice. Cryptocurrency investments are highly volatile and carry a significant level of risk</Text>

        <Divider />
        <Button type='button' name={ButtonEvents.ChooseAddress} variant='destructive'>Go back</Button>
      </Box>
    </Box>
  );
};
