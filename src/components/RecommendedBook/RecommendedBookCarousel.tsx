import * as React from 'react';
import { css } from '@emotion/core';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarousel from 'react-slick';
import { Book } from '@ridi/web-ui/dist/index.node';
import { BookMeta, BookScheme } from 'src/components/RecommendedBook/RecommendedBook';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { ForwardedRefComponent } from 'src/components/Carousel/LoadableCarousel';

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
  height: 372px;
`;

interface RecommendedBookCarouselProps {
  items: BookScheme[];
  type: 'hot_release' | 'single_book_recommendation';
}

const RecommendedBookCarouselLoading: React.FC<RecommendedBookCarouselProps> = props => {
  return (
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
              thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`}
            />
          </ThumbnailWrapper>
          <BookMeta book={book} />
        </PortraitBook>
      ))}
    </ul>
  );
};

const RecommendedBookCarousel: React.FC<RecommendedBookCarouselProps> = props => {
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
        <RecommendedBookCarouselLoading type={props.type} items={props.items.slice(0, 6)} />
      )}
      <CarouselWrapper>
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
                  height: 355px;
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
                      thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`}
                    />
                  </ThumbnailWrapper>
                  <BookMeta book={book} />
                </PortraitBook>
              </div>
            );
          })}
        </ForwardedRefComponent>
        {carouselInitialize && (
          <form>
            <button type="submit" onClick={handleLeftArrow}>
              <Arrow
                color={'dark'}
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
                color={'dark'}
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

export default RecommendedBookCarousel;
