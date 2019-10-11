import * as React from 'react';
import { QuickMenuList } from 'src/components/QuickMenu';
import { render, cleanup, getByText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';

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
