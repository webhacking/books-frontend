import { act, cleanup, createEvent, fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';

import BigBannerCarousel from 'src/components/Carousel/BigBannerCarousel';

const TOTAL_ITEMS = 10;
const ITEM_WIDTH = 100;
const ITEM_MARGIN = 10;

function renderCarousel(
  renderFn: Parameters<typeof BigBannerCarousel>[0]['children'],
  currentIdx: number,
  touchDiff?: number,
) {
  return (
    <BigBannerCarousel
      totalItems={TOTAL_ITEMS}
      currentIdx={currentIdx}
      itemMargin={ITEM_MARGIN}
      touchDiff={touchDiff}
    >
      {renderFn}
    </BigBannerCarousel>
  );
}

describe('BigBannerCarousel', () => {
  afterAll(cleanup);

  const renderImpl: Parameters<typeof BigBannerCarousel>[0]['children'] =
    ({ index, activeIndex }) => (
      <div
        key={index}
        className="item"
        data-index={index}
        data-active={index === activeIndex}
      />
    );

  function getTransformInfo(result: RenderResult): number {
    const ul = result.container.querySelector('ul');
    const raw = ul.style.transform.split(' ');
    const parsed = raw.map(item => Number(/\(([+-]?\d+(?:\.\d+)?)/.exec(item)[1]));
    const width = (ITEM_WIDTH + ITEM_MARGIN) * TOTAL_ITEMS * 2;
    const offset = parsed[0] * width + parsed[1] + parsed[2];
    return offset;
  }

  test('should render as expected', () => {
    let result: RenderResult;
    const renderFn = jest.fn(renderImpl);
    act(() => {
      result = render(renderCarousel(renderFn, 0));
    });
    expect(result.container.querySelectorAll('.item'))
      .toHaveLength(TOTAL_ITEMS * 2);
    expect(result.container.querySelectorAll('.item[data-active][data-index="0"]'))
      .toHaveLength(2);
  });

  describe('movement', () => {
    test.each`
      direction                    | directionSign | from | to
      ${'forwards'}                | ${1}          | ${0} | ${1}
      ${'backwards'}               | ${-1}         | ${1} | ${0}
      ${'forwards across border'}  | ${1}          | ${9} | ${0}
      ${'backwards across border'} | ${-1}         | ${0} | ${9}
    `('should move $direction', ({ from, to, directionSign }) => {
      let result: RenderResult;
      act(() => {
        result = render(renderCarousel(renderImpl, from));
      });
      const ul = result.container.querySelector('ul');
      const transformBase = getTransformInfo(result);
      act(() => {
        result.rerender(renderCarousel(renderImpl, to));
      });
      const transformDiff = getTransformInfo(result) - transformBase;

      expect(ul.style.transition)
        .toMatch(/^transform /);
      expect(transformDiff * directionSign)
        .toBeLessThan(0);

      act(() => {
        fireEvent(ul, createEvent.transitionEnd(ul));
      });
      expect(ul.style.transition)
        .not.toMatch(/^transform /);
      expect(getTransformInfo(result))
        .toStrictEqual(transformBase);
    });

    test('should not be affected by item transition', () => {
      let result: RenderResult;
      act(() => {
        result = render(renderCarousel(renderImpl, 0));
      });
      const ul = result.container.querySelector('ul');
      act(() => {
        result.rerender(renderCarousel(renderImpl, 1));
      });

      act(() => {
        for (const node of result.container.querySelectorAll('.item[data-active]')) {
          fireEvent(node, createEvent.transitionEnd(node));
        }
      });
      expect(ul.style.transition)
        .toMatch(/^transform /);
    });
  });

  describe('touch', () => {
    test('should apply touch diff', () => {
      let result: RenderResult;
      act(() => {
        result = render(renderCarousel(renderImpl, 0));
      });
      const transformBase = getTransformInfo(result);

      act(() => {
        result.rerender(renderCarousel(renderImpl, 0, 0));
      });
      expect(result.container.querySelector('ul').style.transition)
        .not.toMatch(/^transform /);
      expect(getTransformInfo(result))
        .toStrictEqual(transformBase);

      act(() => {
        result.rerender(renderCarousel(renderImpl, 0, -100));
      });
      expect(result.container.querySelector('ul').style.transition)
        .not.toMatch(/^transform /);
      expect(getTransformInfo(result))
        .toBeLessThan(transformBase);

      act(() => {
        result.rerender(renderCarousel(renderImpl, 0, 100));
      });
      expect(result.container.querySelector('ul').style.transition)
        .not.toMatch(/^transform /);
      expect(getTransformInfo(result))
        .toBeGreaterThan(transformBase);
    });
  });
});
