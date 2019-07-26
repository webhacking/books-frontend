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
  max-width: 1005px;
  margin: 0 auto;
  position: relative;
  padding-left: 24px;
  height: 372px;
`;

const SelectionBookCarousel: React.FC<SelectionBookCarouselProps> = props => {
  const [carouselInitialize, setCarouselInitialized] = useState(false);
  const slider = useRef<SliderCarousel>();
  const wrapperRef = useRef<HTMLDivElement>();
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
  }, []);

  return (
    <>
      {/* Flickering 없는 UI 를 위해 추가함 */}
      {!carouselInitialize && (
        <SelectionBookLoading
          isAIRecommendation={props.isAIRecommendation}
          items={props.items.slice(0, 6)}
        />
      )}
      <CarouselWrapper ref={wrapperRef}>
        <ForwardedRefComponent
          ref={slider}
          css={recommendedBookCarouselLoadingCSS}
          className={'slider'}
          slidesToShow={6}
          slidesToScroll={6}
          speed={200}
          autoplay={false}
          arrows={false}
          onInit={() => {
            setInitialized();
          }}
          infinite={true}>
          {props.items.map((book, index) => (
            <div
              key={index}
              css={css`
                display: flex;
                flex-direction: column;
                outline: none;
              `}>
              <SelectionBookItem
                isAIRecommendation={props.isAIRecommendation}
                book={book}
                width={140}
              />
            </div>
          ))}
        </ForwardedRefComponent>
        {carouselInitialize && (
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
                @media (min-width: 1280px) {
                  left: -38px;
                }
                left: 5px;
                top: calc(${getArrowVerticalCenterPosition(wrapperRef)});
              `}
            />

            <Arrow
              label={'다음'}
              side={'right'}
              onClickHandler={handleRightArrow}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                @media (min-width: 1280px) {
                  right: -38px;
                }
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

export default SelectionBookCarousel;
