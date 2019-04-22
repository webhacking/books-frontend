import * as React from 'react';
import RidiLogo_1 from './RidiLogo_1';
import RidiSelectLogo_1 from './RidiSelectLogo_1';
import Paper from './Paper';
import New_1 from './New_1';
import styled from '@emotion/styled';

enum IconNames {
  RidiLogo_1 = 'RidiLogo_1',
  RidiSelectLogo_1 = 'RidiSelectLogo_1',
  Paper = 'Paper',
  New_1 = 'New_1',
}

interface IconProps {
  // tslint:disable-next-line
  [index: string]: any;
}

const Icons: IconProps = {
  RidiLogo_1,
  RidiSelectLogo_1,
  Paper,
  New_1,
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
