import { render, cleanup } from '@testing-library/react';

import { getEscapedNode } from 'src/utils/highlight';

afterEach(() => cleanup());

describe('getEscapedNode', () => {
  it.each([
    ['normal text with <angular brackets>', 'normal text with <angular brackets>'],
    ['some <strong>bold</strong> texts', 'some bold texts'],
    ['nes<strong>ted<strong> bold</strong> tex</strong>ts', 'nested bold texts'],
    ['tag <strong class="foo">with class</strong>', 'tag with class'],
  ])('should escape correctly', (source, plainText) => {
    const renderResult = render(getEscapedNode(source));
    expect(renderResult.container).toMatchSnapshot();
    expect(renderResult.container.textContent).toEqual(plainText);
  });
});
