import * as React from 'react';
import ForTest from '../../components/ForTest';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

afterEach(cleanup);

test('should be render ForTest Component', () => {
  const { getByText } = render(<ForTest />);

  expect(getByText(/Test Component/)).toHaveTextContent("I'm Test Component");
});
