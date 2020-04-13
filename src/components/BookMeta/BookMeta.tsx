import * as React from 'react';
import { css, Interpolation } from '@emotion/core';
import styled from '@emotion/styled';
import { lineClamp } from 'src/styles';
import * as BookApi from 'src/types/book';
import { computeBookTitle } from 'src/utils/bookTitleGenerator';
import { getEscapedNode } from 'src/utils/highlight';
import { orBelow } from 'src/utils/mediaQuery';
import { slateGray60 } from '@ridi/colors';

const BookTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 1.33em;
  color: #000000;
  max-height: 2.7em;
  margin-bottom: 4.5px;
  ${orBelow(
    999,
    'font-size: 14px;',
  )}
`;

const Container = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  transition: opacity 0.2s ease-in-out;
`;

const AuthorsWrapper = styled.span`
  height: 19px;
  font-size: 14px;
  line-height: 1.36;
  color: ${slateGray60};
  margin-bottom: 2px;
  ${lineClamp(1)};
`;

function AuthorAnchor(props: { author: BookApi.Author }) {
  const { id, name } = props.author;
  return (
    <a
      href={
        id
          ? `/author/${id}`
          : `/search?q=${encodeURIComponent(name)}`
      }
    >
      {name}
    </a>
  );
}

function Authors(props: { authors: BookApi.Author[] }) {
  const { authors } = props;
  const len = authors.length;
  if (len === 0) {
    return null;
  }
  if (len === 1) {
    return <AuthorAnchor author={authors[0]} />;
  }
  if (len === 2) {
    return (
      <>
        <AuthorAnchor author={authors[0]} />
        {', '}
        <AuthorAnchor author={authors[1]} />
      </>
    );
  }

  // len > 2
  return (
    <>
      <AuthorAnchor key="0" author={authors[0]} />
      {', '}
      <AuthorAnchor key="1" author={authors[1]} />
      {` 외 ${len - 2}명`}
    </>
  );
}

interface BookMetaBaseProps {
  book: BookApi.ClientBook;
  titleLineClamp?: number;
  width?: string;
  bookTitleStyle?: Interpolation;
  className?: string;
  children?: React.ReactNode;
}

const BookMetaBase: React.FC<BookMetaBaseProps> = (props) => {
  if (props.book.is_deleted) {
    return null;
  }
  const {
    book: {
      authors,
    },
    titleLineClamp,
    width,
    bookTitleStyle,
    className,
    children,
  } = props;

  const mergedAuthors = authors.filter(
    (author) => ['author', 'comic_author', 'story_writer', 'illustrator', 'original_author'].includes(author.role),
  );

  return (
    <Container
      className={className}
      css={width && css`width: ${width};`}
    >
      <a href={`/books/${props.book.id}`}>
        <BookTitle
          css={[bookTitleStyle, lineClamp(titleLineClamp || 2)]}
          aria-label={props.book.title.main}
        >
          {getEscapedNode(computeBookTitle(props.book))}
        </BookTitle>
      </a>
      <AuthorsWrapper>
        <Authors authors={mergedAuthors} />
      </AuthorsWrapper>
      {children}
    </Container>
  );
};

export default React.memo(BookMetaBase);
