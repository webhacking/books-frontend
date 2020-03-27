import { act, cleanup, createEvent, fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';

import ScrollContainer from 'src/components/ScrollContainer';

import MockIO, { prepareTest } from '../utils/MockIO';

function actRenderWithDummy() {
  let component: RenderResult;
  let child: HTMLDivElement;
  act(() => {
    component = render(
      <ScrollContainer>
        <div ref={node => { child = node; }} />
      </ScrollContainer>
    );
  });
  return {
    component,
    child,
  };
}

function findMarkers(childElement: Element): [Element, Element] {
  const start = childElement.parentElement.parentElement.firstElementChild;
  const end = childElement.parentElement.parentElement.lastElementChild;
  return [start, end];
}

function queryArrowState(container: HTMLElement): [boolean, boolean] {
  const buttons = container.querySelectorAll('button');
  const left = window.getComputedStyle(buttons[0]).opacity !== '0';
  const right = window.getComputedStyle(buttons[1]).opacity !== '0';
  return [left, right];
}

describe('ScrollContainer', () => {
  prepareTest();
  afterAll(() => {
    act(() => {
      cleanup();
    });
  });

  test('should hide arrow buttons', () => {
    const { component, child } = actRenderWithDummy();
    const [startMarker, endMarker] = findMarkers(child);

    act(() => {
      MockIO.reveal(startMarker);
    });
    expect(queryArrowState(component.container)).toEqual([false, true]);

    act(() => {
      MockIO.hide(startMarker);
    });
    expect(queryArrowState(component.container)).toEqual([true, true]);

    act(() => {
      MockIO.reveal(endMarker);
    });
    expect(queryArrowState(component.container)).toEqual([true, false]);

    act(() => {
      MockIO.hide(endMarker);
    });
    expect(queryArrowState(component.container)).toEqual([true, true]);

    act(() => {
      MockIO.reveal(startMarker);
      MockIO.reveal(endMarker);
    });
    expect(queryArrowState(component.container)).toEqual([false, false]);
  });
});
