import styled from '@emotion/styled';
import { css } from '@emotion/core';

const desktopBannerLayout = css`
  width: 234px;
`;
const mobileBannerLayout = css`
  //min-width: 194px;
`;

const EventBannerItem = styled.li`
  display: inline-block;

  //box-sizing: content-box;
  ${desktopBannerLayout};

  @media (max-width: 833px) {
    ${mobileBannerLayout};
    :not(:nth-of-type(2n)) {
      margin-right: 4px;
    }
    flex-basis: calc(50% - 2px);
    margin-bottom: 1px;
  }
  @media (min-width: 834px) and (max-width: 999px) {
    ${mobileBannerLayout};
    :not(:last-of-type) {
      margin-right: 6px;
    }
    min-width: 194px;
  }
  @media (min-width: 1000px) {
    :not(:last-of-type) {
      margin-right: 8px;
    }
  }
  img {
    border-radius: 3px;
  }
`;

export default EventBannerItem;
