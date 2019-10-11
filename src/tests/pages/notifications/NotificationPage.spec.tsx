import * as React from 'react';
import Index from 'src/pages/notification';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test('should be render Index Component', async () => {
  // @ts-ignore
  const props = await Index.getInitialProps({
    pathname: '',
    asPath: '',
    // store,
    query: { theme: 'dark' },
  });

  const { getAllByText } = render(<Index {...props} />);

  expect(getAllByText(/알림/)[0]).toHaveTextContent('알림');
});
