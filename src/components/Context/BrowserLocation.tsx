import * as React from 'react';
import { useEffect, useState } from 'react';
import { WithRouterProps, withRouter } from 'next/router';

export const BrowserLocationContext = React.createContext('/');

interface BrowserLocationContextProps {
  pathname: string;
}

const BrowserLocation: React.FC<BrowserLocationContextProps & WithRouterProps> = props => {
  const [currentPath, setCurrentPath] = useState<string>(props.pathname);
  useEffect(() => {
    const pathChangeEvent = (url: string) => {
      setCurrentPath(url);
    };
    if (props.router) {
      props.router.events.on('routeChangeStart', pathChangeEvent);
    }
    return () => {
      if (props.router) {
        props.router.events.off('routeChangeStart', pathChangeEvent);
      }
    };
  }, []);
  return (
    <BrowserLocationContext.Provider value={currentPath}>
      {props.children}
    </BrowserLocationContext.Provider>
  );
};
export const BrowserLocationWithRouter = withRouter(BrowserLocation);
