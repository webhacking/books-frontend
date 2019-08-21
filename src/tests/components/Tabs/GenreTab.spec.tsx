import * as React from 'react';
import { cleanup, render, getByText } from '@testing-library/react';
import { GenreTab } from 'src/components/Tabs';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { Genre, homeGenres } from '../../../constants/genres';
import * as labels from 'src/labels/common.json';

jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));
jest.mock('server/routes', () => {
  require('react');
  return {
    default: {},
    Link: props => <div>{props.children}</div>,
    Router: {
      pushRoute: () => null,
      push: () => null,
      replace: () => null,
      replaceRoute: () => null,
    },
  };
});

afterEach(cleanup);

// axiosMock.get.mockResolvedValue();
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
