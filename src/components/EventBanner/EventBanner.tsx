import React from 'react';
import { css } from '@emotion/core';
import { EventBannerList } from 'src/components/EventBanner';
import { EventBanner as EventBannerItem } from 'src/types/sections';
import { orBelow } from 'src/utils/mediaQuery';

const eventBannerWrapperCSS = css`
  margin: 0 auto;
  width: 100%;
  padding: 24px 0;
  height: 100%;
  ${orBelow(
    999,
    css`
      padding: 16px 0;
    `,
  )}
`;

interface EventBannerProps {
  items: EventBannerItem[];
  genre: string;
  slug: string;
}

const EventBanner: React.FC<EventBannerProps> = (props) => (
  <section css={eventBannerWrapperCSS}>
    <EventBannerList items={props.items} genre={props.genre} slug={props.slug} />
  </section>
);

export default EventBanner;
