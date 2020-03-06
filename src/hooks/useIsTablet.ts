import React from 'react';
import { useMediaQuery } from 'react-responsive';

export default function useIsTablet(): boolean {
  const isTabletQueryResult = useMediaQuery({ maxWidth: '1000px' });
  const [isTablet, setTablet] = React.useState(false);
  React.useEffect(() => {
    setTablet(isTabletQueryResult);
  }, [isTabletQueryResult]);
  return isTablet;
}
