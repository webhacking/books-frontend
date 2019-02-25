import * as React from 'react';
import Index from 'src/pages';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

afterEach(cleanup);

test('should be render Index Component', () => {
  const { getByText } = render(<Index />);

  expect(getByText(/Home/)).toHaveTextContent('Home');
});
