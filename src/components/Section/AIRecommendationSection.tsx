import { AIRecommendationBook, SectionExtra } from 'src/types/sections';
import SelectionBook from 'src/components/BookSections/SelectionBook';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios, { CancelToken, OAuthRequestType } from 'src/utils/axios';
import sentry from 'src/utils/sentry';
import { booksActions } from 'src/services/books';
import { useRouter } from 'next/router';
import useAccount from 'src/hooks/useAccount';

import * as BookApi from 'src/types/book';

interface AiRecommendationSectionProps {
  genre: string;
  type: 'AiRecommendation';
  extra: SectionExtra;
  items: AIRecommendationBook[];
  slug: string;
}

const AiRecommendationSection: React.FC<AiRecommendationSectionProps> = (props) => {
  const loggedUser = useAccount();
  const dispatch = useDispatch();
  const {
    type, extra, slug,
  } = props;
  const [aiItems, setSections] = useState([]);
  const [isRequestError, setIsRequestError] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');

  const router = useRouter();
  const genre = (router.query.genre as string) || 'general';

  useEffect(() => {
    const source = CancelToken.source();
    const requestAiRecommendationItems = async () => {
      try {
        // Todo 현재는 single로 받아 1개의 섹션만 표시하는데 곧 3~4개 섹션이 표시될 수 있음
        const requestUrl = `/store/personalized-sections/single?genre=${genre}`;
        const result = await axios.get(requestUrl, {
          baseURL: process.env.NEXT_STATIC_AI_RECOMMENDATION_API,
          withCredentials: true,
          custom: { authorizationRequestType: OAuthRequestType.CHECK },
          timeout: 8000,
          cancelToken: source.token,
        });
        if (result.status < 400 && result.status >= 200) {
          setSections(result.data.books.map((item: BookApi.Book) => ({ b_id: item.id, detail: item })));
          const bIds = result.data.books.map((book: BookApi.Book) => book.id);
          dispatch({ type: booksActions.insertBookIds.type, payload: { bIds } });
          setSectionTitle(result.data.title);
          setIsRequestError(false);
        } else {
          setIsRequestError(true);
        }
      } catch (error) {
        setIsRequestError(true);
        sentry.captureException(error);
      }
    };

    if (aiItems.length < 1 && loggedUser && !isRequestError) {
      if (
        [
          'bl',
          'bl-serial',
          'fantasy',
          'fantasy-serial',
          'comics',
          'romance',
          'romance-serial',
          'general',
        ].includes(genre)
      ) {
        requestAiRecommendationItems();
      }
    }

    return source.cancel;
  }, [dispatch, genre, router, aiItems.length, loggedUser, isRequestError]);

  if (!loggedUser || !aiItems || aiItems.length < 1) {
    return null;
  }
  // https://app.asana.com/0/1152363431499050/1153588050414697
  if (aiItems.length < 6) {
    return null;
  }
  if (isRequestError) {
    return null;
  }
  return (
    <SelectionBook
      items={aiItems || []}
      slug={`${slug}-ai-rcmd`}
      title={loggedUser && sectionTitle.length > 0 ? `${loggedUser.id}님이 ${sectionTitle}` : 'AI 추천'}
      extra={extra}
      genre={genre}
      type={type}
    />
  );
};

export default AiRecommendationSection;
