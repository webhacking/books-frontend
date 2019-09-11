import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { BookScheme } from 'src/types/book';
import { css } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
import BookMeta from 'src/components/BookMeta/BookMeta';
import { RankingBookTitle } from 'src/components/BookSections/BookSectionContainer';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import ArrowV from 'src/svgs/ArrowV.svg';
import { scrollBarHidden } from 'src/styles';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  ${greaterThanOrEqualTo(
    BreakPoint.MD + 1,
    css`
      padding-left: 20px;
      padding-right: 20px;
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      padding-left: 24px;
      padding-right: 24px;
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.LG,
    css`
      overflow: auto;
    `,
  )};
  ${scrollBarHidden};
  overflow: hidden;
`;

const listCSS = css`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
`;

const itemCSS = css`
  display: flex;
  align-items: center;
  box-sizing: content-box;
  padding-right: 14px;
  .book-meta-box {
    display: flex;
    align-items: center;
    border-bottom: 1px #e6e8eb solid;
    height: 100%;
    width: 100%;
  }
  :nth-of-type(3n) {
    .book-meta-box {
      border-bottom: 0;
    }
  }
`;

const bigItemCSS = css`
  ${itemCSS};
  height: 133.7px;
  width: 308px;
`;

const smallItemCSS = css`
  ${itemCSS};
  height: 83px;
  width: 308px;
`;

const rankCSS = css`
  height: 22px;
  font-family: 'Roboto';
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: #000000;
  margin-right: 21px;
`;

interface RankingBookListProps {
  items: BookScheme[];
  type: 'small' | 'big';
  title?: string;
  url?: string;
}

const RankingBookList: React.FC<RankingBookListProps> = props => {
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '50px');
  return (
    <>
      {props.title && (
        <RankingBookTitle>
          {props.url ? (
            // Todo Refactor
            <a href={props.url}>
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
        </RankingBookTitle>
      )}
      <SectionWrapper
        ref={targetRef}
        css={css`
          padding-top: ${props.type === 'big' ? '6px' : '7px'};
          height: ${props.type === 'big' ? '464px' : '311px'};
        `}>
        <div
          css={css`
            display: inline;
          `}>
          <ul css={listCSS}>
            {props.items.map((book, index) => (
              <li css={props.type === 'big' ? bigItemCSS : smallItemCSS} key={index}>
                <div
                  css={css`
                    margin-right: ${props.type === 'big' ? '18px' : '24px'};
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  `}>
                  <Book.Thumbnail
                    thumbnailWidth={props.type === 'big' ? 80 : 50}
                    thumbnailUrl={
                      !isIntersecting
                        ? 'https://static.ridibooks.com/books/dist/images/book_cover/cover_lazyload.png'
                        : `https://misc.ridibooks.com/cover/${book.bId}/medium`
                    }
                    adultBadge={book.isAdult}
                  />
                </div>
                <div className={'book-meta-box'}>
                  <div css={rankCSS}>{index + 1}</div>
                  <BookMeta
                    book={book}
                    showRating={props.type === 'big'}
                    titleLineClamp={props.type === 'small' ? 1 : 2}
                    showSomeDeal={false}
                    isAIRecommendation={false}
                    width={props.type === 'big' ? '177px' : null}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>
    </>
  );
};

export default RankingBookList;
