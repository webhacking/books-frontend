import { act, render, cleanup, RenderResult } from '@testing-library/react';
import React from 'react';

import { ViewportIntersectionProvider, useViewportIntersection } from 'src/hooks/useViewportIntersection';

class MockIO {
  elements: Set<Element> = new Set();
  static visibleElements: Set<Element> = new Set();
  static activeIOs: Set<MockIO> = new Set();

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    MockIO.activeIOs.add(this);
  }

  observe(e: Element) {
    if (!(e instanceof Element)) {
      throw new TypeError('not an element');
    }
    this.elements.add(e);
    this.changeVisibility(e, MockIO.visibleElements.has(e));
  }

  unobserve(e: Element) {
    if (!(e instanceof Element)) {
      throw new TypeError('not an element');
    }
    this.elements.delete(e);
  }

  private changeVisibility(e: Element, visible: boolean) {
    const entry = {
      target: e,
      intersectionRatio: visible ? 1 : 0,
      isIntersecting: visible,
    };
    this.callback([entry as any], this as unknown as IntersectionObserver);
  }

  static reveal(e: Element) {
    if (MockIO.visibleElements.has(e)) {
      return;
    }
    MockIO.visibleElements.add(e);
    for (const io of MockIO.activeIOs.values()) {
      if (io.elements.has(e)) {
        io.changeVisibility(e, true);
      }
    }
  }

  static hide(e: Element) {
    if (!MockIO.visibleElements.has(e)) {
      return;
    }
    MockIO.visibleElements.delete(e);
    for (const io of MockIO.activeIOs.values()) {
      if (io.elements.has(e)) {
        io.changeVisibility(e, false);
      }
    }
  }

  disconnect() {
    this.elements.clear();
    MockIO.activeIOs.delete(this);
  }
}

describe('useViewportIntersection', () => {
  function TestComponent(props: { callback: (visible: boolean) => void }) {
    const ref = useViewportIntersection(props.callback);
    return (
      <div ref={ref} />
    );
  }

  let originalIO: typeof MockIO;

  beforeAll(() => {
    originalIO = window.IntersectionObserver as unknown as typeof MockIO;
    window.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    act(() => {
      cleanup();
    });
  });

  test('should do nothing if ViewportIntersectionProvider is unavailable', () => {
    const callback = jest.fn();
    act(() => {
      render(
        <TestComponent callback={callback} />
      );
    });
    expect(callback).not.toBeCalled();
  });

  test('should be able to run callbacks', () => {
    const callback = jest.fn();
    let component: RenderResult;
    act(() => {
      component = render(
        <ViewportIntersectionProvider>
          <TestComponent callback={callback} />
        </ViewportIntersectionProvider>
      );
    });
    const divElement = component.container.querySelector('div');
    expect(callback).toBeCalledWith(false);

    callback.mockClear();
    act(() => {
      MockIO.reveal(divElement);
    });
    expect(callback).toBeCalledWith(true);

    callback.mockClear();
    act(() => {
      MockIO.hide(divElement);
    });
    expect(callback).toBeCalledWith(false);
  });

  test('should behave properly when ref is changed', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    let component: RenderResult;
    act(() => {
      component = render(
        <ViewportIntersectionProvider>
          <TestComponent callback={callback1} />
        </ViewportIntersectionProvider>
      );
    });
    const divElement = component.container.querySelector('div');
    const io: MockIO = MockIO.activeIOs.values().next().value;
    const unobserveSpy = jest.spyOn(io, 'unobserve');
    act(() => {
      MockIO.reveal(divElement);
    });
    act(() => {
      component.rerender(
        <ViewportIntersectionProvider>
          <TestComponent callback={callback2} />
        </ViewportIntersectionProvider>
      );
    });
    expect(unobserveSpy).toBeCalledWith(divElement);
    expect(io.elements.has(divElement)).toBeTruthy();
    expect(callback2).toBeCalledWith(true);
  });

  describe('IO unavailable', () => {
    let originalIO: any;

    beforeAll(() => {
      originalIO = window.IntersectionObserver;
      window.IntersectionObserver = undefined;
    });

    afterAll(() => {
      window.IntersectionObserver = originalIO;
    });

    test('should be always visible when IO is unavailable', () => {
      const callback = jest.fn();
      act(() => {
        render(
          <ViewportIntersectionProvider>
            <TestComponent callback={callback} />
          </ViewportIntersectionProvider>
        );
      });
      expect(callback).toBeCalledWith(true);
    });

    test('should behave properly when ref is changed', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      let component: RenderResult;
      act(() => {
        component = render(
          <ViewportIntersectionProvider>
            <TestComponent callback={callback1} />
          </ViewportIntersectionProvider>
        );
      });
      act(() => {
        component.rerender(
          <ViewportIntersectionProvider>
            <TestComponent callback={callback2} />
          </ViewportIntersectionProvider>
        );
      });
      expect(callback2).toBeCalledWith(true);
    });
  });
});
