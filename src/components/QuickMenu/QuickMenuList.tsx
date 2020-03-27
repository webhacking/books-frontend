import React, { useCallback } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import ScrollContainer from 'src/components/ScrollContainer';
import QuickMenuShape from 'src/svgs/QuickMenuShape.svg';
import { scrollBarHidden } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { QuickMenu } from 'src/types/sections';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { SendEventType } from 'src/constants/eventTracking';

const centered = css`
  max-width: 1000px;
  margin: 0 auto;
`;

const QuickMenuLabel = styled.span`
  font-size: 13px;
  line-height: 1.23;
  color: #525a61;
  min-width: 76px;
  text-align: center;
  word-break: keep-all;
  margin-top: 8px;
  ${orBelow(
    BreakPoint.MD,
    css`
      min-width: 55px;
      width: 100%;
    `,
  )};
`;

const MenuList = styled.ul`
  ${centered}
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 24px;
  padding-bottom: 24px;
  padding-left: 13px;
  padding-right: 13px;

  ${orBelow(
    BreakPoint.LG,
    css`
      padding-top: 16px;
      padding-bottom: 16px;
      padding-left: 3px;
      padding-right: 3px;
    `,
  )};

  overflow: auto;
  ${scrollBarHidden};
`;

const MenuItem = styled.li`
  display: inline-block;
  flex: none;
  :not(:last-of-type) {
    margin-right: 9px;
  }
  :first-of-type {
    padding-left: 10px;
  }
  :last-of-type {
    padding-right: 10px;
  }
`;

const MenuAnchor = styled.a`
  ${orBelow(
    BreakPoint.LG,
    css`
      max-width: 50px;
    `,
  )};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  flex: none;
`;

interface QuickMenuListProps {
  items: QuickMenu[];
}

const QuickMenuImage = styled.img`
  top: 0;
  transform: translate(-50%, 0);
  left: 50%;
  position: absolute;
  width: 44px;
  height: 44px;
`;

const quickMenuShape = css`
  flex: none;
  height: 44px;
  width: 44px;
`;

function Item({ menu }) {
  const [tracker] = useEventTracker();
  const sendQuickMenuClickEvent = useCallback(() => {
    tracker.sendEvent(SendEventType.QuickMenu, {
      // https://app.asana.com/0/1166576097448534/1162603665774601
      category: SendEventType.QuickMenu,
      action: window.location.href,
      label: menu.url,
    });
  }, [tracker]);
  return (
    <MenuItem>
      <MenuAnchor
        onClick={sendQuickMenuClickEvent}
        href={menu.url}
        aria-label={menu.name}
      >
        <QuickMenuShape
          css={quickMenuShape}
          style={{ fill: menu.bg_color }}
        />
        <QuickMenuImage alt={menu.name} src={menu.icon} />
        <QuickMenuLabel>{menu.name}</QuickMenuLabel>
      </MenuAnchor>
    </MenuItem>
  );
}
const MemoizedQuickMenuItem: React.FC<{ menu: QuickMenu }> = React.memo(Item);

const Section = styled.section`
  position: relative;
`;

export const QuickMenuList: React.FC<QuickMenuListProps> = (props) => (
  <Section>
    <h2 className="a11y">퀵 메뉴</h2>
    <ScrollContainer
      leftArrowLabel="이전 퀵 메뉴"
      rightArrowLabel="다음 퀵 메뉴"
      css={centered}
    >
      <MenuList>
        {props.items.map((menu, index) => (
          <MemoizedQuickMenuItem key={index} menu={menu} />
        ))}
      </MenuList>
    </ScrollContainer>
  </Section>
);
