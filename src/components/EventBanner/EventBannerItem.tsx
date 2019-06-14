import styled from '@emotion/styled';
import { css } from '@emotion/core';

const desktopBannerLayout = css`
  width: 306px;
  min-width: 306px;
  height: 135px;
`;
const mobileBannerLayout = css`
  width: 240px;
  min-width: 240px;
  height: 106px;
`;

const EventBannerItem = styled.li`
  display: inline-block;
  box-sizing: content-box;
  ${desktopBannerLayout};
  :not(:last-of-type) {
    margin-right: 17px;
  }
  :first-of-type {
    padding-left: 24px;
  }
  :last-of-type {
    padding-right: 24px;
  }
  @media (max-width: 833px) {
    ${mobileBannerLayout};
    :first-of-type {
      padding-left: 16px;
    }
    :last-of-type {
      padding-right: 16px;
    }
  }
  @media (min-width: 834px) and (max-width: 999px) {
    ${mobileBannerLayout};
    :not(:last-of-type) {
      margin-right: 16px;
    }
    :first-of-type {
      padding-left: 20px;
    }
    :last-of-type {
      padding-right: 20px;
    }
  }
  img {
    border: solid 1px #d1d5d9;
  }
`;

export default EventBannerItem;
