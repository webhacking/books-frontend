import React, { useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import PageTitle from 'src/components/PageTitle/PageTitle';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { flexColumnStart, RIDITheme } from 'src/styles';
import { timeAgo } from 'src/utils/common';
import { useMultipleIntersectionObserver } from 'src/hooks/useMultipleIntersectionObserver';
import { NOTIFICATION_ICON_URL, ARROW_RIGHT_ICON_URL } from 'src/constants/icons';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { notificationActions } from 'src/services/notification';
import { RootState } from 'src/store/config';
import NotificationPlaceholder from 'src/components/Placeholder/NotificationItemPlaceholder';
import { Tracker } from '@ridi/event-tracker';
import {
  sendClickEvent,
  useEventTracker,
  useSendDisplayEvent,
} from 'src/hooks/useEventTracker';
import sentry from 'src/utils/sentry';

const { captureException } = sentry();

const Section = styled.section<{}, RIDITheme>`
  background-color: ${(props) => props.theme.backgroundColor};
  padding: 31px 50px 0 50px;
  max-width: 1000px;
  min-height: 800px;
  margin: 0 auto;
  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 0;
    `,
  )};
`;

const NotiList = styled.ul`
  margin-bottom: 70px;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-bottom: 0;
    `,
  )};
`;

const NotiListItem = styled.li<{}, RIDITheme>`
  margin: 0px;
  padding: 14px 0px;
  &:last-child {
    border-bottom: none;
  }

  :hover {
    background: ${(props) => props.theme.hoverBackground};
  }

  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 14px 24px;
    `,
  )};
  ${orBelow(
    BreakPoint.M,
    css`
      padding: 14px 16px;
    `,
  )};
`;

const NotiItemWrapper = styled.a<{}, RIDITheme>`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  :link,
  :visited {
    color: black;
  }
  transition: color 0.1s;

  ::after {
    content: '';
    width: 100%;
    position: absolute;
    height: 1px;
    background: ${(props) => props.theme.dividerColor};
    opacity: ${(props) => props.theme.dividerOpacity};
    bottom: -14px;
    left: 0px;
  }
`;

const ImageWrapper = styled.div`
  text-align: center;
  flex-shrink: 0;
  position: relative;

  ${orBelow(BreakPoint.LG, css``)};
`;

const Dot = styled.div<{ imageType: string }>`
  position: absolute;
  width: 4px;
  height: 4px;
  left: -9px;
  top: ${(props) => (props.imageType === 'book' ? '36px' : '24px')};
  background: #1f8ce6;
  border-radius: 999px;
`;

const NotificationMeta = styled.div`
  ${flexColumnStart};
  margin-left: 16px;
`;

const NotificationTitle = styled.h3<{}, RIDITheme>`
  font-weight: normal;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  word-break: keep-all;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
`;

const NotificationTime = styled.span`
  font-weight: normal;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.46px;
`;

const ArrowWrapper = styled.div`
  padding: 0 15px;
  margin-left: auto;
`;

const ArrowImg = styled.img`
  height: 13px;
  width: 7px;
`;

const NoEmptyNotification = styled.p`
  text-align: center;
  padding-top: 303px;
  padding-bottom: 359px;
  ${orBelow(
    BreakPoint.M,
    css`
      padding-top: 144px;
      padding-bottom: 200px;
    `,
  )};
`;

const NotificationIconImg = styled.img`
  width: 65px;
  height: 71px;
  fill: #e6e8eb;
`;

const NoEmptyNotificationText = styled.span`
  display: block;
  margin-top: 20px;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.46;
  font-weight: normal;
`;

interface NotificationItemScheme {
  landingUrl: string;
  expireAt: number;
  imageUrl: string;
  imageType: string;
  createdAt: number;
  userIdx: number;
  message: string;
  id: string;
  tag: string;
  itemId: string;
  strCreatedAt: string;
}

interface NotificationItemProps {
  item: NotificationItemScheme;
  createdAtTimeAgo: string;
  dot?: boolean;
  tracker: Tracker;
  slug: string;
  order: number;
}

interface NotificationPageProps {
  isTitleHidden?: boolean;
}

export const NotificationItem: React.FunctionComponent<NotificationItemProps> = (props) => {
  const {
    item, createdAtTimeAgo, dot = false, tracker, slug, order,
  } = props;
  return (
    <NotiListItem>
      <NotiItemWrapper
        // eslint-disable-next-line react/jsx-no-bind
        onClick={sendClickEvent.bind(null, tracker, item, slug, order)}
        href={item.landingUrl}
      >
        <ImageWrapper
          className={slug}
          data-id={item.id}
          data-order={order}
        >
          <img
            alt={item.message}
            width="56px"
            src={item.imageUrl}
          />
          { dot && <Dot imageType={item.imageType} /> }
        </ImageWrapper>
        <NotificationMeta>
          <NotificationTitle dangerouslySetInnerHTML={{ __html: item.message }} />
          <NotificationTime>{createdAtTimeAgo}</NotificationTime>
        </NotificationMeta>
        <ArrowWrapper>
          <ArrowImg src={ARROW_RIGHT_ICON_URL} />
        </ArrowWrapper>
      </NotiItemWrapper>
    </NotiListItem>
  );
};

const NotificationPage: React.FC<NotificationPageProps> = (props) => {
  const { isTitleHidden = false } = props;
  const ref = useRef<HTMLUListElement>(null);
  const { items, isLoaded, unreadCount } = useSelector(
    (store: RootState) => store.notifications,
  );
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const noti = useSelector((store: RootState) => store.notifications);
  const slug = 'notification-item';
  const sendDisplayEvent = useSendDisplayEvent(slug);
  const dispatch = useDispatch();
  const [tracker] = useEventTracker();
  useMultipleIntersectionObserver(ref, slug, sendDisplayEvent);

  const setPageView = useCallback(() => {
    if (tracker) {
      try {
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        captureException(error);
      }
    }
  }, [tracker]);

  useEffect(() => {
    setPageView();
  }, [loggedUser]);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(notificationActions.loadNotifications({ limit: 100 }));
    }

    return () => dispatch(notificationActions.setLoaded(false));
  }, [dispatch]);

  if (!isLoaded) {
    return (
      <>
        <Head>
          <title>리디북스 - 알림</title>
        </Head>
        <Section>
          <PageTitle title="알림" mobileHidden={isTitleHidden} />
          <NotificationPlaceholder num={5} />
        </Section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>리디북스 - 알림</title>
      </Head>
      <Section>
        <PageTitle title="알림" mobileHidden={isTitleHidden} />
        <NotiList>
          {items.length === 0 ? (
            <NoEmptyNotification>
              <NotificationIconImg src={NOTIFICATION_ICON_URL} />
              <NoEmptyNotificationText>새로운 알림이 없습니다.</NoEmptyNotificationText>
            </NoEmptyNotification>
          ) : (
            items.map((item, index) => (
              <NotificationItem
                key={index}
                createdAtTimeAgo={timeAgo(item.createdAt)}
                item={item}
                dot={index < unreadCount}
                tracker={tracker}
                slug={slug}
                order={index}
              />
            ))
          )}
        </NotiList>
      </Section>
    </>
  );
};

export default NotificationPage;
