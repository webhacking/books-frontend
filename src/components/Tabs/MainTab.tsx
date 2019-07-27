import React, { useContext, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { a11y } from 'src/styles';
import { Anchor } from 'src/components/Misc';
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
// import { RIDITheme } from 'src/styles';

const StyledAnchor = styled.a`
  height: 100%;
  display: block;
`;

const Tabs = styled.ul`
  display: flex;
  flex-direction: row;

  padding: 0 20px;
  @media (max-width: 999px) {
    padding: unset;
  }
`;

const TabButton = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 5px 3px 4px;
  outline: none;
  position: relative;
  top: -1px;
`;

const iconStyle = () => css`
  margin-right: 10px;
  fill: white;
  width: 20px;
  height: 20px;
  top: 3px;
  @media (max-width: 999px) {
    width: 24px;
    height: 24px;
    margin-right: 0;
  }
`;

const labelStyle = css`
  height: 16px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.4px;
  text-align: center;
  color: #ffffff;
  @media (max-width: 999px) {
    ${a11y}
  }
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
  @media (max-width: 999px) {
    height: 40px;
    width: 25%;
    :not(:last-of-type) {
      margin-right: unset;
    }
  }
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
}

// Todo
// Anchor, StyledAnchor ->
// GNB/Footer 캐싱 때문에 생긴 파편화.
// 반응형 레거시 코드 작업이 종료되면 이 부분 개선 해야 함.
const TabItem: React.FC<TabItemProps> = props => {
  const {
    isPartials,
    path,
    pathRegexp,
    currentPath,
    shallow,
    replace,
    label,
    activeIcon,
    normalIcon,
  } = props;
  return (
    <TabItemWrapper>
      <Anchor isPartials={isPartials} path={path} shallow={shallow} replace={replace}>
        <StyledAnchor href={isPartials ? path : ''}>
          <TabButton>
            {currentPath.match(pathRegexp) ? activeIcon : normalIcon}
            <span css={labelStyle}>{label}</span>
          </TabButton>
          <BottomLine css={currentPath.match(pathRegexp) ? currentTab : css``} />
        </StyledAnchor>
      </Anchor>
    </TabItemWrapper>
  );
};

export const MainTab: React.FC<MainTabProps> = props => {
  const { isPartials } = props;
  const currentPath = useContext(BrowserLocationContext);
  const [homeURL, setHomeURL] = useState('/');
  useEffect(() => {
    const visitedGenre = Cookies.get(`${cookieKeys.recentlyVisitedGenre}`);
    const visitedService = visitedGenre
      ? Cookies.get(`${cookieKeys.recentlyVisitedGenre}_${visitedGenre}_Service`)
      : null;
    if (visitedGenre && visitedGenre !== 'general') {
      setHomeURL(
        visitedService ? `/${visitedGenre}/${visitedService}` : `/${visitedGenre}` || '/',
      );
    } else {
      setHomeURL('/');
    }
  }, []);
  return (
    <Tabs>
      <TabItem
        isPartials={isPartials}
        activeIcon={<HomeSolid css={iconStyle} />}
        normalIcon={<Home css={iconStyle} />}
        currentPath={currentPath}
        label={labels.mainTab.home}
        path={homeURL}
        replace={true}
        pathRegexp={
          // Hack, Apply lint
          // eslint-disable-next-line require-unicode-regexp,prefer-named-capture-group
          /(^[^/]*\/$|^(\/)(\/?\?{0}|\/?\?{1}.*)$|^\/(author|book|event|search|category|fantasy|romance|bl|general|comic)(\/.*$|$))/
        }
      />
      <TabItem
        isPartials={isPartials}
        activeIcon={<Notification_solid css={iconStyle} />}
        normalIcon={<Notification_regular css={iconStyle} />}
        currentPath={currentPath}
        label={labels.mainTab.notification}
        path={'/notification'}
        pathRegexp={/^\/notification/gu}
      />
      <TabItem
        isPartials={isPartials}
        activeIcon={<Cart_solid css={iconStyle} />}
        normalIcon={<Cart_regular css={iconStyle} />}
        currentPath={currentPath}
        label={labels.mainTab.cart}
        path={'/cart'}
        pathRegexp={/^\/cart/gu}
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
  );
};

export default MainTab;
