import * as React from 'react';
import { Fragment } from 'react';
import { BannerItem } from 'src/components/EventBanner/EventBanner';
import dynamic from 'next/dynamic';
import { css } from '@emotion/core';
import { EventBannerItem } from 'src/components/EventBanner/index';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import styled from '@emotion/styled';
import { flexRowStart } from 'src/styles';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarousel from 'react-slick';

const eventBannerCarouselCSS = css`
  overflow: hidden;
  height: 135px;
  .slick-slide {
    will-change: transform;
    .slide-item-inner {
      display: inline-block;
      height: 135px;
      width: 306px;
      img {
        border: solid 1px #d1d5d9;
      }
    }
  }
`;

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 968px;
  margin-left: 24px;
  position: relative;
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

interface EventBannerCarouselProps {
  items: BannerItem[];
}

const EventBannerLoading: React.FC<EventBannerCarouselProps> = props => {
  return (
    <ul css={flexRowStart}>
      {props.items.map((item, index) => (
        <EventBannerItem key={index}>
          <a href={item.link}>
            <img width="100%" height="100%" src={item.imageUrl} alt={item.label} />
          </a>
        </EventBannerItem>
      ))}
    </ul>
  );
};

const EventBannerCarousel: React.FC<EventBannerCarouselProps> = props => {
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

  // 3개 이하일 경우 Carousel 보여주지 않아도 됨
  if (props.items.length < 4) {
    return <EventBannerLoading items={props.items} />;
  }

  return (
    <>
      {/* Flickering 없는 UI 를 위해 추가함 */}
      {!carouselInitialize && <EventBannerLoading items={props.items.slice(0, 3)} />}
      <CarouselWrapper>
        <ForwardedRefComponent
          ref={slider}
          css={eventBannerCarouselCSS}
          className={'slider'}
          slidesToShow={3}
          slidesToScroll={3}
          lazyLoad={'ondemand'}
          speed={200}
          autoplay={false}
          arrows={false}
          onInit={() => {
            setInitialized();
          }}
          infinite={true}>
          {props.items.map((item, index) => {
            return (
              <Fragment key={index}>
                <a href={item.link} className={'slide-item-inner'}>
                  <img width="100%" height="100%" src={item.imageUrl} alt={item.label} />
                </a>
              </Fragment>
            );
          })}
        </ForwardedRefComponent>
        {carouselInitialize && (
          <form>
            <button type="submit" onClick={handleLeftArrow}>
              <Arrow
                side={'left'}
                wrapperStyle={css`
                  ${arrowWrapperCSS};
                  transform: translate(-50%, -50%);
                  @media (min-width: 1280px) {
                    left: -40px;
                  }
                `}
              />
            </button>
            <button type="submit" onClick={handleRightArrow}>
              <Arrow
                side={'right'}
                wrapperStyle={css`
                  ${arrowWrapperCSS};
                  right: -4px;
                  transform: translate(0, -50%);
                  @media (min-width: 1280px) {
                    right: -45px;
                  }
                `}
              />
            </button>
          </form>
        )}
      </CarouselWrapper>
    </>
  );
};

export default EventBannerCarousel;
