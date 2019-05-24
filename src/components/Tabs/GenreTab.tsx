import * as React from 'react';
import { Genre, Genres } from 'src/constants/genres';
import styled from '@emotion/styled';
import * as labels from 'src/labels/common.json';
import { Svg } from 'src/components/Svg';
import { css, SerializedStyles } from '@emotion/core';
import { RIDITheme } from 'src/styles';
import { Link } from 'server/routes';
import { useContext } from 'react';
import { BrowserLocationContext } from 'src/components/Context';
import * as Cookies from 'js-cookie';
import cookieKeys from 'src/constants/cookies';

const GenreTabWrapper = styled.ul``;

const Ruler = styled.hr`
  position: absolute;
  width: 100vw;
  border: 0 none;
  left: 0;
  height: 1px;
  background-color: ${props => props.theme.divider2};
`;

const GenreList = styled.ul`
  display: flex;
  flex-direction: row;
  height: 44px;
  align-items: center;
  li {
    font-size: 16px;
    font-weight: 500;
    line-height: 44px;
    height: 100%;
    letter-spacing: -0.5px;
    text-align: center;
    color: ${props => props.theme.genreTab.normal};
    cursor: pointer;
    :first-of-type {
      line-height: 56px;
      padding: 0 20px;
    }
    :hover {
      opacity: 0.7;
    }
    padding: 0 22px;
    margin-right: 10px;
  }

  @media (max-width: 999px) {
    justify-content: space-around;
    li {
      flex-grow: 1;
      padding: 0;
      margin: 0;
      :first-of-type {
        padding: 0;
      }
    }
  }
`;

const iconCSS = (theme: RIDITheme) => css`
  width: 24px;
  height: 24px;
  fill: ${theme.genreTab.icon};
`;

const SubServicesList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 17px;
  letter-spacing: -0.5px;
  color: ${props => props.theme.subServiceTab.normal};
  li {
    height: 100%;
    line-height: 50px;
    span {
      display: inline-block;
      cursor: pointer;
      height: 100%;
      :hover {
        color: ${props => props.theme.subServiceTab.hover};
      }
    }
    :not(:last-of-type) {
      ::after {
        position: relative;
        content: '|';
        font-size: 13px;
        top: -3px;
        margin: 0 16px;
        color: ${props => props.theme.divider3};
      }
    }
  }
`;

const genreTab = (theme: RIDITheme) => css`
  color: ${theme.primaryColor};
  font-weight: bold;
`;
const subServiceTab = (theme: RIDITheme) => css`
  color: ${theme.primaryColor};
  font-weight: 600;
`;

// @ts-ignore
const normal = (theme: RIDITheme) => css``;

interface GenreTabProps {
  genres: Genres;
  currentGenre: Genre;
}

interface TabItemProps {
  label: string;
  path: string;
  currentPath: string;
  currentCSS: (theme: RIDITheme) => SerializedStyles;
  normalCSS: (theme: RIDITheme) => SerializedStyles;
}

const TabItem: React.FC<TabItemProps> = React.memo(props => {
  const regex =
    props.path !== 'general'
      ? new RegExp(`^\\/${props.path.replace(/\//g, '\\/')}(\\/|$)`)
      : new RegExp('(^[^/]*\\/$|^\\/general|\\/genre\\/general$)');
  return (
    <span css={props.currentPath.match(regex) ? props.currentCSS : props.normalCSS}>
      {props.label}
    </span>
  );
});

const GenreTab: React.FC<GenreTabProps> = React.memo(props => {
  const { genres, currentGenre } = props;
  const genre = genres[currentGenre];
  const hasSubService = genre.subServices.length > 0;
  const currentPath = useContext(BrowserLocationContext);
  return (
    <GenreTabWrapper>
      <li>
        <GenreList>
          <li>
            <Svg css={iconCSS} iconName={'GNB_Category'} />
            <span className={'a11y'}>{labels.category}</span>
          </li>
          {Object.keys(genres).map((k, index) => {
            const visitedService = Cookies.get(
              `${cookieKeys.recentlyVisitedGenre}_${genres[k].key}_Service`,
            );
            const route = visitedService ? `${genres[k].path}/${visitedService}` : genres[k].path;
            return (
              <Link
                replace={!!currentPath.match(genres[k].path)}
                prefetch={true}
                key={index}
                route={route}>
                <li>
                  <TabItem
                    normalCSS={normal}
                    currentCSS={genreTab}
                    currentPath={currentPath}
                    path={genres[k].key}
                    label={genres[k].label}
                  />
                </li>
              </Link>
            );
          })}
        </GenreList>
      </li>

      {hasSubService && (
        <>
          <Ruler />
          <li>
            <SubServicesList>
              {genres[currentGenre].subServices.map((service, index) => (
                <Link
                  prefetch={true}
                  key={index}
                  route={`/${genres[currentGenre].key}/${service.key}`}>
                  <li>
                    <TabItem
                      normalCSS={normal}
                      currentCSS={subServiceTab}
                      currentPath={currentPath}
                      path={`${genres[currentGenre].key}/${service.key}`}
                      label={service.label}
                    />
                  </li>
                </Link>
              ))}
            </SubServicesList>
          </li>
        </>
      )}
    </GenreTabWrapper>
  );
});

export default GenreTab;
