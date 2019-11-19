import React, { useCallback, FormEvent, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarousel from 'react-slick';
import { Book } from '@ridi/web-ui/dist/index.node';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { ForwardedRefComponent } from 'src/components/Carousel/LoadableCarousel';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';
import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';
import { BookMeta } from 'src/components/RecommendedBook/RecommendedBook';

const recommendedBookCarouselLoadingCSS = css`
  overflow: hidden;
  .slick-slide {
    will-change: transform;
    .slide-item-inner {
      display: inline-block;
      width: 140px;
    }
  }
`;

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 1005px;
  margin: 0 auto;
  position: relative;
  padding-left: 24px;
  padding-bottom: 36px;
`;

interface RecommendedBookCarouselProps {
  items: TodayRecommendation[] | HotRelease[];
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'dark' | 'white';
}

const RecommendedBookCarouselLoading: React.FC<RecommendedBookCarouselProps> = props => (
  <ul
    css={css`
      display: flex;
      padding-left: 3px;
      justify-content: center;
      height: 365px;
    `}>
    {props.items.map((book, index) => (
      <PortraitBook key={index}>
        <ThumbnailWrapper>
          <Book.Thumbnail
            thumbnailWidth={140}
            thumbnailUrl={`https://misc.ridibooks.com/cover/${book.b_id}/xxlarge`}
          />
        </ThumbnailWrapper>
        {book.detail && <BookMeta book={book.detail} />}
      </PortraitBook>
    ))}
  </ul>
);

const RecommendedBookCarousel: React.FC<RecommendedBookCarouselProps> = props => {
  const [carouselInitialize, setCarouselInitialized] = useState(false);
  const slider = useRef<SliderCarousel>();
  const wrapperRef = useRef<HTMLDivElement>();
  const { theme, type } = props;
  // @ts-ignore
  const [isMounted, setMounted] = useState(false);

  const setInitialized = useCallback(() => {
    setCarouselInitialized(true);
  }, []);

  const handleLeftArrow = (e: FormEvent) => {
    e.preventDefault();
    if (slider.current) {
      (slider.current as SliderCarousel).slickPrev();
    }
  };
  const handleRightArrow = (e: FormEvent) => {
    e.preventDefault();
    if (slider.current) {
      (slider.current as SliderCarousel).slickNext();
    }
  };

  useEffect(() => {
    setMounted(true);
    if (carouselInitialize) {
      // @ts-ignore
      // window.slider = slider;
    }
  }, [carouselInitialize]);

  // @ts-ignore
  return (
    <>
      {/* Flickering 없는 UI 를 위해 추가함 */}
      {!carouselInitialize && (
        <RecommendedBookCarouselLoading
          theme={theme}
          type={props.type}
          items={props.items.slice(0, 6)}
        />
      )}
      <CarouselWrapper ref={wrapperRef}>
        <ForwardedRefComponent
          ref={slider}
          css={recommendedBookCarouselLoadingCSS}
          className={'slider'}
          slidesToShow={props.items.length < 6 ? props.items.length : 6}
          slidesToScroll={6}
          speed={200}
          autoplay={false}
          arrows={false}
          onInit={setInitialized}
          infinite={true}>
          {props.items.map((book, index) => (
            // @ts-ignore
            <div
              key={index}
              css={css`
                display: flex;
                flex-direction: column;
                outline: none;
              `}>
              <PortraitBook
                css={css`
                  height: 100%;
                  padding-left: 0 !important;
                `}>
                <ThumbnailWrapper>
                  <Book.Thumbnail
                    thumbnailWidth={140}
                    thumbnailUrl={`https://misc.ridibooks.com/cover/${book.b_id}/xxlarge`}
                  />
                </ThumbnailWrapper>
                {/* Todo show sentence */}
                {book.detail && type === DisplayType.HotRelease && (
                  <BookMeta book={book.detail} />
                )}
              </PortraitBook>
            </div>
          ))}
        </ForwardedRefComponent>
        {carouselInitialize && props.items.length > 6 && (
          <form>
            <Arrow
              onClickHandler={handleLeftArrow}
              label={'이전'}
              color={theme}
              side={'left'}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                ${greaterThanOrEqualTo(
                  BreakPoint.XL + 1,
                  css`
                    left: -38px;
                  `,
                )};
                left: 5px;
                top: calc(${getArrowVerticalCenterPosition(wrapperRef)});
              `}
            />
            <Arrow
              label={'다음'}
              onClickHandler={handleRightArrow}
              color={theme}
              side={'right'}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                ${greaterThanOrEqualTo(
                  BreakPoint.XL + 1,
                  css`
                    right: -38px;
                  `,
                )};
                right: 5px;
                top: calc(${getArrowVerticalCenterPosition(wrapperRef)});
              `}
            />
          </form>
        )}
      </CarouselWrapper>
    </>
  );
};

export default RecommendedBookCarousel;
