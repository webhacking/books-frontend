import * as React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { IconNames, Svg } from 'src/components/Svg';
import { useContext, useEffect, useState } from 'react';
import { a11y } from 'src/styles';
import { Anchor } from 'src/components/Misc';
import { BrowserLocationContext } from 'src/components/Context';
import * as labels from 'src/labels/menus.json';
import * as Cookies from 'js-cookie';
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
  padding: 0 6px;
  padding-bottom: 3px;
  outline: none;
`;

const iconStyle = () => css`
  margin-right: 8px;
  fill: white;
  width: 20px;
  height: 20px;
  top: 3px;
  @media (max-width: 999px) {
    width: 24px;
    height: 24px;
  }
`;

const labelStyle = css`
  height: 16px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
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
  :hover {
    ${BottomLine} {
      background-color: #99d1ff;
      opacity: 0.7;
      width: 100%;
    }
    opacity: 0.7;
  }
  padding-bottom: 3px;
`;

const currentTab = css`
  background-color: #99d1ff;
  width: 100%;
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
  activeIconName: keyof typeof IconNames;
  iconName: keyof typeof IconNames;
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
    activeIconName,
    iconName,
  } = props;
  return (
    <TabItemWrapper>
      <Anchor isPartials={isPartials} path={path} shallow={shallow} replace={replace}>
        <StyledAnchor href={isPartials ? path : ''}>
          <TabButton>
            <Svg
              iconName={currentPath.match(pathRegexp) ? activeIconName : iconName}
              css={iconStyle}
            />
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
      setHomeURL(visitedService ? `/${visitedGenre}/${visitedService}` : `/${visitedGenre}` || '/');
    } else {
      setHomeURL('/');
    }
  });
  return (
    <Tabs>
      <TabItem
        isPartials={isPartials}
        activeIconName={'Home_solid'}
        iconName={'Home'}
        currentPath={currentPath}
        label={labels.mainTab.home}
        path={homeURL}
        replace={true}
        pathRegexp={/(^[^/]*\/$|^\/(fantasy|romance|bl|general|comic)(\/.*$|$))/}
      />
      <TabItem
        isPartials={isPartials}
        activeIconName={'Notification_solid'}
        iconName={'Notification_regular'}
        currentPath={currentPath}
        label={labels.mainTab.notification}
        path={'/notification'}
        pathRegexp={/^\/notification/}
      />
      <TabItem
        isPartials={isPartials}
        activeIconName={'Cart_solid'}
        iconName={'Cart_regular'}
        currentPath={currentPath}
        label={labels.mainTab.cart}
        path={'/cart'}
        pathRegexp={/^\/cart/}
      />
      <TabItem
        isPartials={isPartials}
        activeIconName={'MyRIDI_solid'}
        iconName={'MyRIDI_regular'}
        currentPath={currentPath}
        label={labels.mainTab.myRidi}
        path={'/account/myridi'}
        pathRegexp={/^\/account\/myridi/}
      />
    </Tabs>
  );
};

export default MainTab;
