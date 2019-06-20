import * as React from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import {
  BookAuthor,
  BookItem,
  BookList,
  BookMeta,
  BookScheme,
  BookTitle,
  hotReleaseBookListCSS,
  recommendedBookListCSS,
  ThumbnailWrapper,
} from 'src/components/RecommendedBook/RecommendedBook';

interface RecommendedBookListProps {
  items: BookScheme[];
  type: 'hot_release' | 'single_book_recommendation';
}

const RecommendedBookList: React.FC<RecommendedBookListProps> = props => {
  return (
    <BookList css={props.type === 'hot_release' ? hotReleaseBookListCSS : recommendedBookListCSS}>
      {props.items.map((book, index) => {
        return (
          <BookItem key={index}>
            <ThumbnailWrapper>
              <Book.Thumbnail
                adultBadge={true}
                thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`}
              />
            </ThumbnailWrapper>
            <BookMeta>
              <BookTitle>Test</BookTitle>
              <BookAuthor>한스 로슬링, 올라 로슬링, 한스 로슬링</BookAuthor>
            </BookMeta>
          </BookItem>
        );
      })}
    </BookList>
  );
};

export default RecommendedBookList;
