import { DisplayType, MdBook, SectionExtra } from 'src/types/sections';
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

interface AiRecommendationSectionProps {
  items?: MdBook[];
  genre: string;
  type: DisplayType;
  extra: SectionExtra;
  title: string;
}

const AiRecommendationSection: React.FC<AiRecommendationSectionProps> = props => {
  const { loggedUser } = useSelector((store: RootState) => store.account);
  const dispatch = useDispatch();
  const { items, genre, type, title, extra } = props;
  const [, setSections] = useState(items);

  useEffect(() => {
    // @ts-ignore
    const requestAiRecommendationItems = async () => {
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

    if (!items && loggedUser) {
      // requestAiRecommendationItems();
    }
  }, [genre, loggedUser]);
  return (
    <SelectionBook
      items={[]}
      title={loggedUser ? `${loggedUser.id} ${title}` : 'AI 추천'}
      extra={extra}
      genre={genre}
      type={type}
      option={{ isAIRecommendation: true }}
    />
  );
};

export default AiRecommendationSection;
