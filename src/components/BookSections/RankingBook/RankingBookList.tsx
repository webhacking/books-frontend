import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Book } from '@ridi/web-ui/dist/index.node';
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
import { ReadingRanking } from 'src/types/sections';

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
  font-size: 18px;
  font-weight: 500;
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
  url?: string;
  showTimer: boolean;
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

const RankingBookList: React.FC<RankingBookListProps> = props => {
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '50px');
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);
  return (
    <>
      <SectionWrapper ref={targetRef}>
        {props.title && (
          <RankingBookTitle>
            {props.showTimer && <Timer />}
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
        <div
          css={css`
            position: relative;
            height: ${props.type === 'big' ? '402px' : '249px'};
            margin-bottom: 62px;
          `}>
          <ul css={listCSS} ref={ref}>
            {props.items.slice(0, 9).map((book, index) => (
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
                        : `https://misc.ridibooks.com/cover/${book.b_id}/medium`
                    }
                    adultBadge={false}
                  />
                </div>
                <div className={'book-meta-box'}>
                  <div css={rankCSS}>{index + 1}</div>
                  {/* <BookMeta> */}
                  {/*  book={book}*/}
                  {/*  showRating={props.type === 'big'}*/}
                  {/*  titleLineClamp={props.type === 'small' ? 1 : 2}*/}
                  {/*  showSomeDeal={false}*/}
                  {/*  isAIRecommendation={false}*/}
                  {/*  width={props.type === 'big' ? '177px' : null}*/}
                  {/*  </> */}
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
};

export default RankingBookList;
