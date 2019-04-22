/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled';
import * as React from 'react';
import { RIDITheme } from 'src/styles/themes';
import { StyledSvg } from 'src/components/Svg';
import { Button } from 'src/components/Button';

const GNBWrapper = styled.div`
  width: 100%;
  background-color: ${props => props.theme.primaryColor};
  overflow-x: auto;
  overflow-y: hidden;
`;

const Header = styled.header`
  max-width: 1000px;
  margin: 0 auto;
`;

const Navigation = styled.nav`
  padding: 8px 10px;
  display: flex;
  flex-direction: row;
`;

const Logos = styled.ul`
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

const Buttons = styled.ul`
  margin-left: auto;
  display: flex;

  li {
    :not(:last-of-type) {
      margin-right: 6px;
      @media (max-width: 999px) {
        margin-right: 3px;
      }
    }
  }
`;

interface GNBProps {
  type?: string;
  id?: string;
}
export default class GNB extends React.PureComponent<GNBProps> {
  public render() {
    return (
      <GNBWrapper id={this.props.id}>
        <Header>
          <Navigation>
            <Logos>
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
            </Logos>
            <Buttons>
              <li>
                <Button type={'secondary'} label={'회원가입'} />
              </li>
              <li>
                <Button type={'primary'} label={'로그인'} />
              </li>
            </Buttons>
          </Navigation>
        </Header>
      </GNBWrapper>
    );
  }
}
