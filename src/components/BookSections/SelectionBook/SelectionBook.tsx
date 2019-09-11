import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { BookScheme } from 'src/types/book';
import { View, WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import SelectionBookList from 'src/components/BookSections/SelectionBook/SelectionBookList';
import SelectionBookCarousel from 'src/components/BookSections/SelectionBook/SelectionBookCarousel';
import BookMeta from 'src/components/BookMeta/BookMeta';
import { Book } from '@ridi/web-ui/dist/index.node';
import { css } from '@emotion/core';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import {
  SectionTitle,
  SelectionOption,
} from 'src/components/BookSections/BookSectionContainer';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import ArrowV from 'src/svgs/ArrowV.svg';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 6px;
  -webkit-overflow-scrolling: touch;
`;

interface SelectionBookProps {
  items: BookScheme[];
  title: string;
  url?: string;
  option: SelectionOption;
}

interface SelectionBookItemProps {
  book: BookScheme;
  isAIRecommendation: boolean;
  width: number;
}

export const SelectionBookItem: React.FC<SelectionBookItemProps> = props => {
  const { book, isAIRecommendation } = props;
  return (
    <>
      <ThumbnailWrapper>
        <Book.Thumbnail
          thumbnailWidth={props.width || 140}
          thumbnailUrl={`https://misc.ridibooks.com/cover/${book.bId}/xxlarge`}
          adultBadge={book.isAdult}
          css={css``}
        />
      </ThumbnailWrapper>
      <BookMeta
        book={book}
        width={`${props.width || 140}px`}
        showRating={true}
        isAIRecommendation={false}
      />
      {isAIRecommendation && (
        <button
          css={css`
            margin-top: 8px;
            border-radius: 4px;
            border: solid 1px #d6d6d6;
            padding: 6px 7px;
            font-size: 10px;
            font-weight: bold;
            line-height: 1;
            color: #aaaaaa;
            outline: none;
          `}>
          추천 제외
        </button>
      )}
    </>
  );
};

export interface SelectionBookCarouselProps {
  items: BookScheme[];
  isAIRecommendation: boolean;
  isIntersecting?: boolean;
}

export const SelectionBookLoading: React.FC<SelectionBookCarouselProps> = props => {
  const { isIntersecting } = props;
  return (
    <ul
      css={css`
        display: flex;
        padding-left: 4px;
        padding-bottom: 48px;
      `}>
      {props.items.map((book, index) => (
        <PortraitBook key={index}>
          <ThumbnailWrapper>
            <Book.Thumbnail
              thumbnailUrl={
                !isIntersecting
                  ? 'https://static.ridibooks.com/books/dist/images/book_cover/cover_lazyload.png'
                  : `https://misc.ridibooks.com/cover/${book.bId}/xxlarge`
              }
            />
          </ThumbnailWrapper>
          <BookMeta book={book} showRating={true} />
        </PortraitBook>
      ))}
    </ul>
  );
};

const SelectionBook: React.FC<SelectionBookProps> = props => {
  const [, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Todo
  // const handleExceptAIRecommendation = (bId: string) => {
  //
  // }
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '50px');
  return (
    <SectionWrapper ref={targetRef}>
      <SectionTitle>
        {props.url ? (
          // Todo Refactor
          <a
            css={css`
              display: flex;
            `}
            href={props.url}>
            <span>{props.title}</span>
            <span
              css={css`
                margin-left: 5px;
              `}>
              <ArrowV />
            </span>
          </a>
        ) : (
          <span>{props.title}</span>
        )}
      </SectionTitle>
      {!isIntersecting ? (
        <SelectionBookLoading
          isIntersecting={isIntersecting}
          isAIRecommendation={props.option.isAIRecommendation}
          items={props.items.slice(0, 6)}
        />
      ) : (
        <WindowWidthQuery>
          <View maxWidth={1000}>
            <SelectionBookList
              isAIRecommendation={props.option.isAIRecommendation}
              items={props.items}
            />
          </View>
          <View>
            <SelectionBookCarousel
              isAIRecommendation={props.option.isAIRecommendation}
              items={props.items}
            />
          </View>
        </WindowWidthQuery>
      )}
    </SectionWrapper>
  );
};

export default SelectionBook;
