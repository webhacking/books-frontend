import { DisplayType, MdSelection } from 'src/types/sections';
import SelectionBook from 'src/components/BookSections/SelectionBook/SelectionBook';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import axios from 'src/utils/axios';
import getConfig from 'next/config';
import sentry from 'src/utils/sentry';
import { keyToArray } from 'src/utils/common';
import { booksActions } from 'src/services/books';
import { categoryActions } from 'src/services/category';
const { publicRuntimeConfig } = getConfig();

const { captureException } = sentry();

interface UserPreferredSectionProps {
  items: MdSelection[];
  genre: string;
  type: DisplayType;
  slug: string;
}

// 이 영역은 사용자 정보를 바탕으로 제공되는데 사용자 정보가 늦게 로드되므로 Fetch 를 따로한다.
const UserPreferredSection: React.FC<UserPreferredSectionProps> = props => {
  const { loggedUser } = useSelector((store: RootState) => store.account);
  const categoryState = useSelector((store: RootState) => store.categories);

  const dispatch = useDispatch();
  const { items, genre, type, slug } = props;
  const [sections, setSections] = useState(items || []);

  useEffect(() => {
    const requestUserPreferredBestSeller = async () => {
      try {
        const requestUrl = new URL(
          `/sections/home-${genre}-user-preferred-bestseller`,
          publicRuntimeConfig.STORE_API,
        );
        const result = await axios.get(requestUrl.toString(), { withCredentials: true });
        setSections(result.data.items);
        const bIds = keyToArray(result.data.items, 'b_id');
        dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
        const categoryIds = keyToArray(result.data.items, 'category_id');
        dispatch({ type: categoryActions.insertCategoryIds.type, payload: categoryIds });
      } catch (error) {
        captureException(error);
      }
    };

    if (sections.length === 0 && loggedUser) {
      requestUserPreferredBestSeller();
    }
  }, [genre, sections, loggedUser]);

  return (
    <>
      {(sections as MdSelection[]).map((item, index) => {
        if (!item.books) {
          return null;
        }

        const categoryName = categoryState.items[item.category_id]?.name
          ? `${categoryState.items[item.category_id]?.name} 베스트셀러`
          : '베스트셀러';
        return (
          <SelectionBook
            slug={`${slug}-category-${item.category_id}`}
            items={item.books}
            title={categoryName}
            categoryId={item.category_id}
            genre={genre}
            extra={{
              detail_link: new URL(
                `/category/bestsellers/${item.category_id}`,
                publicRuntimeConfig.STORE_HOST,
              ).toString(),
            }}
            key={index}
            type={type}
            option={{ isAIRecommendation: false }}
          />
        );
      })}
    </>
  );
};

export default UserPreferredSection;
