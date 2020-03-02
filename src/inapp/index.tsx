import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Global } from '@emotion/core';
import { resetStyles } from 'src/styles';
import makeStore from 'src/store/config';
import InAppNotification from 'src/components/InApp/InAppNotification';
import * as Cookies from 'js-cookie';

const RIDI_APP_THEME = 'ridi_app_theme';

const store = makeStore({}, { isServer: false });
const theme = Cookies.get(RIDI_APP_THEME) || '';


const App: React.FC = () => (
  <>
    {/* Todo Apply Layout */}
    <Global styles={resetStyles} />
    <Provider store={store}>
      <InAppNotification theme={theme} />
    </Provider>
  </>
);

render(<App />, document.getElementById('app'));
