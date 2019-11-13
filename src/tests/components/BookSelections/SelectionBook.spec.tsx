import * as React from 'react';
import SelectionBookList from 'src/components/BookSections/SelectionBook/SelectionBookList';
import { render, cleanup, getAllByAltText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';

afterEach(cleanup);

const renderSelectionBookList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <SelectionBookList
        isAIRecommendation={false}
        items={[{ b_id: '12345666', type: 'test', detail: null }]}
      />
    </ThemeProvider>,
  );

describe('test SelectionBookContainer', () => {
  it('should be render SelectionBookList item', () => {
    const { container } = renderSelectionBookList();
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
});
