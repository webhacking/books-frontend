import * as React from 'react';
import Favicon from 'src/pages/Favicon';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));

afterEach(cleanup);

test('should be render Index Component', () => {
  render(<Favicon />);
});
