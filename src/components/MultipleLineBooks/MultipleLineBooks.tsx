import { css } from '@emotion/core';
import { between, BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import { MdBook } from 'src/types/sections';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { Book } from '@ridi/web-ui/dist/index.node';
import BookMeta from 'src/components/BookMeta/BookMeta';
import React, { useRef } from 'react';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import { RankingBookTitle } from 'src/components/BookSections/BookSectionContainer';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';

interface MultipleLineBooks {
  items: MdBook[];
  title: string;
  genre: string;
}

export const MultipleLineBooks: React.FC<MultipleLineBooks> = props => {
  const { title, items, genre } = props;
  const [books] = useBookDetailSelector(items);
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '50px');
  return (
    <section
      ref={targetRef}
      css={css`
        max-width: 1000px;
        margin: 0 auto;
      `}>
      <RankingBookTitle>
        <span>{title}</span>
      </RankingBookTitle>
      <ul
        css={css`
          display: flex;
          flex-wrap: wrap;
          flex-shrink: 0;
          justify-content: space-between;
          padding: 0 24px;
          ${orBelow(
            432,
            css`
              padding: 0 16px;
            `,
          )};
          ${between(
            BreakPoint.M + 1,
            BreakPoint.LG,
            css`
              padding: 0 20px;
            `,
          )}
        `}>
        {(books as MdBook[]).slice(0, 18).map((item, index) => (
          <li
            key={index}
            css={css`
              ${orBelow(
                432,
                css`
                  :not(:nth-of-type(3n)) {
                    margin-right: 20px;
                  }
                  width: 27.5%;
                `,
              )};
              ${between(
                433,
                579,
                css`
                  :not(:nth-of-type(3n)) {
                    margin-right: 4%;
                  }
                  width: 120px;
                `,
              )};
              ${between(
                580,
                833,
                css`
                  :not(:nth-of-type(3n)) {
                    margin-right: 16%;
                  }
                  width: 120px;
                `,
              )};
              ${between(
                850,
                BreakPoint.LG,
                css`
                  :not(:nth-of-type(6n)) {
                    margin-right: 2.1%;
                  }
                  width: 120px;
                `,
              )};
              margin-bottom: 20px;
            `}>
            <ThumbnailWrapper
              css={css`
                ${orBelow(
                  BreakPoint.SM,
                  css`
                    width: 23%;
                    min-width: 80px;
                    height: calc(90px * 1.618 - 10px);
                  `,
                )};
                ${between(
                  BreakPoint.SM + 1,
                  BreakPoint.M,
                  css`
                    width: 25%;
                    min-width: 100px;
                    height: calc(100px * 1.618 - 10px);
                  `,
                )};

                ${between(
                  BreakPoint.M + 1,
                  BreakPoint.MD,
                  css`
                    width: 120px;
                  `,
                )};
                ${between(
                  BreakPoint.MD + 1,
                  BreakPoint.LG,
                  css`
                    width: 120px;
                  `,
                )};
                ${greaterThanOrEqualTo(
                  BreakPoint.LG + 1,
                  css`
                    width: 140px;
                  `,
                )};
              `}>
              <Book.Thumbnail
                thumbnailUrl={
                  !isIntersecting
                    ? 'https://static.ridibooks.com/books/dist/images/book_cover/cover_lazyload.png'
                    : `https://misc.ridibooks.com/cover/${item.detail?.thumbnailId ??
                        item.b_id}/xxlarge`
                }
                adultBadge={item.detail.property.is_adult_only}
              />
            </ThumbnailWrapper>
            {item.detail && (
              <BookMeta
                book={item.detail}
                showTag={['bl', 'bl-serial'].includes(genre)}
                wrapperCSS={css`
                  ${between(
                    BreakPoint.M + 1,
                    BreakPoint.LG,
                    css`
                      width: 120px;
                    `,
                  )}
                  ${greaterThanOrEqualTo(
                    BreakPoint.LG + 1,
                    css`
                      width: 140px;
                    `,
                  )}
                `}
                showRating={true}
                isAIRecommendation={false}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
