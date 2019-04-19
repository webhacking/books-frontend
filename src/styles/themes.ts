import * as colors from '@ridi/colors';

export interface RIDITheme {
  primaryColor: string;
}

export const defaultTheme: RIDITheme = {
  primaryColor: colors.dodgerBlue50,
};

export const darkTheme: RIDITheme = {
  primaryColor: colors.gray90,
};
