import React from 'react';
import styled from '@emotion/styled';
import { gray100, slateGray5, slateGray50 } from '@ridi/colors';

import { AUTHOR_ICON_URL } from 'src/constants/icons';
import { lineClamp } from 'src/styles';
import * as SearchTypes from 'src/types/searchResults';
import { getEscapedNode } from 'src/utils/highlight';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const AuthorInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const AuthorName = styled.span`
  font-size: 14px;
  line-height: 1.4em;
  flex-shrink: 0;
  margin-right: 8px;
  ${orBelow(BreakPoint.LG, 'margin-right: 6px;')};
  color: ${gray100};
`;

const AuthorBooksInfo = styled.span`
  font-size: 14px;
  word-break: keep-all;
  color: ${slateGray50};
  ${lineClamp(1)};
`;

const AuthorIconWrapper = styled.span`
  width: 22px;
  height: 22px;
  margin-right: 6px;
  background: ${slateGray5};
  border-radius: 22px;
`;

const AuthorIcon = styled.img`
  padding: 5px;
`;

function AuthorSymbol() {
  return (
    <AuthorIconWrapper>
      <AuthorIcon src={AUTHOR_ICON_URL} alt="작가" />
    </AuthorIconWrapper>
  );
}

export default function AuthorInfo(props: { author: SearchTypes.Author }) {
  const { author } = props;

  return (
    <AuthorInfoWrapper>
      <AuthorSymbol />
      <AuthorName>
        {getEscapedNode(author.highlight.name || author.name)}
      </AuthorName>
      <AuthorBooksInfo>
        {`<${author.popular_book_title}>`}
        {author.book_count > 1 ? ` 외 ${author.book_count - 1}권` : ''}
      </AuthorBooksInfo>
    </AuthorInfoWrapper>
  );
}
