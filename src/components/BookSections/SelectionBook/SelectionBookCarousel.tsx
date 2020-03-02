import React, {
  useCallback, FormEvent, useEffect, useRef, useState,
} from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarouselWrapper from 'src/components/Carousel/CarouselWrapper';
import SliderCarousel from 'react-slick';
import {
  SelectionBookCarouselProps,
  SelectionBookItem,
  SelectionBookLoading,
} from 'src/components/BookSections/SelectionBook/SelectionBook';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';
import { useExcludeRecommendation } from 'src/hooks/useExcludeRecommedation';
import { useMultipleIntersectionObserver } from 'src/hooks/useMultipleIntersectionObserver';
import { useSendDisplayEvent } from 'src/hooks/useEventTracker';

const recommendedBookCarouselLoadingCSS = css`
  .slick-slide {
    //will-change: transform;
    .slide-item-inner {
      display: inline-block;
      width: 140px;
    }
  }
  .slick-list {
    padding-bottom: 1px; // for iPad
    position: relative;
  }
`;

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 1005px;
  max-width: 1005px;
  margin: 0 auto;
  margin-top: 6px;
  position: relative;
  height: 100%;
  padding-left: 22px;
  padding-right: 9px;
  margin-left: -6px;
`;

const BookItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  outline: none;
  margin-right: -3px;
`;

const SelectionBookCarousel: React.FC<SelectionBookCarouselProps> = React.memo((props) => {
  const [carouselInitialize, setCarouselInitialized] = useState(false);
  const slider = useRef<SliderCarousel>(null);
  const {
    genre, type, isAIRecommendation, isIntersecting, slug,
  } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [, setMounted] = useState(false);
  const setInitialized = useCallback(() => {
    setCarouselInitialized(true);
  }, []);

  const handleLeftArrow = (e: FormEvent) => {
    e.preventDefault();
    slider.current?.slickPrev();
  };
  const handleRightArrow = (e: FormEvent) => {
    e.preventDefault();
    slider.current?.slickNext();
  };
  const [requestExclude, requestCancel] = useExcludeRecommendation();
  const sendDisplayEvent = useSendDisplayEvent(slug);
  useMultipleIntersectionObserver(wrapperRef, slug, sendDisplayEvent);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { items } = props;
  const carouselItems = React.useMemo(
    () => props.items
      .filter((book) => book.detail)
      .map((book, index) => (
        <BookItemWrapper key={index}>
          <SelectionBookItem
            order={index}
            genre={genre}
            slug={slug}
            isIntersecting={isIntersecting}
            isAIRecommendation={isAIRecommendation}
            aiRecommendationCallback={{
              exclude: requestExclude,
              excludeCancel: requestCancel,
            }}
            excluded={book?.excluded ?? false}
            book={book}
            type={type}
            width={140}
          />
        </BookItemWrapper>
      )),
    [items, genre, slug, isIntersecting, isAIRecommendation, type],
  );

  return (
    <>
      {/* Flickering 없는 UI 를 위해 추가함 */}
      {!carouselInitialize && (
        <SelectionBookLoading
          genre={genre}
          type={type}
          isAIRecommendation={props.isAIRecommendation}
          items={props.items.slice(0, 6)}
        />
      )}
      <CarouselWrapper ref={wrapperRef}>
        <SliderCarouselWrapper
          forwardedRef={slider}
          css={recommendedBookCarouselLoadingCSS}
          className="slider"
          slidesToShow={Math.min(props.items.length, 6)}
          slidesToScroll={6}
          speed={200}
          autoplay={false}
          arrows={false}
          onInit={setInitialized}
          infinite
        >
          {carouselItems}
        </SliderCarouselWrapper>
        {carouselInitialize && props.items.length > 6 && (
          <form css={css`height: 0;`}>
            <Arrow
              label="이전"
              onClickHandler={handleLeftArrow}
              side="left"
              wrapperStyle={css`
                ${arrowWrapperCSS};
                ${greaterThanOrEqualTo(
                BreakPoint.XL + 1,
                css`left: -29px;`,
              )};
                left: 5px;
                top: ${getArrowVerticalCenterPosition()};
              `}
            />

            <Arrow
              label="다음"
              side="right"
              onClickHandler={handleRightArrow}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                ${greaterThanOrEqualTo(
                BreakPoint.XL + 1,
                css`right: -36px;`,
              )};
                right: 5px;
                top: ${getArrowVerticalCenterPosition()};
              `}
            />
          </form>
        )}
      </CarouselWrapper>
    </>
  );
});

export default SelectionBookCarousel;
