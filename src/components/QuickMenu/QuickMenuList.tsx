import * as React from 'react';
import styled from '@emotion/styled';
import { Svg } from 'src/components/Svg';

const Label = styled.span`
  font-size: 13px;
  line-height: 1.23;
  letter-spacing: -0.4px;
  color: ${props => props.theme.quickMenu.label};
  margin-top: 8px;
  min-width: 76px;
  text-align: center;
  word-break: keep-all;
  @media (max-width: 999px) {
    min-width: 50px;
  }
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: auto;
  padding-top: 14px;
  padding-bottom: 32px;
  @media (max-width: 999px) {
    //width: calc(100% + 13px) !important;
  }
`;

const MenuItem = styled.li`
  display: inline-block;
  :not(:last-of-type) {
    margin-right: 10px;
  }
  :first-of-type {
    padding-left: 13px;
  }
  :last-of-type {
    padding-right: 13px;
  }
`;

const MenuItemWrapper = styled.div`
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
export const QuickMenuList: React.FC<QuickMenuListProps> = props => {
  return (
    <MenuList>
      {props.items.map((menu, index) => (
        <MenuItem key={index}>
          <MenuItemWrapper>
            <a href={menu.link}>
              <Svg iconName={'QuickMenuShape'} height={'44px'} width={'44px'} fill={menu.color} />
              <Label>{menu.label}</Label>
            </a>
          </MenuItemWrapper>
        </MenuItem>
      ))}
    </MenuList>
  );
};
