import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { RIDITheme } from 'src/styles/themes';
import { Button } from 'src/components/Button';
import { InstantSearch } from 'src/components/Search';
import { MainTab } from 'src/components/Tabs';
import RidiLogo from 'src/svgs/RidiLogo_1.svg';
import RidiSelectLogo from 'src/svgs/RidiSelectLogo_1.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions } from 'src/services/accounts';
import { RootState } from 'src/store/config';
import { AccountState } from 'src/services/accounts/reducer';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
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
  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 9px 10px;
    `,
  )};
`;

const LogoWrapper = styled.ul`
  min-height: 30px;
  margin-right: -2.5px;
  order: 1;
  margin-bottom: 0;
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

      ${orBelow(
        BreakPoint.LG,
        css`
          margin: 0 6px 0 5px;
          top: 7px;
          font-size: 12px;
        `,
      )};
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
  ${orBelow(
    BreakPoint.LG,
    css`
      width: 88px;
      height: 14px;
      :hover {
        opacity: 1;
      }
      :active {
        opacity: 0.7;
      }
    `,
  )};
`;

const ridiSelectLogo = (theme: RIDITheme) => css`
  filter: ${theme.logoFilter};
  fill: white;
  opacity: 0.6;
  width: 87.5px;
  height: 14px;

  ${orBelow(
    BreakPoint.LG,
    css`
      width: 73px;
      height: 12px;
    `,
  )};
  :hover {
    opacity: 0.8;
  }
`;

const ButtonWrapper = styled.ul`
  margin-left: auto;
  display: flex;
  order: 3;
  ${orBelow(
    BreakPoint.LG,
    css`
      right: 10px;
      top: 8px;
      order: 2;
      position: absolute;
    `,
  )};

  li {
    :not(:last-of-type) {
      margin-right: 6px;

      ${orBelow(
        BreakPoint.LG,
        css`
          margin-right: 3px;
        `,
      )};
    }
  }
`;

const logoAndSearchBox = css`
  display: flex;
  flex-direction: row;
  ${orBelow(
    BreakPoint.LG,
    css`
      flex-direction: column;
    `,
  )};
`;

interface GNBProps {
  type?: string;
  id?: string;
  login?: boolean;
  searchKeyword?: string;
  isPartials: boolean;
  pathname?: string;
}
export const GNB: React.FC<GNBProps> = React.memo((props: GNBProps) => {
  const { loggedUser } = useSelector<RootState, AccountState>(state => state.account);
  const [path, setPath] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: accountActions.checkLogged.type });
    setPath(window.location.href);
    return () => {};
  }, []);

  const loginPath = new URL('/account/login', publicRuntimeConfig.STORE_HOST);
  loginPath.searchParams.append('return_url', path || publicRuntimeConfig.BOOKS_HOST);

  return (
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
              {loggedUser ? (
                // Todo add promotion buttons ex) 캐시충전, 123 충전
                <li>
                  <Button type={'primary'} label={'내 서재'} />
                </li>
              ) : (
                <>
                  <li>
                    <Button type={'secondary'} label={'회원가입'} />
                  </li>
                  <li>
                    {/* Todo fix correct path by env */}
                    <a href={loginPath.toString()}>
                      <Button type={'primary'} label={'로그인'} />
                    </a>
                  </li>
                </>
              )}
            </ButtonWrapper>
            <InstantSearch
              isPartials={props.isPartials}
              searchKeyword={props.searchKeyword || ''}
            />
          </div>
        </Navigation>
        <MainTab isPartials={props.isPartials} loggedUserInfo={loggedUser} />
      </Header>
    </GNBWrapper>
  );
});

export default GNB;
