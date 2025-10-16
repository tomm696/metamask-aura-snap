import {ReactComponent as Logo} from './../assets/logo-vb.svg'

export const SnapLogo = ({
  color,
  size,
}: {
  color?: string | undefined;
  size: number;
}) => (
  <Logo width={size} height={size} />
);
