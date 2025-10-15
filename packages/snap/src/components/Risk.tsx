import { Box, Image, Tooltip, Text } from '@metamask/snaps-sdk/jsx';
import riskLowIcon from './../assets/risk-low.svg'
import riskModerateIcon from './../assets/risk-moderate.svg'
import riskHighIcon from './../assets/risk-high.svg'
import riskOpportunisticIcon from './../assets/risk-opportunistic.svg'
import riskOtherIcon from './../assets/risk-other.svg'

export const Risk = ({ risk }: { risk: string }) => {
  const riskIcons: any = {
    low: riskLowIcon,
    moderate: riskModerateIcon,
    high: riskHighIcon,
    opportunistic: riskOpportunisticIcon,
    other: riskOtherIcon
  }
  let riskIcon = riskIcons[risk]

  if (!riskIcon) {
    riskIcon = riskIcons.other
  }

  return (
    <Box>
      <Tooltip content={<Text>Risk: ${risk}</Text>}>
        <Image src={riskIcon}></Image>
      </Tooltip>
    </Box>
  );
};
