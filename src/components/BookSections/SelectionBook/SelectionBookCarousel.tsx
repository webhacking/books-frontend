import React, { useCallback, FormEvent, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarousel from 'react-slick';
import {
  SelectionBookCarouselProps,
  SelectionBookItem,
  SelectionBookLoading,
} from 'src/components/BookSections/SelectionBook/SelectionBook';
import { ForwardedRefComponent } from 'src/components/Carousel/LoadableCarousel';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';

const recommendedBookCarouselLoadingCSS = css`
  .slick-slide {
    will-change: transform;
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
  position: relative;
  height: 100%;
  padding-bottom: 48px;
  padding-left: 22px;
  padding-right: 9px;
  margin-left: -6px;
`;

const SelectionBookCarousel: React.FC<SelectionBookCarouselProps> = props => {
  const [carouselInitialize, setCarouselInitialized] = useState(false);
  const slider = useRef<SliderCarousel>();
  const { genre, type, bookFetching, isIntersecting, slug } = props;
  const wrapperRef = useRef<HTMLDivElement>();
  const [, setMounted] = useState(false);
  const [arrowPosition, setArrowPosition] = useState(
    getArrowVerticalCenterPosition(wrapperRef),
  );
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
    setArrowPosition(getArrowVerticalCenterPosition(wrapperRef));
  }, [wrapperRef]);

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
        <ForwardedRefComponent
          ref={slider}
          css={recommendedBookCarouselLoadingCSS}
          className={'slider'}
          slidesToShow={Math.min(props.items.length, 6)}
          slidesToScroll={6}
          speed={200}
          autoplay={false}
          arrows={false}
          onInit={() => {
            setInitialized();
          }}
          infinite={true}>
          {props.items
            .filter(book => book.detail)
            .map((book, index) => (
              <div
                key={index}
                css={css`
                  display: flex;
                  flex-direction: column;
                  outline: none;
                  margin-right: -3px;
                `}>
                <SelectionBookItem
                  genre={genre}
                  slug={slug}
                  isIntersecting={isIntersecting}
                  isAIRecommendation={props.isAIRecommendation}
                  book={book}
                  type={type}
                  width={140}
                />
              </div>
            ))}
        </ForwardedRefComponent>
        {carouselInitialize && props.items.length > 6 && !bookFetching && (
          <form
            css={css`
              height: 0;
            `}>
            <Arrow
              label={'이전'}
              onClickHandler={handleLeftArrow}
              side={'left'}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                ${greaterThanOrEqualTo(
                  BreakPoint.XL + 1,
                  css`
                    left: -29px;
                  `,
                )};
                left: 5px;
                top: calc(${arrowPosition});
              `}
            />

            <Arrow
              label={'다음'}
              side={'right'}
              onClickHandler={handleRightArrow}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                ${greaterThanOrEqualTo(
                  BreakPoint.XL + 1,
                  css`
                    right: -36px;
                  `,
                )};
                right: 5px;
                top: calc(${arrowPosition});
              `}
            />
          </form>
        )}
      </CarouselWrapper>
    </>
  );
};

export default SelectionBookCarousel;
