import React, { useEffect, useRef } from 'react';
import { EventBannerItem } from 'src/components/EventBanner/index';
import { css } from '@emotion/core';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { EventBanner } from 'src/types/sections';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import { useEventTracker } from 'src/hooks/useEveneTracker';

interface EventBannerListProps {
  items: EventBanner[];
  genre: string;
  slug: string;
}

const EventBannerList: React.FC<EventBannerListProps> = props => {
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '0px');
  const [tracker] = useEventTracker();
  useEffect(() => {
    if (isIntersecting) {
      tracker.sendEvent('display', {
        section: props.slug,
        items: props.items.map((item, index) => ({
          id: item.id,
          idx: index,
          ts: new Date().getTime(),
        })),
      });
    }
  }, [isIntersecting]);
  return (
    <ul
      ref={targetRef}
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
      {props.items.slice(0, 4).map((item, index) => (
        <EventBannerItem key={index}>
          <a href={item.url}>
            <img width="100%" height="100%" src={item.image_url} alt={item.title} />
          </a>
        </EventBannerItem>
      ))}
    </ul>
  );
};

export default EventBannerList;
