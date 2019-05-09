import * as React from 'react';
import {
  Paper,
  Exclamation_1,
  Lens,
  New_1,
  RidiSelectLogo_1,
  RidiLogo_1,
  Arrow_Left_13,
  Close_2,
} from './Icons';
import styled from '@emotion/styled';

enum IconNames {
  RidiLogo_1 = 'RidiLogo_1',
  RidiSelectLogo_1 = 'RidiSelectLogo_1',
  Paper = 'Paper',
  New_1 = 'New_1',
  Lens = 'Lens',
  Arrow_Left_13 = 'Arrow_Left_13',
  Exclamation_1 = 'Exclamation_1',
  Close_2 = 'Close_2',
}

interface IconProps {
  // tslint:disable-next-line
  [index: string]: any;
}

const Icons: IconProps = {
  RidiLogo_1,
  RidiSelectLogo_1,
  Paper,
  Close_2,
  Lens,
  New_1,
  Arrow_Left_13,
  Exclamation_1,
};

// tslint:disable-next-line
interface SvgProps extends React.SVGProps<any> {
  iconName: keyof typeof IconNames;
}

export const Svg: React.FC<SvgProps> = React.memo(props => {
  const Icon = Icons[props.iconName];
  const { iconName, ...rest } = props;
  return <Icon {...rest} />;
});

export const StyledSvg = styled(Svg)``;
