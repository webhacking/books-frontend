import { DeviceType, Tracker } from '@ridi/event-tracker';
import { FB_KEYS, GA_KEY, GTM_KEY } from 'src/constants/eventTracking';

export const createTracker = (userId: string | null) => {
  if (typeof window !== 'undefined') {
    const tracker = new Tracker({
      // @ts-ignore
      userId: userId || null,
      // Todo device 판단  User-Agent ?
      deviceType: window.innerWidth > 999 ? DeviceType.PC : DeviceType.Mobile, // user agent 판단? 아니면?
      beaconOptions: {
        use: true,
        beaconSrc:
          // eslint-disable-next-line no-process-env
          process.env.NODE_ENV !== 'production'
            ? 'https://s3.ap-northeast-2.amazonaws.com/beacon-ridibooks-test/beacon_ridibooks_test.gif'
            : 'https://s3.ap-northeast-2.amazonaws.com/beacon-ridibooks/beacon_ridibooks.gif',
      },
      // eslint-disable-next-line no-process-env
      debug: process.env.NODE_ENV !== 'production',
      gaOptions: {
        trackingId: GA_KEY,
        fields: {
          campaignName: 'HOME_RENEWAL',
        },
      },
      pixelOptions: {
        pixelId: FB_KEYS,
      },
      tagManagerOptions: {
        trackingId: GTM_KEY,
      },
      // eslint-disable-next-line no-process-env
      development: process.env.NODE_ENV !== 'production',
    });
    return tracker;
  }
  return null;
};
