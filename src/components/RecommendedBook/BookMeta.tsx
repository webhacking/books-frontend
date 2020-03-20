import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { slateGray60 } from '@ridi/colors';

import { authorsRenderer } from 'src/components/BookMeta/BookMeta';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
import { lineClamp } from 'src/styles';
import AtSelectIcon from 'src/svgs/Book1.svg';
import * as BookApi from 'src/types/book';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 8px;
`;

const BookTitle = styled.h2`
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.33em;
  max-height: 2.66em;
  margin-bottom: 4px;
  ${lineClamp(2)};
`;

const BookAuthor = styled.span`
  font-size: 14px;
  line-height: 1.36em;
  max-height: 1.36em;
  color: ${slateGray60};
  margin-bottom: 5px;
  ${lineClamp(1)};
`;

const AvailableOnSelectContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: bold;
  color: #22b8cf;
`;

const selectIconStyle = css`
  width: 14px;
  height: 12px;
  margin-right: 6px;
  fill: #22b8cf;
`;

interface BookMetaProps {
  book: BookApi.Book;
  showSelect?: boolean;
}

function BookMeta(props: BookMetaProps) {
  if (props.book.is_deleted) {
    return null;
  }

  const authors = props.book.authors.filter((author) => (
    [
      'author',
      'comic_author',
      'story_writer',
      'illustrator',
      'original_author',
    ].includes(author.role)
  ));
  return (
    <Wrapper>
      <a
        css={css`display: inline-block;`}
        href={`/books/${props.book.id}`}
      >
        <BookTitle>
          {bookTitleGenerator(props.book)}
        </BookTitle>
      </a>
      {authors && <BookAuthor>{authorsRenderer(authors)}</BookAuthor>}
      {props.book.clientBookFields?.isAvailableSelect && (
        <AvailableOnSelectContainer
          role="img"
          aria-label="리디셀렉트 이용 가능 도서"
        >
          <AtSelectIcon css={selectIconStyle} />
          리디셀렉트
        </AvailableOnSelectContainer>
      )}
    </Wrapper>
  );
}

export default React.memo(BookMeta);
