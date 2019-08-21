import * as React from 'react';
import Meta from 'src/pages/Meta';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));

afterEach(cleanup);

test('should be render Index Component', () => {
  render(<Meta />);
});
