// import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/core';
// @ts-ignore
import { EventBannerList } from 'src/components/EventBanner';
import { Genre } from 'src/constants/genres';

const eventBannerWrapperCSS = css`
  margin: 0 auto;
  width: 100%;
  padding-top: 24px;
  height: 100%;
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
  const targetRef = useRef(null);
  useEffect(() => {
    setMounted(true);
    setGenre(props.genre);
    // console.log('mount?', currentGenre, props.genre);

    // Todo 장르가 달라져서 마운트 된다면 Fetch
  }, [props.genre]);

  return (
    <section ref={targetRef} css={eventBannerWrapperCSS}>
      <EventBannerList items={props.items} />
    </section>
  );
};

export default EventBanner;