import styled from '@emotion/styled';
import isPropValid from '@emotion/is-prop-valid';
import { slateGray40, slateGray60 } from '@ridi/colors';
import * as React from 'react';

import { defaultHoverStyle } from 'src/styles';
import ArrowBoldH from 'src/svgs/ArrowBoldH.svg';
import * as SearchTypes from 'src/types/searchResults';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

import AuthorInfo from './AuthorInfo';

const AuthorItem = styled.li<{ show: boolean }>`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
`;

const AuthorList = styled.ul`
  margin-bottom: 16px;
  > li {
    ${defaultHoverStyle}
  }
`;

const ShowMoreAuthor = styled.button`
  padding: 12px 0;
  height: 46px;
  color: ${slateGray60};
  font-size: 13px;
  font-weight: bold;
  display: flex;
  cursor: pointer;
  align-items: center;
  width: 100%;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  ${orBelow(BreakPoint.LG, 'padding: 12px 16px;')}
`;

const AuthorAnchor = styled.a`
  width: 100%;
  padding: 12px 0;
  :active {
    background: rgba(0, 0, 0, 0.05);
  }
  -webkit-tap-highlight-color: rgb(0, 0, 0, 0.05);
  ${orBelow(BreakPoint.LG, 'padding: 12px 16px;')}
`;

const Arrow = styled(ArrowBoldH, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'isRotate',
})<{ isRotate: boolean }>`
  width: 11px;
  fill: ${slateGray40};
  margin-left: 5px;
  transform: rotate(${(props) => (props.isRotate ? '180deg' : '0deg')});
`;

export const MAXIMUM_AUTHOR = 30;
const DEFAULT_SHOW_AUTHOR_COUNT = 3;

function Author(props: { author: SearchTypes.Author; q: string; show: boolean }) {
  const { author, q, show } = props;
  return (
    <AuthorItem show={show}>
      <AuthorAnchor href={`/author/${author.id}?_s=search&_q=${encodeURIComponent(q)}`}>
        <AuthorInfo author={author} />
      </AuthorAnchor>
    </AuthorItem>
  );
}

export default function Authors(
  props: { author: SearchTypes.AuthorResult; q: string },
) {
  const {
    author: { authors, total },
    q,
  } = props;
  const [isShowMore, setShowMore] = React.useState(false);
  const authorsPreview = authors.slice(0, DEFAULT_SHOW_AUTHOR_COUNT);
  const restAuthors = authors.slice(DEFAULT_SHOW_AUTHOR_COUNT, authors.length);

  return (
    <AuthorList>
      {authorsPreview.map((author) => (
        <Author show key={author.id} author={author} q={q} />
      ))}
      {restAuthors.map((author) => (
        <Author show={isShowMore} key={author.id} author={author} q={q} />
      ))}
      {authors.length > DEFAULT_SHOW_AUTHOR_COUNT && (
        <li>
          <ShowMoreAuthor onClick={() => setShowMore((current) => !current)}>
            {isShowMore ? '접기' : `${Math.min(total, MAXIMUM_AUTHOR) - DEFAULT_SHOW_AUTHOR_COUNT}명 더 보기`}
            <Arrow isRotate={isShowMore} />
          </ShowMoreAuthor>
        </li>
      )}
    </AuthorList>
  );
}
