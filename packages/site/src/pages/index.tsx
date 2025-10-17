import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  GetStartedButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
} from '../hooks';
import { isLocalSnap, shouldDisplayReconnectButton } from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Link = styled.a`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const handleGetStartedClick = async () => {
    await invokeSnap({ method: 'chooseAccount' });
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>Aura Connect</Span> Snap
      </Heading>
      <Subtitle>
        Unofficial integration bringing <Link href="https://www.adex.network/" target="_blank">Aura</Link>-powered insights into <Link href="https://metamask.io/snaps" target="_blank">MetaMask</Link>.
      </Subtitle>
      <br />
      <Subtitle>
        Get started by connecting <code>metamask</code> below
      </Subtitle>
      <CardContainer>
        {error && (
          <ErrorMessage>
            <b>An error happened:</b> {error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the Aura Connect snap.',
              button: (
                <ConnectButton
                  onClick={requestSnap}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={requestSnap}
                  disabled={!installedSnap}
                />
              ),
            }}
            disabled={!installedSnap}
          />
        )}
        <Card
          content={{
            title: 'Get started with Aura in Metamask',
            description:
              'Choose an account and see what AdEx Aura has to offer, right within Metamask.',
            button: (
              <GetStartedButton
                onClick={handleGetStartedClick}
                disabled={!installedSnap}
              />
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
        <Notice>
          <p>
            <b>What is <Link href="https://www.adex.network/" target="_blank">AdEx Aura</Link>?</b>
          </p>
          <br />
          <p>
            AdEx AURA is your personal AI agent framework, generating secure 
            and high-impact DeFi strategy recommendations.
          </p>
          <br />
          <p>For more insights into how AdEx Aura works see: <Link href="https://www.adex.network/blog/introducing-adex-aura/" target="_blank">Introducing AdEx Aura</Link></p>
          <br />
          <p>
            <Link href="https://adexnetwork.notion.site/AdEx-AURA-Vision-198552af7b4f802d8f44c46b3f8ec7ec" target="_blank">To learn more about AdEx Aura and the AdEx Aura Vision - click here</Link>
          </p>
          <br />
          <p>
            <b>What is the Aura Connect snap?</b>
          </p>
          <br />
          <p>
            Aura Connect is an unofficial, community built and fully open source AdEx Aura integration for MetaMask. It let's you explore personalized DeFi insights and wallet-based recommendations through Aura’s public APIs for your MetaMask accounts.
          </p>
          <br />
          <p>
            <b>How to open the Aura Connect snap after connecting it to metamask?</b>
          </p>
          <p>
            <p>After the Snap is installed you can:</p> 
            <ul>
              <li>Open <b>MetaMask</b></li>
              <li>Click the <b>menu icon</b> in the upper right corner</li>
              <li>Choose <b>Snaps</b></li>
              <li>select the <b>Aura Connect Snap</b></li>
            </ul>
            <p>or click the "Get started" button above</p>
          </p>
        </Notice>
        <Notice>
          <p>
            <b>Disclaimers</b>
          </p>
          <br />
          <p>
            Please note that the MetaMask <b>Aura Connect</b> snap is not
            affiliated with Metamask or Aura. It's an open source project
            built by the community to add Aura to your Metamask. Use at 
            your own risk. Aura does not provide financial advice, nor
            does this snap.
          </p>
          <br />
          <p>
            The information provided by Aura is for informational and 
            educational purposes only and should not be considered as 
            financial or investment advice. Cryptocurrency investments 
            are highly volatile and carry a significant level of risk. 
            Past performance does not guarantee future results.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
