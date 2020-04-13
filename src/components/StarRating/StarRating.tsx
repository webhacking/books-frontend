import * as React from 'react';
import styled from '@emotion/styled';
import { NO_STAR_RATING_URL, STAR_RATING_URL } from 'src/constants/icons';

interface StarRatingProps {
  rating: number;
  totalReviewer?: number;
}

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  color: #999999;
  line-height: 1.09;
`;

const StarContainer = styled.div`
  position: relative;
  margin-right: 2px;
  line-height: 0;
`;

const StarImage = styled.img`
  width: 50px;
  height: 10px;
`;

const StarMask = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  overflow: hidden;
`;

const TotalReviewer = styled.span`
  height: 10px;
  font-size: 11px;
  line-height: 1.09;
  color: #999999;
`;

export default function StarRating(props: StarRatingProps) {
  const { rating, totalReviewer } = props;
  let label = '별점 정보 없음';
  if (totalReviewer && totalReviewer > 0) {
    label = `총 리뷰어 ${totalReviewer}명, 구매자 평균 별점 ${rating}점`;
  }
  return (
    <Wrapper role="img" aria-label={label}>
      <StarContainer>
        <StarImage src={NO_STAR_RATING_URL} alt="별점 회색 배경" />
        <StarMask style={{ width: `${Math.floor(rating * 10)}px` }}>
          <StarImage src={STAR_RATING_URL} alt="별점 표시" />
        </StarMask>
      </StarContainer>
      {totalReviewer && <TotalReviewer>{totalReviewer}</TotalReviewer>}
    </Wrapper>
  );
}
