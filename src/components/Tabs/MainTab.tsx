import React, { useContext, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { a11y } from 'src/styles';
import { BrowserLocationContext } from 'src/components/Context';
import * as labels from 'src/labels/menus.json';
import * as Cookies from 'js-cookie';
import Home from 'src/svgs/Home.svg';
import HomeSolid from 'src/svgs/Home_solid.svg';
import Notification_solid from 'src/svgs/Notification_solid.svg';
import Notification_regular from 'src/svgs/Notification_regular.svg';
import Cart_regular from 'src/svgs/Cart_regular.svg';
import Cart_solid from 'src/svgs/Cart_solid.svg';
import MyRIDI_solid from 'src/svgs/MyRIDI_solid.svg';
import MyRIDI_regular from 'src/svgs/MyRIDI_regular.svg';
import cookieKeys from 'src/constants/cookies';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { LoggedUser } from 'src/types/account';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import pRetry from 'p-retry';
import axios, { OAuthRequestType } from 'src/utils/axios';
import sentry from 'src/utils/sentry';
const { captureException } = sentry();

const StyledAnchor = styled.a`
  height: 100%;
  display: block;
`;

const Tabs = styled.ul`
  display: flex;
  flex-direction: row;

  padding: 0 20px;
  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 0;
    `,
  )};
`;

const TabButton = styled.button`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 5px 3px 4px;
  outline: none;
  position: relative;
  top: -1px;
  margin: 0 auto;
`;

const iconStyle = () => css`
  margin-right: 10px;
  fill: white;
  width: 20px;
  height: 20px;
  // top: 3px;

  ${orBelow(
    BreakPoint.LG,
    css`
      width: 24px;
      height: 24px;
      margin-right: 0;
    `,
  )};
`;

const labelStyle = css`
  height: 16px;
  font-size: 16px;
  font-weight: 600;
  margin-left: 5px;
  line-height: 1;
  top: 1px;
  text-align: center;
  color: #ffffff;

  ${orBelow(BreakPoint.LG, a11y)};
`;

const BottomLine = styled.span`
  display: block;
  background: transparent;
  height: 3px;
  width: 0;
`;

const TabItemWrapper = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 37px;
  :not(:last-of-type) {
    margin-right: 50px;
  }

  ${orBelow(
    BreakPoint.LG,
    css`
      height: 40px;
      width: 25%;
      :not(:last-of-type) {
        margin-right: 0;
      }
    `,
  )};
  transition: opacity 0.2s;

  @media (hover: hover) {
    :hover {
      ${BottomLine} {
        background-color: #99d1ff;
        position: relative;
        top: 1px;
        opacity: 0.7;
        width: 100%;
      }
      opacity: 0.7;
    }
  }
  :hover {
    ${BottomLine} {
      background-color: #99d1ff;
      position: relative;
      top: 1px;
      opacity: 0.7;
      width: 100%;
    }
    opacity: 0.7;
  }
  @media (hover: none) {
    :hover {
      opacity: 1;
    }
  }
  padding-bottom: 4px;
`;

const currentTab = css`
  background-color: #99d1ff;
  width: 100%;
  position: relative;
  top: 1px;
`;

interface MainTabProps {
  isPartials: boolean;
  loggedUserInfo: null | LoggedUser;
}

interface TabItemProps {
  isPartials: boolean;
  replace?: boolean;
  shallow?: boolean;
  path: string;
  currentPath: string;
  activeIcon: React.ReactNode;
  normalIcon: React.ReactNode;
  label: string;
  pathRegexp: RegExp;
  addOn?: React.ReactNode;
}

// Todo
// Anchor, StyledAnchor ->
// GNB/Footer 캐싱 때문에 생긴 파편화.
// 반응형 레거시 코드 작업이 종료되면 이 부분 개선 해야 함.
const TabItem: React.FC<TabItemProps> = props => {
  const {
    // isPartials,
    path,
    pathRegexp,
    currentPath,
    label,
    activeIcon,
    normalIcon,
    addOn,
  } = props;
  const isActiveTab = currentPath.match(pathRegexp);
  return (
    <TabItemWrapper
      css={
        isActiveTab
          ? css`
              :hover {
                opacity: 1;
                ${BottomLine} {
                  opacity: 1;
                }
              }
            `
          : ''
      }>
      <StyledAnchor href={path} aria-label={label}>
        <TabButton>
          {isActiveTab ? activeIcon : normalIcon}
          {addOn}
          <span css={labelStyle}>{label}</span>
        </TabButton>
        <BottomLine css={isActiveTab ? currentTab : css``} />
      </StyledAnchor>
    </TabItemWrapper>
  );
};

export const MainTab: React.FC<MainTabProps> = props => {
  const { isPartials, loggedUserInfo } = props;
  const currentPath = useContext(BrowserLocationContext);
  const [homeURL, setHomeURL] = useState('/');
  const [cartCount, setCartCount] = useState<null | number>(null);
  const [hasNotification, setNotification] = useState(0);
  useEffect(() => {
    const visitedGenre = Cookies.get(`${cookieKeys.main_genre}`);
    setHomeURL(visitedGenre && visitedGenre !== 'general' ? visitedGenre : '');
  }, [currentPath]);

  useEffect(() => {
    const requestNotificationAuth = async () => {
      let tokenResult = null;
      try {
        const tokenUrl = new URL(
          '/users/me/notification-token/',
          publicRuntimeConfig.STORE_API,
        );

        tokenResult = await pRetry(
          () => axios.get(tokenUrl.toString(), { withCredentials: true }),
          { retries: 2 },
        );
      } catch (error) {
        captureException(error);
      }

      if (tokenResult) {
        try {
          const notificationUrl = new URL('/notification', publicRuntimeConfig.STORE_API);
          const notificationResult = await pRetry(
            () =>
              axios.get(notificationUrl.toString(), {
                params: { limit: 5 },
                custom: { authorizationRequestType: OAuthRequestType.CHECK },
                headers: {
                  Authorization: `Bearer ${tokenResult.data.token}`,
                },
              }),
            { retries: 2 },
          );
          setNotification(notificationResult.data.unreadCount || 0);
        } catch (error) {
          captureException(error);
        }
      }
    };
    if (loggedUserInfo) {
      requestNotificationAuth();
    }
  }, [loggedUserInfo]);

  useEffect(() => {
    const requestCartCount = async () => {
      try {
        const cartUrl = new URL(
          '/api/cart/count',
          publicRuntimeConfig.STORE_TEMP_API_HOST,
        );

        const result = await pRetry(
          () =>
            axios.get(cartUrl.toString(), {
              withCredentials: true,
              custom: { authorizationRequestType: OAuthRequestType.CHECK },
            }),
          { retries: 2 },
        );
        if (result.status === 200) {
          setCartCount(result.data.count);
        }
      } catch (error) {
        captureException(error);
      }
    };
    if (loggedUserInfo) {
      requestCartCount();
    }
  }, [loggedUserInfo]);

  return (
    <>
      <Tabs>
        <TabItem
          isPartials={isPartials}
          activeIcon={<HomeSolid css={iconStyle} />}
          normalIcon={<Home css={iconStyle} />}
          currentPath={currentPath}
          label={labels.mainTab.home}
          path={`/${homeURL}`}
          replace={true}
          pathRegexp={
            // Hack, Apply lint
            // eslint-disable-next-line require-unicode-regexp,prefer-named-capture-group
            /(^[^/]*\/$|^(\/)(\/?\?{0}|\/?\?{1}.*)$|^\/(personalized-recommendation|selection|support|special-room|keyword-finder|new-releases|free-books|bestsellers|author|books|event|search|category|fantasy|romance|bl|bl-serial|fantasy-serial|romance-serial|comics)(\/.*$|$))/
          }
        />
        <TabItem
          isPartials={isPartials}
          activeIcon={<Notification_solid css={iconStyle} />}
          normalIcon={<Notification_regular css={iconStyle} />}
          currentPath={currentPath}
          label={labels.mainTab.notification}
          path={'/notification'}
          pathRegexp={/^\/notification/g}
          addOn={
            hasNotification > 0 && (
              <div
                css={css`
                  position: absolute;
                  left: 13.5px;
                  top: 4px;
                  border: 2px solid #1f8ce6;
                  width: 11px;
                  height: 11px;
                  background: #ffde24;
                  border-radius: 11px;
                  ${orBelow(
                    BreakPoint.LG,
                    css`
                      left: 17.5px;
                    `,
                  )}
                `}
              />
            )
          }
        />
        <TabItem
          isPartials={isPartials}
          activeIcon={<Cart_solid css={iconStyle} />}
          normalIcon={<Cart_regular css={iconStyle} />}
          currentPath={currentPath}
          label={labels.mainTab.cart}
          path={'/cart'}
          pathRegexp={/^\/cart/gu}
          addOn={
            cartCount && (
              <div
                css={css`
                  position: absolute;
                  justify-content: flex-end;
                  margin-left: auto;
                  width: 26px;
                  align-items: center;
                  top: -5px;
                  left: 13.5px;
                  display: flex;
                  max-height: 30px;
                  height: auto;
                  ${orBelow(
                    BreakPoint.LG,
                    css`
                      left: 18.5px;
                      top: -3.5px;
                    `,
                  )}
                `}>
                <div
                  css={css`
                    align-items: center;
                    border-radius: 6px;
                    border: 2px solid #1f8ce6;
                    background: white;
                    height: 20px;
                    display: flex;
                    ${orBelow(
                      BreakPoint.LG,
                      css`
                        margin-left: 4px;
                      `,
                    )}
                  `}>
                  <span
                    css={css`
                      font-weight: bold;
                      padding: 1.5px 2.4px;
                      font-size: 11.5px;
                      line-height: 11.5px;
                      color: #1f8ce6;
                    `}>
                    {cartCount}
                  </span>
                </div>
              </div>
            )
          }
        />
        <TabItem
          isPartials={isPartials}
          activeIcon={<MyRIDI_solid css={iconStyle} />}
          normalIcon={<MyRIDI_regular css={iconStyle} />}
          currentPath={currentPath}
          label={labels.mainTab.myRidi}
          path={'/account/myridi'}
          pathRegexp={/^\/account\/myridi/gu}
        />
      </Tabs>
    </>
  );
};

export default MainTab;
