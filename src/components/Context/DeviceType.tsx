import React, { useEffect, useState } from 'react';
import { getDeviceType } from 'src/utils/common';

// import sentry from 'src/utils/sentry';
// const { captureException } = sentry();
export const DeviceTypeContext = React.createContext(null);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeviceTypeContextProps {}

export const DeviceType: React.FC<DeviceTypeContextProps> = (props) => {
  const [type, setType] = useState(null);
  useEffect(() => {
    setType(getDeviceType());
  }, []);
  return (
    <DeviceTypeContext.Provider value={type}>{props.children}</DeviceTypeContext.Provider>
  );
};
