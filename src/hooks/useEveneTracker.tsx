import { useEffect, useState } from 'react';
import { DeviceType, Tracker } from '@ridi/event-tracker';
import { GA_KEY, GTM_KEY } from 'src/constants/eventTracking';

const initTracker = (userId: string) => {
  if (typeof window !== 'undefined') {
    const tracker = new Tracker({
      userId: userId || null,
      // Todo device 판단
      deviceType: DeviceType.PC || null,
      beaconOptions: {
        use: true,
      },
      // eslint-disable-next-line no-process-env
      debug: process.env.NODE_ENV !== 'production',
      gaOptions: {
        trackingId: GA_KEY,
      },
      tagManagerOptions: {
        trackingId: GTM_KEY,
      },
      // eslint-disable-next-line no-process-env
      development: process.env.NODE_ENV !== 'production',
    });

    tracker.initialize();
    return tracker;
  }
  return null;
};

const useEventTracker = (loggedUser): [Tracker] => {
  // @ts-ignore
  const [tracker, setTracker] = useState(initTracker(loggedUser?.id));
  useEffect(() => {}, [loggedUser]);

  return [tracker];
};

export default useEventTracker;
