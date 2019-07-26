import * as React from 'react';
import { BannerItem } from 'src/components/EventBanner/EventBanner';
import { EventBannerItem } from 'src/components/EventBanner/index';
import { css } from '@emotion/core';

interface EventBannerListProps {
  items: BannerItem[];
}

const EventBannerList: React.FC<EventBannerListProps> = props => (
  <ul
    css={css`
      display: flex;
      justify-content: center;
      align-items: center;
      @media (max-width: 833px) {
        flex-wrap: wrap;
      }
      @media (min-width: 834px) and (max-width: 999px) {
        padding-left: 20px;
        padding-right: 20px;
      }
    `}>
    {props.items.map((item, index) => (
      <EventBannerItem key={index}>
        <a href={item.link}>
          <img width="100%" height="100%" src={item.imageUrl} alt={item.label} />
        </a>
      </EventBannerItem>
    ))}
  </ul>
);

export default EventBannerList;
