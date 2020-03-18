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

interface BookMetaProps {
  book: BookApi.Book;
  showSelect?: boolean;
}

function BookMeta(props: BookMetaProps) {
  const authors = props.book?.authors.filter((author) => (
    [
      'author',
      'comic_author',
      'story_writer',
      'illustrator',
      'original_author',
    ].includes(author.role)
  )) ?? [];
  return (
    <Wrapper>
      <a
        css={css`display: inline-block;`}
        href={`/books/${props.book.id}`}
      >
        <BookTitle aria-label={props.book?.title?.main || ''}>
          {bookTitleGenerator(props.book)}
        </BookTitle>
      </a>
      {props.book.authors && <BookAuthor>{authorsRenderer(authors)}</BookAuthor>}
      {props.book?.clientBookFields.isAvailableSelect && (
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
          aria-label="리디 셀렉트 이용 가능 도서"
        >
          <AtSelectIcon
            css={css`
              width: 14px;
              fill: #22b8cf;
              height: 12px;
              margin-right: 6px;
            `}
          />
          <span
            css={css`
              font-size: 13px;
              font-weight: bold;
              color: #22b8cf;
            `}
          >
            리디셀렉트
          </span>
        </div>
      )}
    </Wrapper>
  );
}

export default React.memo(BookMeta);
