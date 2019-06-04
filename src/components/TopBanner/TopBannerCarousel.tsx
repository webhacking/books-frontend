import * as React from 'react';
import SliderCarousel from 'react-slick';
import dynamic from 'next/dynamic';

import 'slick-carousel/slick/slick.css';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import 'slick-carousel/slick/slick-theme.css';
import { useCallback, useState } from 'react';
import { Svg } from 'src/components/Svg';

const TopBannerItemWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const sliderCSS = css`
  &.slick-slider {
    overflow: hidden;
    height: 237px;
  }

  .slick-slide > div > div[class*='TopBannerItem'] {
    .slide-overlay {
      position: absolute;
      width: 355px;
      border-radius: 6px;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      transition: all 0.1s;
    }
  }
  .slick-slide.slick-center > div > div[class*='TopBannerItem'] {
    .slide-overlay {
      background: rgba(0, 0, 0, 0);
      //display: none;
      transition: all 0.1s;
    }
  }

  @media (min-width: 1000px) {
    &.slick-slider {
      overflow: hidden;
      height: 286px;
    }
    .slick-slide > div > div > div[class*='ItemInner'] {
      height: 276px;
      width: 415px;
      transition: height 0.3s;
    }

    .slick-slide.slick-center > div > div > div[class*='ItemInner'] {
      height: 286px;
      width: 430px;
      //background: #8685cb;
      transition: height 0.3s;
    }

    .slick-slide > div > div[class*='TopBannerItem'] {
      .slide-overlay {
        position: absolute;
        width: 415px;
        border-radius: 6px;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        transition: background-color 0.2s;
      }
    }
    .slick-slide.slick-center > div > div[class*='TopBannerItem'] {
      .slide-overlay {
        //background: rgba(0, 0, 0, 0);
        //display: none;
        //position: absolute;
        width: 433px;
        transition: background-color 0.2s;
      }
    }
  }
  //.slick-slide > div > div > div[class*='ItemInner'] {
  //}
  //
  //.slick-slide.slick-current > div > div > div[class*='ItemInner'] {
  //}
  .slick-position {
    display: none;
  }
  .slick-slide.slick-center {
    .slick-position {
      display: block;
    }
  }
  .slick-slide {
    height: 237px;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (min-width: 1000px) {
      height: 286px;
    }
  }
`;

const ItemInner = styled.div``;

const TopBannerCurrentPositionInner = styled.div`
  position: absolute;
  right: 10px;
  bottom: 11px;
  width: 54px;
  height: 24px;
  //opacity: 0.4;
  //box-shadow: 2px 2px 2px 2px #333333 inset;
  border-radius: 12px;
  border: solid 1px rgba(180, 180, 180, 0.1);
  //box-shadow: 0 0 0 1px rgba(0,0,0,0.3) inset;
  background-color: rgba(0, 0, 0, 0.4);
  @media (min-width: 1000px) {
    right: 16px;
    bottom: 11px;
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

const currentPosCSS = css`
  color: white;
  font-size: 12px;
  font-weight: bold;
  line-height: 22px;
  letter-spacing: -0.3px;
  font-family: 'museo_sans', 'Helvetica Neue';
`;

const totalCountCSS = css`
  color: white;
  font-weight: 500;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.3px;
  font-family: 'museo_sans', 'Helvetica Neue';
`;

interface TopBannerCurrentPositionProps {
  total: number;
  currentPosition: number;
}

const TopBannerCurrentPosition: React.FC<TopBannerCurrentPositionProps> = props => {
  return (
    <TopBannerCurrentPositionInner className={'slick-position'}>
      <span css={currentPosCSS}>
        {props.currentPosition} / <span css={totalCountCSS}>{props.total}</span>
      </span>
    </TopBannerCurrentPositionInner>
  );
};

interface TopBannerItemProps {
  label?: string;
  url: string;
  loading?: boolean;
}

const TopBannerItem: React.FC<TopBannerItemProps> = props => {
  return (
    <TopBannerItemWrapper>
      <ItemInner
        css={css`
          border-radius: 6px;
          margin: 0 5px;
          max-width: 430px;
          height: ${props.loading ? '276px' : '286px'};
          @media (max-width: 999px) {
            width: 355px;
            height: 237px;
          }
          @media (min-width: 1000px) {
            width: ${props.loading ? '415px' : '430px'};
            //width: 430px;
          }

          //background-image: url('');
          background-size: cover;
          background-image: url(${props.url});
        `}
      />
      <div
        css={
          props.loading
            ? css`
                position: absolute;
                width: 355px;
                border-radius: 6px;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                @media (min-width: 1000px) {
                  width: 415px;
                }
                //transition: background-color 0.2s;
              `
            : null
        }
        className={'slide-overlay'}
      />
    </TopBannerItemWrapper>
  );
};

const items = [
  {
    label: '1',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603112320_1559528600505.jpg',
  },
  {
    label: '2',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
  {
    label: '1',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603112320_1559528600505.jpg',
  },
  {
    label: '2',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
  {
    label: '1',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603112320_1559528600505.jpg',
  },
  {
    label: '2',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
  {
    label: '1',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603112320_1559528600505.jpg',
  },
  {
    label: '2',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg',
  },
  {
    label: '3',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603114451_1559529891097.jpg',
  },
  {
    label: '19',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190604175023_1559638223869.jpg',
  },
  {
    label: '20',
    url: 'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg',
  },
];

const clearOutline = css`
  :active {
    outline: none;
  }
  :focus {
    outline: none;
  }
`;

const LeftArrow = styled.div`
  display: none;
  ${clearOutline};
  @media (min-width: 1000px) {
    display: initial;
    position: absolute;
    left: -40px;
    width: 40px;
    height: 40px;
    bottom: 143.5px;
    border-radius: 50px;
    border: solid 1px rgba(0, 0, 0, 0.07);
    background-color: rgba(255, 255, 255, 0.15);
    transform: translate(-50%, 50%);
  }
`;
const RightArrow = styled.div`
  display: none;
  ${clearOutline};
  @media (min-width: 1000px) {
    display: initial;
    position: absolute;
    right: -40px;
    width: 40px;
    height: 40px;
    bottom: 143.5px;
    border-radius: 50px;
    border: solid 1px rgba(0, 0, 0, 0.07);
    background-color: rgba(255, 255, 255, 0.15);
    transform: translate(50%, 50%);
  }
`;

const PositionOverlay = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  height: 0;
  background: transparent;
  width: 355px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 0;
  @media (min-width: 1000px) {
    width: 430px;
  }
`;

interface TopBannerCarouselProps {
  // tslint:disable-next-line:no-any
  banners: any[];
  changePosition: (pos: number) => void;
  setInitialized: () => void;
  forwardRef: React.RefObject<SliderCarousel>;
}
interface TopBannerCarouselContainerProps {
  // tslint:disable-next-line:no-any
  banners?: any[];
}

const Slider = dynamic(import('./LoadableCarousel'), { ssr: false, loading: () => null });
// @ts-ignore
// tslint:disable-next-line:no-any
const ForwardedRefComponent = React.forwardRef((props, ref: React.RefObject<any>) => {
  return <Slider {...props} forwardedRef={ref} />;
});

const TopBannerCarousel: React.FC<TopBannerCarouselProps> = React.memo(props => {
  const { banners } = props;

  // console.log(ForwardedRefComponent);
  return (
    <ForwardedRefComponent
      ref={props.forwardRef}
      className={'center'}
      css={sliderCSS}
      slidesToShow={1}
      initialSlide={0}
      useTransform={false}
      slidesToScroll={1}
      autoplaySpeed={5000}
      autoplay={true}
      arrows={false}
      infinite={true}
      variableWidth={true}
      afterChange={(item: number) => {
        props.changePosition(item);
        // @ts-ignore
        if (props.forwardRef.current && props.forwardRef.current.innerSlider) {
          // @ts-ignore
          props.forwardRef.current.innerSlider.onWindowResized();
        }
      }}
      onInit={() => {
        props.setInitialized();
      }}
      centerMode={true}>
      {banners.map((item, index) => {
        return <TopBannerItem key={index} label={item.label} url={item.url} />;
      })}
    </ForwardedRefComponent>
  );
});

export const TopBannerCarouselContainer: React.FC<TopBannerCarouselContainerProps> = React.memo(
  props => {
    const [carouselInitialized, setCarouselInitialized] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [banners] = useState(props.banners || items);
    const slider: React.RefObject<SliderCarousel> = React.createRef();
    const changePosition = useCallback(item => {
      setCurrentPosition(item || 0);
    }, []);
    const setInitialized = useCallback(() => {
      setCarouselInitialized(true);
    }, []);

    const handleClickLeft = () => {
      // Todo Enter Control
      if (slider.current) {
        slider.current.slickPrev();
      }
    };
    const handleClickRight = () => {
      // Todo Enter Control
      if (slider.current) {
        slider.current.slickNext();
      }
    };

    return (
      <>
        {!carouselInitialized && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TopBannerItem
              loading={true}
              url={
                'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603171131_1559549491672.jpg'
              }
            />
            <TopBannerItem
              url={
                'https://active.ridibooks.com/ridibooks_top_banner/pc/20190603112320_1559528600505.jpg'
              }
            />
            <TopBannerItem
              loading={true}
              url={
                'https://active.ridibooks.com/ridibooks_top_banner/pc/20190521173618_1558427778288.jpg'
              }
            />
          </div>
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
            <LeftArrow tabIndex={1} onKeyDown={handleClickLeft} onClick={handleClickLeft}>
              <Svg
                css={css`
                  fill-opacity: 0.7;
                `}
                fill={'#d1d5d9'}
                iconName={'LeftArrow'}
                width={'40px'}
                height={'40px'}
              />
            </LeftArrow>
            <RightArrow tabIndex={1} onKeyDown={handleClickRight} onClick={handleClickRight}>
              <Svg
                css={css`
                  fill-opacity: 0.7;
                  transform-origin: center;
                  transform: rotate(180deg) translate(3%, 0);
                `}
                fill={'#d1d5d9'}
                iconName={'LeftArrow'}
                width={'40px'}
                height={'40px'}
              />
            </RightArrow>
          </PositionOverlay>
        </>
      </>
    );
  },
);
