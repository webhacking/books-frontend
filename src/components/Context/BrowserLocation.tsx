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

const BrowserLocation: React.FC<BrowserLocationContextProps> = (props) => {
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
    if (props.isPartials) {
      return;
    }
    setCurrentPath(window.location.pathname);

    const events = props.router?.events;
    if (!events) {
      return;
    }

    try {
      events.on('routeChangeComplete', routeChangeCompleteHandler);
      events.on('routeChangeError', routeErrorHandler);
    } catch (error) {
      captureException(error);
    }

    return () => {
      events.off('routeChangeComplete', routeChangeCompleteHandler);
      events.off('routeChangeError', routeErrorHandler);
    };
  }, [
    props.router?.events,
    props.isPartials,
    routeChangeCompleteHandler,
    routeErrorHandler,
  ]);

  return (
    <BrowserLocationContext.Provider value={currentPath}>
      {props.children}
    </BrowserLocationContext.Provider>
  );
};
export const BrowserLocationWithRouter = withRouter(BrowserLocation);
