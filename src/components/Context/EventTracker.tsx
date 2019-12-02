import React from 'react';

// import sentry from 'src/utils/sentry';
import { useDebounceSendEventTracker } from 'src/hooks/useDebounceSendEventTracker';
// const { captureException } = sentry();
export const EventTrackerContext = React.createContext(null);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EventTrackerContextProps {}

export const EventTracker: React.FC<EventTrackerContextProps> = props => {
  const [debouncedInsertImpressionItem] = useDebounceSendEventTracker();
  return (
    <EventTrackerContext.Provider value={debouncedInsertImpressionItem}>
      {props.children}
    </EventTrackerContext.Provider>
  );
};
