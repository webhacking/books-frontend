import * as colors from '@ridi/colors';

export interface RIDITheme {
  primaryColor: string;
  primaryHoverColor: string;
  secondaryColor: string;
  footerTextColor: string;
  horizontalRuleColor: string;
  verticalRuleColor: string;
  logoFilter: string;
  logoFilter2: string;
  button: {
    primaryBackground: string;
    secondaryBackground: string;
    primaryBorderColor: string;
    secondaryBorderColor: string;
  };
}

export const defaultTheme: RIDITheme = {
  primaryColor: colors.dodgerBlue50,
  primaryHoverColor: colors.dodgerBlue10,
  secondaryColor: colors.slateGray90,
  footerTextColor: '#ffffff',
  horizontalRuleColor: colors.slateGray80,
  verticalRuleColor: colors.slateGray70,
  logoFilter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))',
  logoFilter2: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2))',
  button: {
    primaryBorderColor: colors.dodgerBlue20,
    primaryBackground: colors.dodgerBlue50,
    secondaryBackground: '#ffffff',
    secondaryBorderColor: '#ffffff',
  },
};

export const darkTheme: RIDITheme = {
  primaryColor: colors.gray90,
  primaryHoverColor: colors.dodgerBlue10,
  secondaryColor: colors.slateGray90,
  footerTextColor: '#ffffff',
  horizontalRuleColor: colors.slateGray80,
  verticalRuleColor: colors.slateGray70,
  logoFilter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))',
  logoFilter2: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2))',
  button: {
    primaryBorderColor: colors.dodgerBlue20,
    primaryBackground: colors.dodgerBlue50,
    secondaryBackground: '#ffffff',
    secondaryBorderColor: '#ffffff',
  },
};
