import * as React from 'react';
import { cleanup, render, getByText } from '@testing-library/react';
import { GenreTab } from 'src/components/Tabs';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { Genre, homeGenres } from '../../../constants/genres';
import * as labels from 'src/labels/common.json';

afterEach(cleanup);

const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <GenreTab genres={homeGenres} currentGenre={Genre.FANTASY} />
    </ThemeProvider>,
  );

describe('GenreTab test', () => {
  it('should be render GenreTab component', () => {
    const { container } = renderComponent();
    expect(container).not.toBe(null);
  });
  it('should be render sub service', () => {
    const { container } = renderComponent();
    const categoryNode = getByText(container, labels.category);
    expect(categoryNode).not.toBe(null);
  });
});
