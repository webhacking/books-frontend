import * as React from 'react';
import Meta from 'src/components/Meta';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test('should be render Index Component', () => {
  render(<Meta />);
});
