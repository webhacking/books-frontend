import * as React from 'react';
import styled from '@emotion/styled';
import QuickMenuShape from 'src/svgs/QuickMenuShape.svg';
import { css } from '@emotion/core';
import { scrollBarHidden } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
const labelCSS = theme => css`
  font-size: 13px;
  line-height: 1.23;
  color: ${theme.quickMenu.label};
  margin-top: 8px;
  min-width: 76px;
  text-align: center;
  word-break: keep-all;
  ${orBelow(
    BreakPoint.MD,
    css`
      min-width: 55px;
      width: 100%;
    `,
  )};
`;

const MenuList = styled.ul`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 24px;
  padding-bottom: 32px;
  padding-left: 13px;
  padding-right: 13px;

  ${orBelow(
    BreakPoint.LG,
    css`
      padding-left: 0;
      padding-right: 0;
    `,
  )};

  overflow: auto;
  ${scrollBarHidden};
`;

const MenuItem = styled.li`
  display: inline-block;
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

const MenuItemWrapper = styled.div`
  ${orBelow(
    BreakPoint.LG,
    css`
      max-width: 50px;
    `,
  )};
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

// tslint:disable-next-line:no-empty-interface
interface QuickMenu {
  label: string;
  color: string;
  link: string;
}

interface QuickMenuListProps {
  items: QuickMenu[];
}
export const QuickMenuList: React.FC<QuickMenuListProps> = props => (
  <MenuList>
    {props.items.map((menu, index) => (
      <MenuItem key={index}>
        <MenuItemWrapper>
          <a href={menu.link}>
            <QuickMenuShape
              css={css`
                height: 44px;
                width: 44px;
                fill: ${menu.color};
              `}
            />
            <span css={labelCSS}>{menu.label}</span>
          </a>
        </MenuItemWrapper>
      </MenuItem>
    ))}
  </MenuList>
);
