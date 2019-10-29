import * as React from 'react';
import SelectionBookList from 'src/components/BookSections/SelectionBook/SelectionBookList';
import { render, cleanup, getAllByAltText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import mockData from 'src/components/BookSections/mockData';

afterEach(cleanup);

const renderSelectionBookList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <SelectionBookList isAIRecommendation={false} items={mockData[3].items} />
    </ThemeProvider>,
  );

describe('test SelectionBookContainer', () => {
  it('should be render SelectionBookList item', () => {
    const { container } = renderSelectionBookList();
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
});
