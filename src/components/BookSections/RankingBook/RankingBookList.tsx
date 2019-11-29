import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
// import BookMeta from 'src/components/BookMeta/BookMeta';
import { RankingBookTitle } from 'src/components/BookSections/BookSectionContainer';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import ArrowV from 'src/svgs/ArrowV.svg';
import { scrollBarHidden } from 'src/styles';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import Clock from 'src/svgs/Clock.svg';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { createTimeLabel } from 'src/utils/dateTime';
import { DisplayType, ReadingRanking, SectionExtra } from 'src/types/sections';
import BookMeta from 'src/components/BookMeta/BookMeta';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
`;

const listCSS = css`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
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
      //overflow: auto;
    `,
  )};
  ${scrollBarHidden};
  overflow-x: auto;
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
  height: 144px;
  width: 308px;
`;

const smallItemCSS = css`
  ${itemCSS};
  height: 90px;
  width: 308px;
`;

const rankCSS = css`
  height: 22px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #000000;
  margin-right: 21px;
`;

const timerWrapperCSS = css`
  border-radius: 14px;
  width: 96px;
  height: 30px;
  background-image: linear-gradient(255deg, #0077d9 4%, #72d2e0);
  font-size: 13px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 9px;
  margin-bottom: 16px;
  transition: opacity 0.3s;
`;

const arrowPosition = (side: 'left' | 'right') => css`
  ${side}: 5px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  transition: opacity 0.2s;
`;

interface RankingBookListProps {
  items: ReadingRanking[];
  type: 'small' | 'big';
  title?: string;
  showTimer: boolean;
  genre: string;
  extra?: SectionExtra;
  showSomeDeal?: boolean;
}

const Timer: React.FC = () => {
  const [label, setLabel] = useState(createTimeLabel);
  useEffect(() => {
    const timer = setInterval(() => {
      setLabel(createTimeLabel());
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [label, setLabel]);
  return (
    <div
      css={[
        timerWrapperCSS,
        !label &&
          css`
            opacity: 0;
          `,
      ]}>
      <Clock />
      <span
        css={css`
          margin-left: 7px;
        `}>
        {label}
      </span>
    </div>
  );
};

const RankingBookList: React.FC<RankingBookListProps> = React.memo(props => {
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '50px');
  const ref = useRef<HTMLUListElement>(null);
  const [books] = useBookDetailSelector(props.items);
  const { genre, type, showSomeDeal } = props;

  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);
  return (
    <>
      <SectionWrapper ref={targetRef}>
        {props.title && (
          <RankingBookTitle>
            {props.showTimer && <Timer />}
            {props.extra?.detail_link ? (
              // Todo Refactor
              <a href={props.extra.detail_link}>
                <span>{props.title}</span>
                <span
                  css={css`
                    margin-left: 7.8px;
                  `}>
                  <ArrowV />
                </span>
              </a>
            ) : (
              <span>{props.title}</span>
            )}
          </RankingBookTitle>
        )}
        <div
          css={css`
            position: relative;
            height: ${type === 'big' ? '433px' : '270px'}; // badge + (7 * 3)
            margin-bottom: 62px;
          `}>
          <ul css={listCSS} ref={ref}>
            {books
              .filter(book => book.detail)
              .slice(0, 9)
              .map((book, index) => (
                <li css={type === 'big' ? bigItemCSS : smallItemCSS} key={index}>
                  <div
                    css={css`
                      margin-right: ${props.type === 'big' ? '18px' : '24px'};
                      height: 100%;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      position: relative;
                    `}>
                    <a
                      css={css`
                        display: inline-block;
                      `}
                      href={new URL(
                        `/books/${book.b_id}`,
                        publicRuntimeConfig.STORE_HOST,
                      ).toString()}>
                      <ThumbnailRenderer
                        width={type === 'big' ? 80 : 50}
                        book={{ b_id: book.b_id, detail: book.detail }}
                        imgSize={'medium'}
                        isIntersecting={isIntersecting}>
                        <div
                          css={css`
                            position: absolute;
                            display: block;
                            top: -7px;
                            left: -7px;
                          `}>
                          <BookBadgeRenderer
                            type={DisplayType.BestSeller}
                            wrapperCSS={css``}
                            isWaitFree={book.detail?.series?.property.is_wait_free}
                            discountPercentage={
                              book?.detail?.price_info?.buy?.discount_percentage || 0
                            }
                          />
                        </div>
                        {type === 'big' && (
                          <>
                            <FreeBookRenderer
                              freeBookCount={
                                book.detail?.series?.price_info?.buy?.free_book_count || 0
                              }
                            />
                            <SetBookRenderer
                              setBookCount={book.detail?.setbook?.member_books_count}
                            />
                          </>
                        )}
                      </ThumbnailRenderer>
                    </a>
                  </div>
                  <div className={'book-meta-box'}>
                    <div css={rankCSS}>{index + 1}</div>
                    {book.detail && (
                      <BookMeta
                        book={book.detail}
                        showRating={props.type === 'big' || !!book.rating}
                        titleLineClamp={props.type === 'small' ? 1 : 2}
                        isAIRecommendation={false}
                        showSomeDeal={showSomeDeal}
                        showTag={['bl', 'bl-serial'].includes(genre)}
                        width={props.type === 'big' ? '177px' : null}
                        ratingInfo={book.rating}
                      />
                    )}
                  </div>
                </li>
              ))}
          </ul>
          <form
            css={css`
              height: 0;
              @media (hover: none) {
                display: none;
              }
              @media (min-width: 1000px) {
                display: none;
              }
            `}>
            <Arrow
              label={'이전'}
              side={'left'}
              onClickHandler={moveLeft}
              wrapperStyle={[arrowPosition('left'), !isOnTheLeft && arrowTransition]}
            />
            <Arrow
              label={'다음'}
              side={'right'}
              onClickHandler={moveRight}
              wrapperStyle={[arrowPosition('right'), !isOnTheRight && arrowTransition]}
            />
          </form>
        </div>
      </SectionWrapper>
    </>
  );
});

export default RankingBookList;
