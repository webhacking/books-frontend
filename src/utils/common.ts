import { notifySentry } from './sentry';

// tslint:disable-next-line
export const safeJSONParse = (source: string | null, defaultValue: any) => {
  if (!source) {
    return defaultValue;
  }
  try {
    return JSON.parse(source);
  } catch (err) {
    notifySentry(err);
    return defaultValue;
  }
};

export const isJSON = (source: string) => {
  try {
    JSON.parse(source);
    return true;
  } catch (err) {
    return false;
  }
};
