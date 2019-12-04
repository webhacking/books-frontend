import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import SliderCarousel from 'react-slick';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { flexCenter } from 'src/styles';
import Arrow from 'src/components/Carousel/Arrow';
import uiOption from 'src/constants/ui';
import { ForwardedRefComponent } from 'src/components/Carousel/LoadableCarousel';
import { between, BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import { TopBanner } from 'src/types/sections';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import { useEventTracker } from 'src/hooks/useEveneTracker';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const TOP_BANNER_LG_WIDTH = 430;
const TOP_BANNER_SM_WIDTH = 355;

const slideOverlayCSS = css`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
  transition: background-color 0.1s;
`;

const slideCenterOverlayCSS = css`
  background: rgba(0, 0, 0, 0);
  transition: background-color 0.1s;
`;

const TopBannerItemWrapper = styled.div`
  position: relative;
  ${flexCenter};
  flex-shrink: 0;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin: 0 5px;
    `,
  )};
  margin: 0;
`;

const sliderCSS = css`
  .slick-list {
    height: 100%;
  }
  .slick-track {
    will-change: transform;
  }
  &.slick-slider {
    ${greaterThanOrEqualTo(
      BreakPoint.XS + 1,
      css`
        height: calc((100vw - 20px) / 1.5);
      `,
    )};

    ${greaterThanOrEqualTo(
      BreakPoint.SM + 1,
      css`
        height: calc(${TOP_BANNER_SM_WIDTH}px / 1.5);
      `,
    )};

    ${greaterThanOrEqualTo(
      BreakPoint.LG + 1,
      css`
        height: calc(${TOP_BANNER_LG_WIDTH}px / 1.5);
      `,
    )};
  }
  ${greaterThanOrEqualTo(
    BreakPoint.XS + 1,
    css`
      .slick-slide {
        .slide-overlay {
          ${slideOverlayCSS};
          min-width: 280px;
          width: calc(100vw - 20px);
          height: calc((100vw - 20px) / 1.5);
        }
      }

      .slick-slide.slick-center {
        .slide-overlay {
          ${slideCenterOverlayCSS};
        }
      }
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.SM + 1,
    css`
      .slick-slide {
        .slide-overlay {
          ${slideOverlayCSS};
          height: 100%;
          width: ${TOP_BANNER_SM_WIDTH}px;
        }
      }

      .slick-slide.slick-center {
        .slide-overlay {
          ${slideCenterOverlayCSS};
        }
      }
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      &.slick-slider {
        overflow: hidden;
        height: calc(${TOP_BANNER_LG_WIDTH}px / 1.5);
      }
      .slick-slide {
        .slide-item-inner {
          height: calc(${TOP_BANNER_LG_WIDTH}px / 1.5);
          width: ${TOP_BANNER_LG_WIDTH}px;
          transform: scale(0.965);
          margin: 0 -2.5px;
          transition: all 0.2s;
        }
      }
      .slick-slide.slick-center {
        width: 439px;
        .slide-item-inner {
          height: calc(${TOP_BANNER_LG_WIDTH}px / 1.5);
          width: ${TOP_BANNER_LG_WIDTH}px;
          transform: scale(1);
          transition: all 0.2s;
        }
      }

      .slick-slide {
        .slide-overlay {
          top: 0;
          width: ${TOP_BANNER_LG_WIDTH}px;
          left: -2px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.5);
          transition: all 0.2s;
          transform: scale(0.965);
        }
      }
      .slick-slide.slick-center {
        .slide-overlay {
          width: ${TOP_BANNER_LG_WIDTH}px;
          transform: scale(1);
          transition: all 0.2s;
        }
      }
    `,
  )};
  .slide-overlay {
    height: 100%;
  }
  .slick-position {
    display: none;
  }
  .slick-slide.slick-center {
    .slick-position {
      display: block;
    }
  }
  .slick-slide {
    ${flexCenter};
    ${greaterThanOrEqualTo(
      BreakPoint.SM + 1,
      css`
        height: 237px;
      `,
    )};
    ${greaterThanOrEqualTo(
      BreakPoint.LG + 1,
      css`
        height: calc(${TOP_BANNER_LG_WIDTH}px / 1.5);
      `,
    )};
  }
`;

const slideCSS = css`
  ${greaterThanOrEqualTo(
    BreakPoint.XS + 1,
    css`
      min-width: 280px;
      width: calc(100vw - 20px);
      height: calc((100vw - 20px) / 1.5);
    `,
  )};
  ${greaterThanOrEqualTo(
    BreakPoint.SM + 1,
    css`
      width: ${TOP_BANNER_SM_WIDTH}px;
      height: calc(${TOP_BANNER_SM_WIDTH}px / 1.5);
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      width: ${TOP_BANNER_LG_WIDTH}px;
      transform: scale(0.965);
      height: calc(${TOP_BANNER_LG_WIDTH}px / 1.5);
    `,
  )}
`;

const ItemInner = styled.div`
  border-radius: 6px;
  background-size: cover;
  ${slideCSS};
`;

const TopBannerCurrentPositionInner = styled.div`
  position: absolute;
  width: 54px;
  height: 24px;
  border-radius: 12px;
  border: solid 1px rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.4);
  right: 10px;
  bottom: 10px;
  ${flexCenter};
`;

const positionLabelCSS = css`
  color: white;
  font-size: 12px;
  line-height: 22px;
`;

const currentPosCSS = css`
  font-weight: bold;
  ${positionLabelCSS};
`;

const totalCountCSS = css`
  font-weight: 500;
  ${positionLabelCSS};
`;

const carouselLoadingOverlay = css`
  position: absolute;
  top: 0;
  left: 1px;
  border-radius: 6px;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  ${slideCSS};
`;

interface TopBannerCurrentPositionProps {
  total: number;
  currentPosition: number;
}

const TopBannerCurrentPosition: React.FC<TopBannerCurrentPositionProps> = props => (
  <TopBannerCurrentPositionInner className={'slick-position'}>
    <span css={currentPosCSS}>
      {props.currentPosition} / <span css={totalCountCSS}>{props.total}</span>
    </span>
  </TopBannerCurrentPositionInner>
);

interface TopBannerItemProps {
  item: TopBanner;
  loading?: boolean;
  center?: boolean;
}

const BannerBadgeRenderer: React.FC<{
  badge: 'END_TODAY' | 'END_IN_3DAY' | null;
}> = props => {
  const { badge } = props;
  if (!badge) {
    return null;
  }
  if (badge === 'END_TODAY') {
    return (
      <img
        css={css`
          position: absolute;
          top: 12px;
          right: 12px;
        `}
        alt="오늘 마감"
        width={44}
        height={44}
        src={`${publicRuntimeConfig.STATIC_CDN_URL}/static/image/expired_today.png`}
      />
    );
  }
  if (badge === 'END_IN_3DAY') {
    return (
      <img
        css={css`
          position: absolute;
          top: 12px;
          right: 12px;
        `}
        alt={'마감 임박'}
        width={44}
        height={44}
        src={`${publicRuntimeConfig.STATIC_CDN_URL}/static/image/expired_soon.png`}
      />
    );
  }

  return null;
};

const TopBannerItem: React.FC<TopBannerItemProps> = React.memo(props => {
  const wrapperRef = React.useRef<HTMLInputElement>();
  const isIntersecting = useIntersectionObserver(wrapperRef, '0px');
  // Todo Impression
  if (isIntersecting) {
    // console.log(isIntersecting, props.item.title);
    if (wrapperRef.current) {
      // console.log(wrapperRef.current.parentNode.parentNode.parentNode);
    }
  }
  return (
    <TopBannerItemWrapper ref={wrapperRef}>
      <ItemInner
        className={'slide-item-inner'}
        css={css`
          position: relative;
          ${greaterThanOrEqualTo(
            BreakPoint.LG + 1,
            css`
              transform: ${props.loading && !props.center ? 'scale(0.965)' : 'scale(1)'};
              margin: ${props.loading ? '0 1px' : '0'};
            `,
          )};
        `}>
        <img
          css={css`
            border-radius: 6px;
            // Fix me 올바른 사이즈 배너가 올 때 다시 테스트
            object-fit: cover; // IE 11 미지원
            object-position: 0 0; // IE 11 미지원

            ${greaterThanOrEqualTo(
              BreakPoint.XS,
              css`
                width: calc(100vw - 20px);
                min-width: 280px;
                height: calc((100vw - 20px) / 1.5);
              `,
            )};
            ${greaterThanOrEqualTo(
              BreakPoint.SM + 1,
              css`
                width: ${TOP_BANNER_SM_WIDTH}px;
                height: 237px;
              `,
            )};

            ${greaterThanOrEqualTo(
              BreakPoint.LG + 1,
              css`
                width: ${TOP_BANNER_LG_WIDTH}px;
                height: 286px;
              `,
            )}
          `}
          alt={props.item.title}
          src={props.item.main_image_url}
        />
        {props.item.is_badge_available && (
          <BannerBadgeRenderer badge={props.item.badge} />
        )}
      </ItemInner>
      <div
        css={props.loading && !props.center ? carouselLoadingOverlay : null}
        className={'slide-overlay'}
      />
    </TopBannerItemWrapper>
  );
});

const arrowCSS = css`
  :hover {
    opacity: 1;
  }
  opacity: 0.5;
  transition: opacity 0.1s;
  cursor: pointer;
  @media (hover: none) {
    :hover {
      opacity: 0.5;
    }
  }
`;

const arrowWrapperCSS = (position: 'left' | 'right') => css`
  display: none;
  ${between(
    300,
    568,
    css`
      display: block;
      position: absolute;
      opacity: 0.7;
      bottom: 117px;
      ${position === 'right'
        ? 'transform: translate(-115%, 20px);'
        : 'transform: translate(115%, 20px);'};
    `,
  )};
  ${between(
    569,
    BreakPoint.LG,
    css`
      display: block;
      position: absolute;
      opacity: 0.7;
      bottom: 117px;
      ${position === 'right' ? 'right: calc(50% - 220px);' : 'left: calc(50% - 220px);'};
    `,
  )};

  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      display: block;
      position: absolute;
      opacity: 0.7;
      bottom: 143.5px;
      ${position === 'right' ? 'right: calc(50% - 257px);' : 'left: calc(50% - 257px);'};
    `,
  )};
`;

const PositionOverlay = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  height: 0;
  background: transparent;
  left: 50%;
  transform: translate(-50%, 0);
  ${greaterThanOrEqualTo(
    BreakPoint.XS + 1,
    css`
      width: calc(100vw - 20px);
      min-width: 280px;
    `,
  )};
  ${greaterThanOrEqualTo(
    BreakPoint.SM + 1,
    css`
      width: ${TOP_BANNER_SM_WIDTH}px;
    `,
  )};
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      width: ${TOP_BANNER_LG_WIDTH}px;
    `,
  )};
`;

const TopBannerCarouselWrapper = styled.section`
  max-width: 100%;
  margin: 0 auto;
  position: relative;
`;

interface TopBannerCarouselProps {
  banners: TopBanner[];
  slug: string;
  changePosition: (pos: number) => void;
  setInitialized: () => void;
  forwardRef: React.RefObject<SliderCarousel>;
  isIntersecting: boolean;
}
interface TopBannerCarouselContainerProps {
  banners: TopBanner[];
  slug: string;
}

interface TopBannerCarouselLoadingProps {
  left: TopBanner;
  center: TopBanner;
  right: TopBanner;
}

const TopBannerCarouselLoading: React.FC<TopBannerCarouselLoadingProps> = props => (
  <div
    css={css`
      ${flexCenter};
      @media (max-width: 1279px) and (-ms-high-contrast: none),
        (-ms-high-contrast: active) {
        // position: relative;
        //left: calc(100vw - 10px);
        // transform: translateX(-50%);
        //display: none;

        //  IE11 flex center 확인
      }
    `}>
    <TopBannerItem loading={true} item={props.left} />
    <TopBannerItem center={true} loading={true} item={props.center} />
    <TopBannerItem loading={true} item={props.right} />
  </div>
);

const TopBannerCarousel: React.FC<TopBannerCarouselProps> = React.memo(props => {
  const { banners, forwardRef, setInitialized, isIntersecting } = props;
  const [tracker] = useEventTracker();

  return (
    <ForwardedRefComponent
      ref={forwardRef}
      className={'center slider variable-width'}
      css={sliderCSS}
      slidesToShow={1}
      initialSlide={0}
      slidesToScroll={1}
      speed={uiOption.topBannerCarouselSpeed}
      autoplaySpeed={uiOption.topBannerCarouselPlaySpeed}
      autoplay={true}
      arrows={false}
      infinite={true}
      variableWidth={true}
      afterChange={(next: number) => {
        let event = null;
        if (typeof Event === 'function') {
          event = new Event('resize');
        } else {
          event = document.createEvent('Event');
          event.initEvent('resize', true, true);
        }
        window.dispatchEvent(event);
        props.changePosition(next);

        if (isIntersecting) {
          tracker.sendEvent('display', {
            section: props.slug,
            items: [
              {
                id: banners[next]?.id,
                order: next,
                ts: new Date().getTime(),
              },
            ],
          });
        }
      }}
      onInit={() => {
        setInitialized();
        const firstItem = {
          id: banners[0]?.id,
          order: 0,
          ts: new Date().getTime(),
        };
        tracker.sendEvent('display', {
          section: props.slug,
          items: [firstItem],
        });
      }}
      centerMode={true}>
      {banners.map((item, index) => (
        <a
          css={css`
            outline: none;
          `}
          href={item.landing_url}
          key={index}
          aria-label={item.title}>
          <TopBannerItem item={item} />
        </a>
      ))}
    </ForwardedRefComponent>
  );
});

export const TopBannerCarouselContainer: React.FC<TopBannerCarouselContainerProps> = React.memo(
  props => {
    const [carouselInitialized, setCarouselInitialized] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const { banners, slug } = props;
    const slider = React.useRef<SliderCarousel>();
    const wrapper = React.useRef<HTMLElement>();

    let firstClientX = 0;
    let clientX = 0;

    const changePosition = useCallback(item => {
      setCurrentPosition(item || 0);
    }, []);
    const setInitialized = useCallback(() => {
      setCarouselInitialized(true);
    }, []);

    const handleClickLeft = (e: FormEvent) => {
      e.preventDefault();
      if (slider.current) {
        slider.current.slickPrev();
      }
    };
    const handleClickRight = (e: FormEvent) => {
      e.preventDefault();
      if (slider.current) {
        slider.current.slickNext();
      }
    };

    const preventTouch = e => {
      const minValue = 5; // threshold

      clientX = e.touches[0].clientX - firstClientX;

      // Vertical scrolling does not work when you start swiping horizontally.
      if (Math.abs(clientX) > minValue) {
        e.preventDefault();
        e.returnValue = false;

        return false;
      }
      return e;
    };

    const touchStart = e => {
      firstClientX = e.touches[0].clientX;
    };

    const isIntersecting = useIntersectionObserver(wrapper, '0px');

    useEffect(() => {
      if (wrapper.current) {
        wrapper.current.addEventListener('touchstart', touchStart, { passive: false });
        wrapper.current.addEventListener('touchmove', preventTouch, {
          passive: false,
        });
      }

      return () => {
        if (wrapper.current) {
          wrapper.current.removeEventListener('touchstart', touchStart);
          wrapper.current.removeEventListener('touchmove', preventTouch, {
            // @ts-ignore
            passive: false,
          });
        }
      };
    }, [wrapper]);

    if (banners.length < 3) {
      return null;
    }
    return (
      <TopBannerCarouselWrapper ref={wrapper}>
        {!carouselInitialized && (
          <TopBannerCarouselLoading
            left={banners[banners.length - 1]}
            center={banners[0]}
            right={banners[1]}
          />
        )}
        <>
          <TopBannerCarousel
            isIntersecting={isIntersecting}
            forwardRef={slider}
            banners={banners}
            slug={slug}
            changePosition={changePosition}
            setInitialized={setInitialized}
          />
          <PositionOverlay>
            <TopBannerCurrentPosition
              total={banners.length}
              currentPosition={currentPosition + 1}
            />
          </PositionOverlay>
          <form>
            <div
              css={css`
                ${arrowWrapperCSS('left')};
                left: -40px;
                transform: translate(-50%, 50%);
              `}>
              <Arrow
                side={'left'}
                onClickHandler={handleClickLeft}
                label={'이전'}
                wrapperStyle={css`
                  ${arrowCSS};
                  opacity: 0.5;
                `}
              />
            </div>
            <div
              css={css`
                ${arrowWrapperCSS('right')};
                transform: translate(50%, 50%);
                right: -40px;
              `}>
              <Arrow
                onClickHandler={handleClickRight}
                side={'right'}
                label={'다음'}
                wrapperStyle={css`
                  ${arrowCSS};
                  opacity: 0.5;
                `}
              />
            </div>
          </form>
        </>
      </TopBannerCarouselWrapper>
    );
  },
);
