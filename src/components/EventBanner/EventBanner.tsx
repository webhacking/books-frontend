import React from 'react';
import { css } from '@emotion/core';
import { EventBannerList } from 'src/components/EventBanner';
import { Genre } from 'src/constants/genres';

const eventBannerWrapperCSS = css`
  margin: 0 auto;
  width: 100%;
  padding: 10px 0 56px 0;
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

const EventBanner: React.FC<EventBannerProps> = props => (
  <section css={eventBannerWrapperCSS}>
    <EventBannerList items={props.items} />
  </section>
);

export default EventBanner;
