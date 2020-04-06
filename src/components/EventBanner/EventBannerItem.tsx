import styled from '@emotion/styled';
import {
  between, BreakPoint, greaterThanOrEqualTo, orBelow,
} from 'src/utils/mediaQuery';

const EventBannerItem = styled.li`
  display: inline-block;
  width: 234px;

  ${orBelow(
    BreakPoint.MD,
    `
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
    `
      :not(:last-of-type) {
        margin-right: 6px;
      }
      min-width: 194px;
    `,
  )};
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    `
      :not(:last-of-type) {
        margin-right: 8px;
      }
    `,
  )};
  img {
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
`;

export default EventBannerItem;
