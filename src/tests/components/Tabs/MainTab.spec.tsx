import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { MainTab } from 'src/components/Tabs';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

afterEach(cleanup);

const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <RouterContext.Provider value={{ asPath: '' }}>
        <MainTab isPartials={false} />
      </RouterContext.Provider>
    </ThemeProvider>,
  );

describe('MainTab test', () => {
  it('should be render MainTab component', () => {
    const { container } = renderComponent();
    expect(container).not.toBe(null);
  });
});
