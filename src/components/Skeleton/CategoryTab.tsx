import styled from '@emotion/styled';

import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

import SkeletonBar from './Bar';

const Wrapper = styled.ul`
  padding: 8px 0 9px 0;
  display: flex;
  align-items: center;
  > * {
    flex: none;
    + * {
      margin-left: 10px;
    }
  }
  ${orBelow(BreakPoint.LG, 'margin-left: 16px;')}
`;

const CategorySkeletonBar = styled(SkeletonBar)`
  width: 68px;
`;

export default function CategorySkeleton() {
  return (
    <Wrapper>
      {Array(8).fill(null).map((_, idx) => <CategorySkeletonBar key={idx} />)}
    </Wrapper>
  );
}
