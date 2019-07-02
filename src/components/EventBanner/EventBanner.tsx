import * as React from 'react';
// import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { css } from '@emotion/core';
// @ts-ignore
import { EventBannerList } from 'src/components/EventBanner';
import { Genre } from 'src/constants/genres';

const eventBannerWrapperCSS = css`
  margin: 0 auto;
  width: 100%;
  min-height: 175px;
  padding-top: 24px;
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
      <EventBannerList items={props.items} />
    </section>
  );
};

export default EventBanner;
