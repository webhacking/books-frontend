import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as React from 'react';
import { RIDITheme } from 'src/styles/themes';
import { Button } from 'src/components/Button';
import { InstantSearch } from 'src/components/Search';
import { MainTab } from 'src/components/Tabs';
import RidiLogo from 'src/svgs/RidiLogo_1.svg';
import RidiSelectLogo from 'src/svgs/RidiSelectLogo_1.svg';

const GNBWrapper = styled.div`
  width: 100%;
  background-color: ${(props: { theme: RIDITheme }) => props.theme.primaryColor};
`;

const Header = styled.header`
  max-width: 1000px;
  margin: 0 auto;
`;

const Navigation = styled.nav`
  box-sizing: border-box;
  padding: 16px 16px 24px 20px;
  display: flex;
  flex-direction: column;
  @media (max-width: 999px) {
    padding: 9px 10px;
  }
`;

const LogoWrapper = styled.ul`
  min-height: 30px;
  margin-right: -2.5px;
  order: 1;
  margin-bottom: 0;
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
      top: 7px;
      font-size: 14px;
      content: '|';
      color: white;
      opacity: 0.4;
      margin: 0 8.5px 0 10px;
      @media (max-width: 999px) {
        margin: 0 6px 0 5px;
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
  fill: white;
  :hover {
    opacity: 0.8;
  }
  @media (max-width: 999px) {
    width: 88px;
    height: 14px;
    :hover {
      opacity: 1;
    }
    :active {
      opacity: 0.7;
    }
  }
`;

const ridiSelectLogo = (theme: RIDITheme) => css`
  filter: ${theme.logoFilter};
  fill: white;
  opacity: 0.6;
  width: 87.5px;
  height: 14px;
  @media (max-width: 999px) {
    width: 73px;
    height: 12px;
  }
  :hover {
    opacity: 0.8;
  }
`;

const ButtonWrapper = styled.ul`
  margin-left: auto;
  display: flex;
  order: 3;
  @media (max-width: 999px) {
    right: 10px;
    top: 8px;
    order: 2;
    position: absolute;
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
  isPartials: boolean;
}

export const GNB: React.FC<GNBProps> = React.memo((props: GNBProps) => (
  // @ts-ignore
  <GNBWrapper id={props.id}>
    <Header>
      <Navigation>
        <div css={logoAndSearchBox}>
          <LogoWrapper>
            <li>
              <a
                href={props.isPartials ? 'https://ridibooks.com' : '/'}
                css={css`
                  display: flex;
                  align-items: center;
                `}>
                <RidiLogo css={ridiLogo} />
                <span className="a11y">RIDIBOOKS</span>
              </a>
            </li>
            <li>
              <a href="https://select.ridibooks.com">
                <RidiSelectLogo css={ridiSelectLogo} />
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
          <InstantSearch
            isPartials={props.isPartials}
            searchKeyword={props.searchKeyword || ''}
          />
        </div>
      </Navigation>
      <MainTab isPartials={props.isPartials} />
    </Header>
  </GNBWrapper>
));

export default GNB;
