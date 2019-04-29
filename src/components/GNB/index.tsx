/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled';
import * as React from 'react';
import { RIDITheme } from 'src/styles/themes';
import { StyledSvg } from 'src/components/Svg';
import { Button } from 'src/components/Button';
import { InstantSearch } from 'src/components/Search';
// import { useLayoutEffect } from 'react';

const GNBWrapper = styled.div`
  width: 100%;
  background-color: ${props => props.theme.primaryColor};
`;

const Header = styled.header`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
`;

const Navigation = styled.nav`
  box-sizing: border-box;
  padding: 9px 10px;
  display: flex;
  flex-direction: column;
`;

const LogoWrapper = styled.ul`
  min-height: 30px;
  margin-bottom: unset;
  @media (max-width: 999px) {
    //margin-bottom: 9x;
  }
  display: inline-flex;
  li {
    display: inline-flex;
    a {
      display: inline-flex;
      align-items: center;
    }

    ::after {
      position: relative;
      top: 6px;
      font-size: 14px;
      content: '|';
      color: white;
      opacity: 0.4;
      margin: 0 10px;
      @media (max-width: 999px) {
        margin: 0 5px 0 4px;
        top: 7px;
        font-size: 12px;
      }
    }
    :last-of-type {
      ::after {
        content: '';
      }
    }
  }
`;

const ridiLogo = (theme: RIDITheme) => css`
  filter: ${theme.logoFilter};
  width: 103px;
  height: 16px;
  @media (max-width: 999px) {
    width: 88px;
    height: 14px;
  }
  :hover {
    opacity: 0.7;
  }
`;

const ridiSelectLogo = (theme: RIDITheme) => css`
  filter: ${theme.logoFilter2};
  opacity: 0.6;
  width: 87.5px;
  height: 14px;
  @media (max-width: 999px) {
    width: 73px;
    height: 12px;
  }
  :hover {
    opacity: 0.7;
  }
`;

const ButtonWrapper = styled.ul`
  position: absolute;
  right: 16px;
  display: flex;
  @media (max-width: 999px) {
    right: 10px;
  }

  li {
    :not(:last-of-type) {
      margin-right: 6px;
      @media (max-width: 999px) {
        margin-right: 3px;
      }
    }
  }
`;

const logoAndSearchBox = css`
  display: flex;
  flex-direction: row;
  @media (max-width: 999px) {
    flex-direction: column;
  }
`;

interface GNBProps {
  type?: string;
  id?: string;
  login?: boolean;
  searchKeyword?: string;
}

export const GNB: React.FC<GNBProps> = React.memo((props: GNBProps) => {
  return (
    <GNBWrapper id={props.id}>
      <Header>
        <Navigation>
          <div css={logoAndSearchBox}>
            <LogoWrapper>
              <li>
                <a href="https://ridibooks.com">
                  <StyledSvg iconName={'RidiLogo_1'} fill={'white'} css={ridiLogo} />
                  <span className="a11y">RIDIBOOKS</span>
                </a>
              </li>
              <li className="GNBNavigation_Item">
                <a href="https://select.ridibooks.com">
                  <StyledSvg iconName={'RidiSelectLogo_1'} fill={'white'} css={ridiSelectLogo} />
                  <span className="a11y">리디셀렉트</span>
                </a>
              </li>
            </LogoWrapper>
            <ButtonWrapper>
              <li>
                <Button type={'secondary'} label={'회원가입'} />
              </li>
              <li>
                <Button type={'primary'} label={'로그인'} />
              </li>
            </ButtonWrapper>
            <InstantSearch searchKeyword={props.searchKeyword || ''} />
          </div>
        </Navigation>
      </Header>
    </GNBWrapper>
  );
});

export default GNB;
