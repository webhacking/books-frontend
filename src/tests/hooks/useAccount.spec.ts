import React from 'react';
import { act, cleanup, render, RenderResult } from '@testing-library/react';

import axios from 'axios';

import useAccount, { AccountProvider } from 'src/hooks/useAccount';

describe('AccountProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(async () => {
    jest.useRealTimers();
    await act(async () => {
      cleanup();
    });
  });

  function Printer() {
    const account = useAccount();
    return React.createElement(
      React.Fragment,
      {},
      account,
    );
  }

  it('should provide account data', async () => {
    const handler = jest.fn().mockReturnValue({ data: { result: 'account' } });
    (axios as any).__setHandler(handler);
    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        React.createElement(
          AccountProvider,
          {},
          React.createElement(Printer, {}),
        )
      );
    });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(renderResult.container.textContent).toBe('account');
  });

  it('should retry three times', async () => {
    const handler = jest.fn().mockRejectedValue(new Error());
    (axios as any).__setHandler(handler);
    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        React.createElement(
          AccountProvider,
          {},
          React.createElement(Printer, {}),
        )
      );
    });
    while (jest.getTimerCount() > 0) {
      await act(async () => {
        jest.runAllTimers();
      });
    }
    expect(handler).toHaveBeenCalledTimes(3);
    expect(renderResult.container.textContent).toBe('');
  });
});
