import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import ScrollContainer from 'src/components/ScrollContainer';
import { DisplayType } from 'src/types/sections';

import ListItem from './RecommendedBookItem';
import { RecommendedBookProps } from './types';

const BookList = styled.ul<{ type: RecommendedBookProps['type'] }>`
  flex: none;
  margin-left: 10px;

  // 썸네일 상단, 좌측 절대 위치로 빠져나온 7px의 여유값
  padding-top: 7px;
  padding-left: 7px;
  display: flex;
  flex-wrap: nowrap;
  @media (min-width: 1000px) {
    margin-left: 0;
    justify-content: center;
  }
`;

const containerAdjustStyle = css`
  // <BooksCarouselWrapper /> margin -8px 과 같은 맥락의 음수 마진
  margin-top: -7px;
`;

const hotReleaseMargin = css`
  margin-right: 12px;
  @media (min-width: 834px) {
    margin-right: 20px;
  }
  @media (min-width: 1000px) {
    margin-right: 22px;
  }
`;

const todayRecommendationMargin = css`
  align-items: center;
  margin-right: 12px;
  @media (min-width: 834px) {
    margin-right: 20px;
  }
  @media (min-width: 1000px) {
    margin-right: 22px;
  }
`;

function RecommendedBookList(props: Omit<RecommendedBookProps, 'title'>) {
  const {
    theme, type, slug, genre,
  } = props;

  const { items } = props;
  const carouselItems = React.useMemo(
    () => items
      .filter((book) => book.detail)
      .map((book, index) => (
        <ListItem
          key={index}
          book={book}
          index={index}
          type={type}
          theme={theme}
          slug={slug}
          genre={genre}
          css={
              props.type === DisplayType.HotRelease
                ? hotReleaseMargin
                : todayRecommendationMargin
            }
        />
      )),
    [items, type, theme, slug],
  );

  return (
    <div
      css={css`
        position: relative;
        margin: 20px auto 0;

        @media (min-width: 1000px) {
          width: 964px; // 950 + 14
        }
      `}
    >
      <ScrollContainer css={containerAdjustStyle}>
        <BookList type={type}>
          {carouselItems}
        </BookList>
      </ScrollContainer>
    </div>
  );
}

export default React.memo(RecommendedBookList);
