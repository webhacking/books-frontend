import React from 'react';

// eslint-disable-next-line
export const getEscapedString = (source: string) => {
  return source
    .replace(/</giu, '&lt;')
    .replace(/>/giu, '&gt;')
    .replace(/&lt;strong([^&]*)&gt;(.*?)&lt;\/strong&gt;/giu, '<strong$1>$2</strong>');
};

/**
 * 줄바꿈을 React <br />로 치환합니다.
 */
export function newlineToReactNode(value: string): React.ReactNode {
  const lines = value.split(/\r\n|\r|\n/g);
  const nodes = lines
    .map((line, idx) => (
      [idx !== 0 && React.createElement('br', { key: String(idx) }), line]
    ));
  return [].concat(...nodes);
}
