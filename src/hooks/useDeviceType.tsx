import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

export const getDeviceType = () => {
  const { type = 'pc' } = new UAParser().getDevice();
  return ['mobile', 'tablet'].includes(type) ? 'mobile' : 'pc';
};

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<ReturnType<typeof getDeviceType>>('mobile');
  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);
  return {
    deviceType,
    isMobile: deviceType === 'mobile',
  };
};
