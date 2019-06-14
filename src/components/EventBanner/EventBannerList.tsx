import * as React from 'react';
import { BannerItem } from 'src/components/EventBanner/EventBanner';
import { EventBannerItem } from 'src/components/EventBanner/index';
import { flexRowStart } from 'src/styles';

interface EventBannerListProps {
  items: BannerItem[];
}

const EventBannerList: React.FC<EventBannerListProps> = props => {
  return (
    <ul css={flexRowStart}>
      {props.items.map((item, index) => (
        <EventBannerItem key={index}>
          <a href={item.link}>
            <img width="100%" height="100%" src={item.imageUrl} alt={item.label} />
          </a>
        </EventBannerItem>
      ))}
    </ul>
  );
};

export default EventBannerList;
