import * as React from 'react';
import { cleanup, render } from 'react-testing-library';
import { MainTab } from 'src/components/Tabs';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';

jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
// jest.mock('server/routes', () => {
//   require('react');
//   return { default: {}, Link: <div />, Router: { pushRoute: () => null } };
// });
jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));

afterEach(cleanup);

// axiosMock.get.mockResolvedValue();
const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <MainTab isPartials={false} />
    </ThemeProvider>,
  );

describe('MainTab test', () => {
  it('should be render MainTab component', () => {
    const { container } = renderComponent();
    expect(container).not.toBe(null);
  });
});
