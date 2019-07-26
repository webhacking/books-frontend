import * as React from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import {
  BookList,
  BookMeta,
  BookScheme,
  hotReleaseBookListCSS,
  recommendedBookListCSS,
} from 'src/components/RecommendedBook/RecommendedBook';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';

interface RecommendedBookListProps {
  items: BookScheme[];
  type: 'hot_release' | 'single_book_recommendation';
}

const RecommendedBookList: React.FC<RecommendedBookListProps> = props => (
  <BookList
    css={props.type === 'hot_release' ? hotReleaseBookListCSS : recommendedBookListCSS}>
    {props.items.map((book, index) => (
      <PortraitBook key={index}>
        <ThumbnailWrapper>
          <Book.Thumbnail
            adultBadge={true}
            thumbnailWidth={120}
            thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`}
          />
        </ThumbnailWrapper>
        <BookMeta book={book} />
      </PortraitBook>
    ))}
  </BookList>
);

export default RecommendedBookList;
