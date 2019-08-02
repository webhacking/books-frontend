import React, { FormEvent, useCallback, useState } from 'react';
import SliderCarousel from 'react-slick';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { flexCenter } from 'src/styles';
import Arrow from 'src/components/Carousel/Arrow';
import uiOption from 'src/constants/ui';
import { ForwardedRefComponent } from 'src/components/Carousel/LoadableCarousel';
const items = [
  {
    label: '1',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603112320_1559528600505.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603112320_1559528600505.jpg',
  },
  {
    label: '2',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
  {
    label: '2',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
  {
    label: '2',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
  {
    label: '2',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
  {
    label: '2',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
    imageUrl:
      'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
];

const TopBannerItemWrapper = styled.div`
  position: relative;
  ${flexCenter};
  margin: 0 5px;
  @media (min-width: 1000px) {
    margin: unset;
  }
`;

const sliderCSS = css`
  &.slick-slider {
    @media (min-width: 300px) {
      height: calc((100vw - 20px) / 1.5);
    }
    @media (min-width: 375px) {
      height: calc(355px / 1.5);
    }
    @media (min-width: 1000px) {
      height: calc(430px / 1.5);
    }
  }
  @media (min-width: 300px) {
    .slick-slide {
      .slide-overlay {
        position: absolute;
        left: 0;
        min-width: 280px;
        width: calc(100vw - 20px);
        border-radius: 6px;
        height: calc((100vw - 20px) / 1.5);
        background: rgba(0, 0, 0, 0.5);
        transition: background-color 0.1s;
      }
    }

    .slick-slide.slick-center {
      .slide-overlay {
        background: rgba(0, 0, 0, 0);
        transition: background-color 0.1s;
      }
    }
  }

  @media (min-width: 375px) {
    .slick-slide {
      .slide-overlay {
        position: absolute;
        width: 355px;
        left: 0;
        border-radius: 6px;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        transition: background-color 0.1s;
      }
    }

    .slick-slide.slick-center {
      .slide-overlay {
        background: rgba(0, 0, 0, 0);
        transition: background-color 0.1s;
      }
    }
  }
  @media (min-width: 1000px) {
    &.slick-slider {
      overflow: hidden;
      height: calc(430px / 1.5);
    }
    .slick-slide {
      .slide-item-inner {
        height: calc(430px / 1.5);
        width: 430px;
        transform: scale(0.965);
        margin: 0 -2.5px;
        transition: all 0.2s;
      }
    }
    .slick-slide.slick-center {
      width: 439px;
      .slide-item-inner {
        height: calc(430px / 1.5);
        width: 430px;
        transform: scale(1);
        transition: all 0.2s;
      }
    }

    .slick-slide {
      .slide-overlay {
        width: 430px;
        left: unset;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.5);
        transition: all 0.2s;
        transform: scale(0.965);
      }
    }
    .slick-slide.slick-center {
      .slide-overlay {
        width: 430px;
        transform: scale(1);
        transition: all 0.2s;
      }
    }
  }
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
    //@media (min-width: 300px) {
    //  height: calc((100vw - 20px) / 1.5);
    //}
    @media (min-width: 375px) {
      height: 237px;
    }
    @media (min-width: 1000px) {
      height: calc(430px / 1.5);
    }
  }
`;

const ItemInner = styled.div`
  border-radius: 6px;
  @media (min-width: 300px) {
    width: calc(100vw - 20px);
    height: calc((100vw - 20px) / 1.5);
  }
  @media (min-width: 375px) {
    width: 355px;
    height: calc(355px / 1.5);
  }
  @media (min-width: 1000px) {
    width: 430px;
    height: calc(430px / 1.5);
  }
  background-size: cover;
`;

const TopBannerCurrentPositionInner = styled.div`
  position: absolute;

  width: 54px;
  height: 24px;
  border-radius: 12px;
  border: solid 1px rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.4);
  right: 10px;
  bottom: 11px;
  @media (min-width: 1000px) {
    right: 16px;
    bottom: 11px;
  }
  ${flexCenter};
`;

const positionLabelCSS = css`
  color: white;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.3px;
  font-family: 'museo_sans', 'Helvetica Neue';
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
  left: 0;
  border-radius: 6px;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  @media (min-width: 300px) {
    min-width: 280px;
    width: calc(100vw - 20px);
  }
  @media (min-width: 375px) {
    width: 355px;
  }
  @media (min-width: 1000px) {
    width: 430px;
    transform: scale(0.965);
    height: calc(430px / 1.5);
  }
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
  label?: string;
  url?: string;
  imageUrl?: string;
  loading?: boolean;
  center?: boolean;
}

const TopBannerItem: React.FC<TopBannerItemProps> = React.memo(props => (
  <TopBannerItemWrapper>
    <ItemInner
      className={'slide-item-inner'}
      css={css`
          @media (min-width: 1000px) {
            transform: ${props.loading && !props.center ? 'scale(0.965)' : 'scale(1)'};
            margin: ${props.loading ? '0 1px' : '0'};
          }
          //background-image: url(${props.imageUrl});
        `}>
      <img
        css={css`
          border-radius: 6px;
          // Fix me 올바른 사이즈 배너가 올 때 다시 테스트
          object-fit: cover; // IE 11 미지원
          object-position: 0 0; // IE 11 미지원
          @media (min-width: 300px) {
            width: calc(100vw - 20px);
            min-width: 280px;
            height: calc((100vw - 20px) / 1.5);
          }
          @media (min-width: 375px) {
            width: 355px;
            height: 237px;
          }
          @media (min-width: 1000px) {
            width: 430px;
            height: 286px;
          }
        `}
        alt={props.label}
        src={props.imageUrl}
      />
    </ItemInner>
    <div
      css={props.loading && !props.center ? carouselLoadingOverlay : null}
      className={'slide-overlay'}
    />
  </TopBannerItemWrapper>
));

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

const arrowWrapperCSS = css`
  display: none;
  @media (min-width: 1000px) {
    display: initial;
    position: absolute;
    opacity: 0.7;
    bottom: 143.5px;
  }
`;

const PositionOverlay = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  height: 0;
  background: transparent;
  left: 50%;
  transform: translate(-50%, 0);
  @media (min-width: 300px) {
    width: calc(100vw - 20px);
    min-width: 280px;
  }
  @media (min-width: 375px) {
    width: 355px;
  }
  @media (min-width: 1000px) {
    width: 430px;
  }
`;

const TopBannerCarouselWrapper = styled.section`
  max-width: 100%;
  margin: 0 auto;
  position: relative;
`;

interface TopBannerCarouselProps {
  // tslint:disable-next-line:no-any
  banners: any[];
  changePosition: (pos: number) => void;
  setInitialized: () => void;
  forwardRef: React.RefObject<SliderCarousel>;
}
interface TopBannerCarouselContainerProps {
  // Todo ANY 타입 수정
  // tslint:disable-next-line:no-any
  banners?: any[];
}

interface TopBannerCarouselLoadingProps {
  left: string;
  center: string;
  right: string;
}

const TopBannerCarouselLoading: React.FC<TopBannerCarouselLoadingProps> = props => (
  <div css={flexCenter}>
    <TopBannerItem loading={true} imageUrl={props.left} />
    <TopBannerItem center={true} loading={true} imageUrl={props.center} />
    <TopBannerItem loading={true} imageUrl={props.right} />
  </div>
);

const TopBannerCarousel: React.FC<TopBannerCarouselProps> = React.memo(props => {
  const { banners, forwardRef, setInitialized } = props;
  // const [firstClientX, setFirstClientX] = useState();
  // const [firstClientY, setFirstClientY] = useState();
  // const [clientX, setClientX] = useState();
  //
  // useEffect(() => {
  //   const touchStart = e => {
  //     setFirstClientX(e.touches[0].clientX);
  //     setFirstClientY(e.touches[0].clientY);
  //   };
  //
  //   // eslint-disable-next-line consistent-return
  //   const preventTouch = e => {
  //     const minValue = 50; // threshold
  //
  //     setClientX(e.touches[0].clientX - firstClientX);
  //
  //     // Vertical scrolling does not work when you start swiping horizontally.
  //     if (Math.abs(clientX) > minValue) {
  //       e.preventDefault();
  //       e.returnValue = false;
  //       return false;
  //     }
  //   };
  //
  //   window.addEventListener('touchstart', touchStart);
  //   window.addEventListener('touchmove', preventTouch, { passive: false });
  //   return () => {
  //     window.removeEventListener('touchstart', touchStart);
  //     // @ts-ignore
  //     window.removeEventListener('touchmove', preventTouch, {
  //       // @ts-ignore
  //       passive: false,
  //     });
  //   };
  // }, [clientX, firstClientX, firstClientY, banners, forwardRef, setInitialized]);
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
      beforeChange={
        // @ts-ignore
        (prev: number, next: number) => {
          // HACK fix this awful code
          setTimeout(() => {
            let event = null;
            if (typeof Event === 'function') {
              event = new Event('resize');
            } else {
              event = document.createEvent('Event');
              event.initEvent('resize', true, true);
            }
            window.dispatchEvent(event);
            setTimeout(() => props.changePosition(next), 200);
          }, 100);
        }
      }
      onInit={() => {
        setInitialized();
      }}
      centerMode={true}>
      {banners.map((item, index) => (
        <TopBannerItem
          key={index}
          label={item.label}
          url={item.url}
          imageUrl={item.imageUrl}
        />
      ))}
    </ForwardedRefComponent>
  );
});

export const TopBannerCarouselContainer: React.FC<
  TopBannerCarouselContainerProps
> = React.memo(props => {
  const [carouselInitialized, setCarouselInitialized] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [banners] = useState(props.banners || items);
  const slider = React.useRef<SliderCarousel>();
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
  return (
    <TopBannerCarouselWrapper>
      {!carouselInitialized && (
        <TopBannerCarouselLoading
          left={
            'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg'
          }
          center={
            'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603112320_1559528600505.jpg'
          }
          right={
            'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg'
          }
        />
      )}
      <>
        <TopBannerCarousel
          forwardRef={slider}
          banners={banners}
          changePosition={changePosition}
          setInitialized={setInitialized}
        />
        <PositionOverlay>
          <TopBannerCurrentPosition
            total={banners.length}
            currentPosition={currentPosition + 1}
          />
          <form>
            <Arrow
              side={'left'}
              onClickHandler={handleClickLeft}
              arrowStyle={arrowCSS}
              label={'이전'}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                left: -40px;
                transform: translate(-50%, 50%);
              `}
            />
            <Arrow
              onClickHandler={handleClickRight}
              side={'right'}
              label={'다음'}
              arrowStyle={arrowCSS}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                right: -40px;
                transform: translate(50%, 50%);
              `}
            />
          </form>
        </PositionOverlay>
      </>
    </TopBannerCarouselWrapper>
  );
});
