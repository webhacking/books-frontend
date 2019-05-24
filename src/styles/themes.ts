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
  input: {
    placeholder: string;
  };
  divider: string;
  divider2: string;
  divider3: string;
  genreTab: {
    icon: string;
    normal: string;
    active: string;
  };
  subServiceTab: {
    normal: string;
    hover: string;
    active: string;
  };
  label: string;
  etc: {
    slot1: string;
  };
  icon: {
    warn: string;
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
  input: {
    placeholder: colors.slateGray50,
  },
  divider: colors.slateGray5,
  divider2: colors.slateGray10,
  divider3: colors.slateGray20,
  label: colors.slateGray40,
  genreTab: {
    icon: colors.slateGray60,
    normal: colors.slateGray80,
    active: colors.dodgerBlue50,
  },
  subServiceTab: {
    normal: colors.slateGray50,
    hover: colors.slateGray90,
    active: colors.dodgerBlue50,
  },
  etc: {
    slot1: colors.slateGray20,
  },
  icon: {
    warn: colors.slateGray20,
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
  input: {
    placeholder: colors.slateGray50,
  },
  divider: colors.slateGray5,
  divider2: colors.slateGray10,
  divider3: colors.slateGray20,
  genreTab: {
    icon: colors.slateGray60,
    normal: colors.slateGray80,
    active: colors.dodgerBlue50,
  },
  subServiceTab: {
    normal: colors.slateGray50,
    hover: colors.slateGray90,
    active: colors.dodgerBlue50,
  },
  label: colors.slateGray40,
  etc: {
    slot1: colors.slateGray20,
  },
  icon: {
    warn: colors.slateGray20,
  },
};
