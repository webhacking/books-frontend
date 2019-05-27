import * as React from 'react';
import { QuickMenuList } from 'src/components/QuickMenu';
import { render, cleanup, getByText } from 'react-testing-library';
import 'jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
// import { act } from 'react-dom/test-utils';
// import axiosMock from 'axios';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
jest.mock('server/routes', () => ({ default: {}, Router: { pushRoute: () => null } }));
jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));

afterEach(cleanup);

const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <QuickMenuList items={[{ label: '신간', color: '#ffffff', link: '/' }]} />
    </ThemeProvider>,
  );

describe('test instant search', () => {
  it('should be render input', () => {
    const { container } = renderComponent();
    const itemNode = getByText(container, '신간');
    expect(itemNode).not.toBe(null);
  });
});
