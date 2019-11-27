import React, { useCallback, useEffect, useState } from 'react';
import { NextRouter, withRouter } from 'next/router';

import sentry from 'src/utils/sentry';
const { captureException } = sentry();
export const BrowserLocationContext = React.createContext('/');

interface BrowserLocationContextProps {
  pathname: string;
  isPartials: boolean;
  router: NextRouter;
}

const BrowserLocation: React.FC<BrowserLocationContextProps> = props => {
  const [currentPath, setCurrentPath] = useState<string>(props.pathname);

  const routeChangeCompleteHandler = useCallback((url: string) => {
    setCurrentPath(url);
  }, []);
  const routeErrorHandler = useCallback((error: any, url: string) => {
    try {
      if (error && error.message !== 'Route Cancelled') {
        console.log(error, url);
      }
    } catch (err) {
      captureException(error);
    }
  }, []);

  useEffect(() => {
    try {
      if (!props.isPartials) {
        setCurrentPath(window.location.pathname);
        if (props.router) {
          props.router.events.on('routeChangeComplete', routeChangeCompleteHandler);
          props.router.events.on('routeChangeError', routeErrorHandler);
        }
      }
    } catch (error) {
      captureException(error);
    }

    return () => {
      if (props.router) {
        props.router.events.off('routeChangeComplete', routeChangeCompleteHandler);
        props.router.events.off('routeChangeError', routeErrorHandler);
      }
    };
  }, [props.router, props.isPartials, routeChangeCompleteHandler, routeErrorHandler]);
  return (
    <BrowserLocationContext.Provider value={currentPath}>
      {props.children}
    </BrowserLocationContext.Provider>
  );
};
export const BrowserLocationWithRouter = withRouter(BrowserLocation);
