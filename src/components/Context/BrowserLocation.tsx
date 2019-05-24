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
    setCurrentPath(window.location.pathname);
    const routeChangeCompleteHandler = (url: string) => {
      setCurrentPath(url);
    };
    // tslint:disable-next-line:no-any
    const routeErrorHandler = (error: any, url: string) => {
      if (error && error.message !== 'Route Cancelled') {
        console.log(error, url);
      }
    };
    if (props.router) {
      props.router.events.on('routeChangeComplete', routeChangeCompleteHandler);
      props.router.events.on('routeChangeError', routeErrorHandler);
    }
    return () => {
      if (props.router) {
        props.router.events.off('routeChangeComplete', routeChangeCompleteHandler);
        // @ts-ignore
        props.router.events.off('routeChangeError', routeErrorHandler);
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
