import React, { useEffect, useState } from 'react';
import { NextRouter, withRouter } from 'next/router';

export const BrowserLocationContext = React.createContext('/');

interface BrowserLocationContextProps {
  pathname: string;
  isPartials: boolean;
  router: NextRouter;
}

const BrowserLocation: React.FC<BrowserLocationContextProps> = props => {
  const [currentPath, setCurrentPath] = useState<string>(props.pathname);

  useEffect(() => {
    if (!props.isPartials) {
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
          props.router.events.off('routeChangeError', routeErrorHandler);
        }
      };
    }
    return () => {};
  }, [props.isPartials, props.router]);
  return (
    <BrowserLocationContext.Provider value={currentPath}>
      {props.children}
    </BrowserLocationContext.Provider>
  );
};
export const BrowserLocationWithRouter = withRouter(BrowserLocation);
