import * as React from 'react';
import Index from 'src/pages/partials/gnb';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

afterEach(cleanup);

test('should be render Index Component', () => {
  const { getByText } = render(<Index />);

  expect(getByText(/리디셀렉트/)).toHaveTextContent('리디셀렉트');
  expect(getByText(/RIDIBOOKS/)).toHaveTextContent('RIDIBOOKS');
});
