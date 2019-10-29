import React from 'react';
import { css } from '@emotion/core';
import { EventBannerList } from 'src/components/EventBanner';
import { EventBanner as EventBannerItem } from 'src/types/sections';

const eventBannerWrapperCSS = css`
  margin: 0 auto;
  width: 100%;
  padding: 10px 0 56px 0;
  height: 100%;
`;

interface EventBannerProps {
  items: EventBannerItem[];
}

const EventBanner: React.FC<EventBannerProps> = props => (
  <section css={eventBannerWrapperCSS}>
    <EventBannerList items={props.items} />
  </section>
);

export default EventBanner;
