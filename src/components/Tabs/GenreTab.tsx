import React, { useContext } from 'react';
import { Genre, GenreInfo, Genres } from 'src/constants/genres';
import styled from '@emotion/styled';
import * as labels from 'src/labels/common.json';
import GNBCategory from 'src/svgs/GNB_Category.svg';
import { css, SerializedStyles } from '@emotion/core';
import { clearOutline, RIDITheme } from 'src/styles';
import { Link } from 'server/routes';
import { BrowserLocationContext } from 'src/components/Context';
import * as Cookies from 'js-cookie';
import cookieKeys from 'src/constants/cookies';

const GenreTabWrapper = styled.ul`
  max-width: 1000px;
  margin: 0 auto;
`;

const rulerCSS = theme => css`
  position: absolute;
  width: 100vw;
  border: 0 none;
  left: 0;
  height: 1px;
  background-color: ${theme.divider2};
`;

// Todo Refactor css
const genreListCSS = theme => css`
  display: flex;
  flex-direction: row;
  height: 47px;
  align-items: center;
  li {
    button {
      padding: 0 22px;
      @media (max-width: 999px) {
        padding: 0;
      }
      font-size: 16px;
      font-weight: 500;
      line-height: 47px;
      height: 100%;
      width: 100%;
      letter-spacing: -0.2px;
      ${clearOutline};
    }
    height: 100%;
    text-align: center;
    color: ${theme.genreTab.normal};
    cursor: pointer;
    :first-of-type {
      line-height: 56px;
      margin-right: 0;
      button {
        padding: 0 20px;
        @media (max-width: 999px) {
          padding: 0;
        }
      }
    }

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
  position: relative;
  top: 2px;
  width: 24px;
  height: 24px;
  fill: ${theme.genreTab.icon};
`;

const subServicesListCSS = theme => css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 17px;
  letter-spacing: -0.2px;
  color: ${theme.subServiceTab.normal};
  li {
    height: 100%;
    line-height: 50px;
    button {
      font-size: 17px;
      ${clearOutline};
    }
    span {
      display: inline-block;
      cursor: pointer;
      height: 100%;
    }
    :not(:last-of-type) {
      ::after {
        position: relative;
        content: '|';
        font-size: 13px;
        top: -3px;
        margin: 0 16px;
        color: ${theme.divider3};
      }
    }
  }
`;

const genreTab = (theme: RIDITheme) => css`
  color: ${theme.primaryColor};
  font-weight: bold;
  :hover {
    opacity: 1;
  }
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
  labelCSS: (theme: RIDITheme) => SerializedStyles;
  route?: string;
  genre: GenreInfo;
}

// @ts-ignore
const genreTabLabelCSS = (theme: RIDITheme) => css`
  :hover {
    opacity: 0.7;
  }
`;
// @ts-ignore
const subServiceTabLabelCSS = (theme: RIDITheme) => css`
  :hover {
    color: #303538;
  }
`;

const TabItem: React.FC<TabItemProps> = React.memo(props => {
  // Todo apply lint
  const { path, route, currentPath, genre } = props;
  const regex =
    path === 'general'
      ? new RegExp('(^[^/]*\\/$|^\\/general|\\/genre\\/general$)')
      : new RegExp(`^\\/${props.path.replace(/\//g, '\\/')}(\\/|$)`);
  const isActivePath = currentPath.match(regex);
  return (
    <li
      css={theme => css`
        ${isActivePath
          ? css`
              :hover {
                opacity: 1;
                color: #1f8ce6;
              }
              @media (hover: hover) {
                :hover {
                  opacity: 1;
                }
              }
              @media (hover: none) {
                :hover {
                  opacity: 1;
                }
              }
            `
          : props.labelCSS(theme)}
      `}>
      <Link replace={!!currentPath.match(genre.path)} prefetch={true} route={route}>
        <button>
          <span css={currentPath.match(regex) ? props.currentCSS : props.normalCSS}>
            {props.label}
          </span>
        </button>
      </Link>
    </li>
  );
});

const GenreTab: React.FC<GenreTabProps> = React.memo(props => {
  const { genres, currentGenre } = props;
  const genre = genres[currentGenre];
  const hasSubService = genre ? genre.subServices.length > 0 : false;
  const currentPath = useContext(BrowserLocationContext);
  return (
    <GenreTabWrapper>
      <li>
        <ul css={genreListCSS}>
          <li
            css={css`
              ${currentPath === '/category/list'
                ? css`
                    :hover {
                      opacity: 1 !important;
                    }
                  `
                : css`
                    :hover {
                      opacity: 0.7;
                    }
                  `};
            `}>
            <Link route={'/category/list'}>
              <button>
                <GNBCategory
                  css={(theme: RIDITheme) => css`
                    ${iconCSS(theme)};
                    ${currentPath === '/category/list'
                      ? css`
                          fill: ${theme.primaryColor};
                        `
                      : ''};
                  `}
                />
                <span className={'a11y'}>{labels.category}</span>
              </button>
            </Link>
          </li>
          {Object.keys(genres).map((k, index) => {
            const visitedService = Cookies.get(
              `${cookieKeys.recentlyVisitedGenre}_${genres[k].key}_Service`,
            );
            // eslint-disable-next-line no-nested-ternary
            const route = visitedService
              ? `${genres[k].path}/${visitedService}`
              : genres[k].path.match(/(fantasy|romance|bl)/u)
              ? `${genres[k].path}/single`
              : genres[k].path;

            return (
              <TabItem
                key={index}
                normalCSS={normal}
                currentCSS={genreTab}
                labelCSS={genreTabLabelCSS}
                currentPath={currentPath}
                path={genres[k].key}
                label={genres[k].label}
                route={route}
                genre={genres[k]}
              />
            );
          })}
        </ul>
      </li>
      <li>
        <hr css={rulerCSS} />
      </li>
      {hasSubService ? (
        <>
          <li>
            <ul css={subServicesListCSS}>
              {genres[currentGenre].subServices.map((service, index) => (
                <TabItem
                  key={index}
                  route={`/${genres[currentGenre].key}/${service.key}`}
                  normalCSS={normal}
                  currentCSS={subServiceTab}
                  labelCSS={subServiceTabLabelCSS}
                  currentPath={currentPath}
                  genre={genres[currentGenre]}
                  path={`${genres[currentGenre].key}/${service.key}`}
                  label={service.label}
                />
              ))}
            </ul>
          </li>
        </>
      ) : (
        <div
          css={css`
            margin-bottom: 20px;
          `}
        />
      )}
    </GenreTabWrapper>
  );
});

export default GenreTab;
