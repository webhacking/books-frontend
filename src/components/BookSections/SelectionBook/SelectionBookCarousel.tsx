import * as React from 'react';
import dynamic from 'next/dynamic';
import { css } from '@emotion/core';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarousel from 'react-slick';
import {
  SelectionBookCarouselProps,
  SelectionBookItem,
  SelectionBookLoading,
} from 'src/components/BookSections/SelectionBook/SelectionBook';

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

const Slider = dynamic(import('src/components/Carousel/LoadableCarousel'), {
  ssr: false,
  loading: () => null,
});

// @ts-ignore
// tslint:disable-next-line:no-any
const ForwardedRefComponent = React.forwardRef((props, ref: React.RefObject<any>) => {
  return <Slider {...props} forwardedRef={ref} />;
});

const SelectionBookCarousel: React.FC<SelectionBookCarouselProps> = props => {
  const [carouselInitialize, setCarouselInitialized] = useState(false);
  const slider = useRef<SliderCarousel>();
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
      <CarouselWrapper
        css={
          carouselInitialize
            ? css`
                height: 100%;
                padding-bottom: 48px;
              `
            : css`
                height: 0;
              `
        }>
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
          {props.items.map((book, index) => {
            return (
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
            );
          })}
        </ForwardedRefComponent>
        {carouselInitialize && (
          <form
            css={css`
              height: 0;
            `}>
            <button type="submit" onClick={handleLeftArrow}>
              <Arrow
                side={'left'}
                wrapperStyle={css`
                  ${arrowWrapperCSS};
                  @media (min-width: 1280px) {
                    left: -38px;
                  }
                  left: 5px;
                  top: 37%;
                `}
              />
            </button>
            <button type="submit" onClick={handleRightArrow}>
              <Arrow
                side={'right'}
                wrapperStyle={css`
                  ${arrowWrapperCSS};
                  @media (min-width: 1280px) {
                    right: -38px;
                  }
                  right: 5px;
                  top: 37%;
                `}
              />
            </button>
          </form>
        )}
      </CarouselWrapper>
    </>
  );
};

export default SelectionBookCarousel;
