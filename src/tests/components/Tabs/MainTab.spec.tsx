import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { MainTab } from 'src/components/Tabs';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';

afterEach(cleanup);

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
