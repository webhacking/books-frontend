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
    <div css={eventBannerWrapperCSS}>
      <WindowWidthQuery>
        <View maxWidth={1000}>
          <EventBannerList items={props.items} />
        </View>
        <View>
          <EventBannerCarousel items={props.items} />
        </View>
      </WindowWidthQuery>
    </div>
  );
};

export default EventBanner;
