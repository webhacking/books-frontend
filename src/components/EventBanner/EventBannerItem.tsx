import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { between, BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';

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

  ${orBelow(
    BreakPoint.MD,
    css`
      ${mobileBannerLayout};
      :not(:nth-of-type(2n)) {
        margin-right: 4px;
      }
      flex-basis: calc(50% - 2px);
      margin-bottom: 1px;
    `,
  )};
  ${between(
    BreakPoint.MD + 1,
    BreakPoint.LG,
    css`
      ${mobileBannerLayout};
      :not(:last-of-type) {
        margin-right: 6px;
      }
      min-width: 194px;
    `,
  )};
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      :not(:last-of-type) {
        margin-right: 8px;
      }
    `,
  )};
  img {
    border-radius: 3px;
  }
`;

export default EventBannerItem;
