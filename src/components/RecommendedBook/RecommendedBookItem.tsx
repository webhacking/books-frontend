import React from 'react';
import styled from '@emotion/styled';

import PortraitBook from 'src/components/Book/PortraitBook';
import { HotRelease, TodayRecommendation } from 'src/types/sections';
import { newlineToReactNode } from 'src/utils/highlight';
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
  type: 'TodayRecommendation';
  book: TodayRecommendation;
}

interface HotReleaseProps {
  type: 'HotRelease';
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
    index,
    theme,
    slug,
    genre,
    className,
    book,
  } = props;
  return (
    <PortraitBook
      bId={props.book.b_id}
      index={index}
      genre={genre}
      slug={slug}
      className={className}
    >
      {/* Todo show sentence */}
      {props.type === 'HotRelease' && <BookMeta bId={book.b_id} />}
      {props.type === 'TodayRecommendation' && (
        <RecommendationText bg={theme}>
          {newlineToReactNode(props.book.sentence)}
        </RecommendationText>
      )}
    </PortraitBook>
  );
}

export default React.memo(RecommendedBookItem);
