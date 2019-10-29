import * as React from 'react';
import { EventBannerItem } from 'src/components/EventBanner/index';
import { css } from '@emotion/core';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { EventBanner } from 'src/types/sections';

interface EventBannerListProps {
  items: EventBanner[];
}

const EventBannerList: React.FC<EventBannerListProps> = props => (
  <ul
    css={css`
      display: flex;
      justify-content: center;
      align-items: center;
      ${orBelow(
        BreakPoint.MD,
        css`
          flex-wrap: wrap;
        `,
      )};
      ${between(
        BreakPoint.MD + 1,
        BreakPoint.LG,
        css`
          padding-left: 20px;
          padding-right: 20px;
        `,
      )};
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
