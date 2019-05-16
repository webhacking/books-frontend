import * as React from 'react';
import {
  Paper,
  Exclamation_1,
  Lens,
  New_1,
  RidiSelectLogo_1,
  RidiLogo_1,
  Arrow_Left_13,
  Home,
  Close_2,
  Home_solid,
  Notification_regular,
  Notification_solid,
  MyRIDI_solid,
  MyRIDI_regular,
  Cart_regular,
  Cart_solid,
} from './Icons';

export enum IconNames {
  RidiLogo_1 = 'RidiLogo_1',
  RidiSelectLogo_1 = 'RidiSelectLogo_1',
  Paper = 'Paper',
  New_1 = 'New_1',
  Lens = 'Lens',
  Arrow_Left_13 = 'Arrow_Left_13',
  Exclamation_1 = 'Exclamation_1',
  Close_2 = 'Close_2',
  Home = 'Home',
  Home_solid = 'Home_solid',
  Notification_regular = 'Notification_regular',
  Notification_solid = 'Notification_solid',
  Cart_regular = 'Cart_regular',
  Cart_solid = 'Cart_solid',
  MyRIDI_regular = 'MyRIDI_regular',
  MyRIDI_solid = 'MyRIDI_solid',
}

interface IconProps {
  [index: string]: React.FC<React.SVGProps<SVGElement>>;
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
  Home,
  Home_solid,
  Notification_solid,
  Notification_regular,
  Cart_regular,
  Cart_solid,
  MyRIDI_regular,
  MyRIDI_solid,
};

interface SvgProps extends React.SVGProps<SVGElement> {
  iconName: keyof typeof IconNames;
}

export const Svg: React.FC<SvgProps> = React.memo(props => {
  const Icon = Icons[props.iconName];
  const { iconName, ...rest } = props;
  return <Icon {...rest} />;
});
