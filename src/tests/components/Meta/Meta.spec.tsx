import * as React from 'react';
import Meta from 'src/components/Meta';
import CSP from 'src/components/Meta/CSP';

import { render, cleanup, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('testing Meta & Head', () => {
  afterEach(cleanup);

  it('should be render Meta Component', async () => {
    const { container } = render(<Meta />);

    expect(container).not.toBe(null);
  });

  it('should be render CSP meta', async () => {
    const { container } = render(<CSP />);
    const meta = await waitForElement(() => container, { container });
    const cspMeta = meta.querySelector('meta');
    expect(cspMeta.httpEquiv).toBe('Content-Security-Policy');
  });

});
