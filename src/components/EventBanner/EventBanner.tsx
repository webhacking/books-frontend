import * as React from 'react';
// import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import { View } from 'libreact/lib/View';
import { css } from '@emotion/core';
// @ts-ignore
import { EventBannerCarousel, EventBannerItem, EventBannerList } from 'src/components/EventBanner';
import { Genre } from 'src/constants/genres';

const eventBannerWrapperCSS = css`
  margin: 0 auto;
  max-width: 1000px;
  overflow: auto;
  position: relative;
  min-height: 215px;
  @media (max-width: 999px) {
    min-height: 162px;
  }
  @media (min-width: 1280px) {
    overflow: unset;
  }
  -webkit-overflow-scrolling: touch;
  padding-top: 24px;
  @media (max-width: 999px) {
    padding-top: unset;
  }
`;

export interface BannerItem {
  link: string;
  imageUrl: string;
  label: string;
}

interface EventBannerProps {
  items: BannerItem[];
  genre: Genre;
}

const EventBanner: React.FC<EventBannerProps> = props => {
  // @ts-ignore
  const [isMounted, setMounted] = useState(false);
  // @ts-ignore
  const [currentGenre, setGenre] = useState(props.genre);
  useEffect(() => {
    setMounted(true);
    setGenre(props.genre);
    // console.log('mount?', currentGenre, props.genre);

    // Todo 장르가 달라져서 마운트 된다면 Fetch
  });
  return (
    <section css={eventBannerWrapperCSS}>
      <WindowWidthQuery>
        <View maxWidth={1000}>
          <EventBannerList items={props.items} />
        </View>
        <View>
          <EventBannerCarousel items={props.items} />
        </View>
      </WindowWidthQuery>
    </section>
  );
};

export default EventBanner;
