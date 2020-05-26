import styled from '@emotion/styled';

import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

import SkeletonBar from './Bar';

const Wrapper = styled.ul`
  margin: 22px 0 17px;
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
  margin-bottom: 0;
`;

export default function CategorySkeleton() {
  return (
    <Wrapper>
      {Array(8).fill(null).map((_, idx) => <CategorySkeletonBar key={idx} />)}
    </Wrapper>
  );
}
