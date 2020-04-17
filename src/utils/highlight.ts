import React from 'react';

/**
 * <strong></strong>을 ReactNode로 변환합니다.
 */
export function getEscapedNode(source: string): React.ReactNode {
  const nodeStack: React.ReactNode[] = [];
  let stackPointer = 0;
  let starts = 0;
  let key = 0;
  const regex = /<(\/?)strong>/gi;

  // 왜 린터가 while (true)도 막고 while (match = regex.exec(source))도 막고 그럴까요?
  let match: RegExpExecArray | null = regex.exec(source);
  while (match != null) {
    const idx = match.index;
    const closing = match[1] === '/';
    const previousText = source.substring(starts, idx);
    starts = idx + match[0].length;
    nodeStack.push(previousText);
    stackPointer += (closing ? -1 : 1);
    if (stackPointer < 0) {
      // 여는 태그가 없었기 때문에 닫는 태그를 그대로 출력
      nodeStack.push(match[0]);
      stackPointer = 0;
    } else if (closing) {
      // 여는 태그까지 접기
      const lastIdx = nodeStack.lastIndexOf(true);
      const node = React.createElement(
        'strong',
        { key: `strong-${key}` },
        nodeStack.slice(lastIdx + 1),
      );
      key += 1;
      nodeStack.splice(lastIdx, nodeStack.length - lastIdx, node);
    } else {
      nodeStack.push(true);
    }

    match = regex.exec(source);
  }
  nodeStack.push(source.substring(starts));
  return nodeStack;
}

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
