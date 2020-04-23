import React from 'react';
import styled from '@emotion/styled';

import PortraitBook from 'src/components/Book/PortraitBook';
import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';
import { newlineToReactNode } from 'src/utils/highlight';
import { computeBookTitle } from 'src/utils/bookTitleGenerator';
import { BreakPoint } from 'src/utils/mediaQuery';

import BookMeta from './BookMeta';

interface CommonProps {
  index: number;
  theme: 'white' | 'dark';
  slug: string;
  genre: string;
  className?: string;
}

interface TodayRecommendationProps {
  type: DisplayType.TodayRecommendation;
  book: TodayRecommendation;
}

interface HotReleaseProps {
  type: DisplayType.HotRelease;
  book: HotRelease;
}

type Props = CommonProps & (TodayRecommendationProps | HotReleaseProps);

const RecommendationText = styled.p<{ bg?: 'white' | 'dark' }>`
  padding-left: 0;
  position: relative;
  margin-top: 10px;

  line-height: 18px;
  text-align: center;
  font-weight: bold;
  white-space: nowrap;
  font-size: 13px;

  width: 140px;
  @media (max-width: ${BreakPoint.LG}px) {
    width: 130px;
  }

  ${({ bg }) => bg === 'dark' && 'color: white;'}
`;

function RecommendedBookItem(props: Props) {
  const {
    book: { b_id: bId, detail, sentence },
    index,
    type,
    theme,
    slug,
    genre,
    className,
  } = props;
  const title = computeBookTitle(detail);
  return (
    <PortraitBook
      bId={bId}
      bookDetail={detail}
      index={index}
      genre={genre}
      slug={slug}
      className={className}
      title={title}
    >
      {/* Todo show sentence */}
      {detail && type === DisplayType.HotRelease && <BookMeta book={detail} />}
      {detail && type === DisplayType.TodayRecommendation && (
        <RecommendationText bg={theme}>
          {newlineToReactNode(sentence)}
        </RecommendationText>
      )}
    </PortraitBook>
  );
}

export default React.memo(RecommendedBookItem);
