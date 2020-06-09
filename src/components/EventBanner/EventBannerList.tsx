import React, { useEffect, useRef } from 'react';
import { EventBannerItem } from 'src/components/EventBanner/index';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { EventBanner } from 'src/types/sections';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import * as tracker from 'src/hooks/useEventTracker';
import styled from '@emotion/styled';

const List = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  ${orBelow(
    BreakPoint.MD,
    `
      flex-wrap: wrap;
    `,
  )};
  ${between(
    BreakPoint.MD + 1,
    BreakPoint.LG,
    `
      padding-left: 20px;
      padding-right: 20px;
    `,
  )};
`;

interface EventBannerListProps {
  items: EventBanner[];
  genre: string;
  slug: string;
}

const EventBannerList: React.FC<EventBannerListProps> = (props) => {
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '0px');
  useEffect(() => {
    if (isIntersecting) {
      props.items.forEach((item, index) => {
        tracker.sendDisplayEvent({
          slug: props.slug,
          id: String(item.id),
          order: index,
        });
      });
    }
  }, [isIntersecting, props.items, props.slug]);
  return (
    <List ref={targetRef}>
      {props.items.slice(0, 4).map((item, index) => (
        <EventBannerItem key={index}>
          <a
            href={item.url}
            onClick={tracker.sendClickEvent.bind(null, item.id, props.slug, index)}
          >
            <img width="100%" height="100%" src={item.image_url} alt={item.title} />
          </a>
        </EventBannerItem>
      ))}
    </List>
  );
};

export default EventBannerList;
