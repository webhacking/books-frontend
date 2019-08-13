import * as React from 'react';
import Mobile from 'src/components/CategoryList/Mobile';
import Desktop from 'src/components/CategoryList/Desktop';
import { render, cleanup, getByText } from 'react-testing-library';
import 'jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import CategoryListPage, { categoryMock } from 'src/pages/category/list';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
jest.mock('server/routes', () => ({ default: {}, Router: { pushRoute: () => null } }));

afterEach(cleanup);

const renderMobile = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Mobile categoryList={categoryMock} />
    </ThemeProvider>,
  );

const renderDesktop = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Desktop categoryList={categoryMock} />
    </ThemeProvider>,
  );

const renderPage = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <CategoryListPage categoryList={categoryMock} />
    </ThemeProvider>,
  );

describe('test event banner wrapper', () => {
  it('should be render mobile categorylist', () => {
    const { container } = renderMobile();
    const itemNode = getByText(container, '에세이/시');
    expect(itemNode).not.toBe(null);
  });

  it('should be render desktop categorylist', () => {
    const { container } = renderDesktop();
    const itemNode = getByText(container, '에세이/시');
    expect(itemNode).not.toBe(null);
  });
});
