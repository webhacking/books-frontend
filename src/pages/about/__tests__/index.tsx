import * as React from 'react';
import About from '../index';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

afterEach(cleanup);

test('should be render Index Component', () => {
  const { getByText } = render(<About id={'12345'} />);

  expect(getByText(/Home/)).toHaveTextContent('Home');
});
