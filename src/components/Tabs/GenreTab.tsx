import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import * as labels from 'src/labels/common.json';
import GNBCategory from 'src/svgs/GNB_Category.svg';
import { css, SerializedStyles } from '@emotion/core';
import { clearOutline, RIDITheme } from 'src/styles';
import { Link } from 'server/routes';
import { orBelow } from 'src/utils/mediaQuery';
import { useRouter } from 'next/router';
import * as Cookies from 'js-cookie';
import { safeJSONParse } from 'src/utils/common';
const GenreTabWrapper = styled.ul`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
`;

const rulerCSS = theme => css`
  position: absolute;
  width: 100vw;
  border: 0 none;
  left: 0;
  height: 1px;
  background-color: ${theme.divider2};
`;

const genreListPartialsCSS = theme => css`
  display: flex;
  flex-direction: row;
  height: 47px;
  align-items: center;
  li {
    a {
      display: inline-block;
      padding: 0 22px;
      ${orBelow(
        999,
        css`
          padding: 0;
        `,
      )};
      font-size: 16px;
      font-weight: 500;
      line-height: 47px;
      height: 100%;
      width: 100%;
      ${clearOutline};
    }
    height: 100%;
    text-align: center;
    color: ${theme.genreTab.normal};
    cursor: pointer;
    :first-of-type {
      line-height: 47px;
      position: relative;
      top: -2px;
      margin-right: 0;
      a {
        padding: 0 20px;
        ${orBelow(
          999,
          css`
            padding: 0;
          `,
        )};
      }
    }
    margin-right: 10px;
  }

  ${orBelow(
    999,
    css`
      justify-content: space-around;
      li {
        flex-grow: 1;
        padding: 0;
        margin: 0;
        :first-of-type {
          padding: 0;
        }
      }
    `,
  )};
`;

// Todo Refactor css
const genreListCSS = theme => css`
  display: flex;
  flex-direction: row;
  height: 47px;
  align-items: center;
  li {
    a {
      display: inline-block;
      padding: 0 22px;
      ${orBelow(
        999,
        css`
          padding: 0;
        `,
      )};
      font-size: 16px;
      font-weight: 500;
      line-height: 47px;
      height: 100%;
      width: 100%;
      ${clearOutline};
    }
    height: 100%;
    text-align: center;
    color: ${theme.genreTab.normal};
    cursor: pointer;
    :first-of-type {
      line-height: 56px;
      margin-right: 0;
      a {
        padding: 0 20px;
        ${orBelow(
          999,
          css`
            padding: 0;
          `,
        )};
      }
    }
    margin-right: 10px;
  }

  ${orBelow(
    999,
    css`
      justify-content: space-around;
      li {
        flex-grow: 1;
        padding: 0;
        margin: 0;
        :first-of-type {
          padding: 0;
        }
      }
    `,
  )};
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
  color: ${theme.subServiceTab.normal};
  li {
    height: 100%;
    line-height: 50px;
    a {
      font-size: 17px;
      ${clearOutline};
      display: inline-block;
      height: 100%;
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

interface TabItemProps {
  label: string;
  activePath: string[];
  currentPath: string;
  currentCSS: (theme: RIDITheme) => SerializedStyles;
  normalCSS: (theme: RIDITheme) => SerializedStyles;
  labelCSS: (theme: RIDITheme) => SerializedStyles;
  route?: string;
  isPartial?: boolean;
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

// Fixme
const genres = {
  general: {
    path: '/',
    activePaths: ['/', ''],
    services: [],
  },
  bl: {
    path: '/bl',
    activePaths: ['/bl', '/bl-serial', '/bl/', '/bl-serial/', 'bl', 'bl-serial'],
    services: [
      { name: '단행본', path: '/bl', activePaths: ['/bl', '/bl/', 'bl'] },
      {
        name: '연재',
        path: '/bl-serial',
        activePaths: ['/bl-serial', '/bl-serial/', 'bl-serial'],
      },
    ],
  },
  'bl-serial': {
    path: '/bl-serial',
    activePaths: ['/bl', '/bl-serial', 'bl-serial', 'bl'],
    services: [
      { name: '단행본', path: '/bl', activePaths: ['/bl', '/bl/', 'bl'] },
      {
        name: '연재',
        path: '/bl-serial',
        activePaths: ['/bl-serial', '/bl-serial/', 'bl-serial'],
      },
    ],
  },
  fantasy: {
    path: '/fantasy',
    activePaths: [
      '/fantasy',
      '/fantasy-serial',
      '/fantasy/',
      '/fantasy-serial/',
      'fantasy',
      'fantasy-serial',
    ],
    services: [
      {
        name: '단행본',
        path: '/fantasy',
        activePaths: ['/fantasy', '/fantasy/', 'fantasy'],
      },
      {
        name: '연재',
        path: '/fantasy-serial',
        activePaths: ['/fantasy-serial', '/fantasy-serial/', 'fantasy-serial'],
      },
    ],
  },
  'fantasy-serial': {
    path: '/fantasy-serial',
    activePaths: [
      '/fantasy',
      '/fantasy-serial',
      '/fantasy/',
      '/fantasy-serial/',
      'fantasy',
      'fantasy-serial',
    ],
    services: [
      {
        name: '단행본',
        path: '/fantasy',
        activePaths: ['/fantasy', '/fantasy/', 'fantasy'],
      },
      {
        name: '연재',
        path: '/fantasy-serial',
        activePaths: ['/fantasy-serial', '/fantasy-serial/', 'fantasy-serial'],
      },
    ],
  },
  romance: {
    path: '/romance',
    activePaths: [
      '/romance',
      '/romance-serial',
      '/romance/',
      '/romance-serial/',
      'romance',
      'romance-serial',
    ],
    services: [
      {
        name: '단행본',
        path: '/romance',
        activePaths: ['/romance', '/romance/', 'romance'],
      },
      {
        name: '연재',
        path: '/romance-serial',
        activePaths: ['/romance-serial', '/romance-serial/', 'romance-serial'],
      },
    ],
  },
  'romance-serial': {
    path: 'romance-serial',
    activePaths: [
      '/romance',
      '/romance-serial',
      '/romance/',
      '/romance-serial/',
      'romance',
      'romance-serial',
    ],
    services: [
      {
        name: '단행본',
        path: '/romance',
        activePaths: ['/romance', '/romance/', 'romance'],
      },
      {
        name: '연재',
        path: '/romance-serial',
        activePaths: ['/romance-serial', '/romance-serial/', 'romance-serial'],
      },
    ],
  },
  comics: {
    path: '/comics',
    activePaths: ['/comics', 'comics', '/comics/'],
    services: [],
  },
};

const TabItem: React.FC<TabItemProps> = React.memo(props => {
  // Todo apply lint
  const { route, currentPath, activePath, isPartial } = props;
  const isActivePath = activePath.includes(currentPath);
  const cookieGenre = Cookies.get('main_genre') || '';

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
      {isPartial ? (
        <a
          aria-label={props.label}
          href={route}
          onClick={() => {
            if (route === '/' && cookieGenre) {
              Cookies.set('main_genre', '');
            }
          }}>
          <span css={isActivePath ? props.currentCSS : props.normalCSS}>
            {props.label}
          </span>
        </a>
      ) : (
        <Link replace={false} route={route}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a aria-label={props.label}>
            <span css={isActivePath ? props.currentCSS : props.normalCSS}>
              {props.label}
            </span>
          </a>
        </Link>
      )}
    </li>
  );
});

const subServices = [
  '/romance/',
  '/romance-serial/',
  '/bl/',
  '/bl-serial/',
  '/fantasy/',
  '/fantasy-serial/',
  '/romance',
  '/romance-serial',
  '/bl',
  '/bl-serial',
  '/fantasy',
  '/fantasy-serial',
  'bl',
  'bl-serial',
  'romance',
  'romance-serial',
  'fantasy',
  'fantasy-serial',
];

interface GenreTabProps {
  currentGenre: string;
  isPartials?: boolean;
}

interface SavedSubServices {
  romance: string;
  bl: string;
  fantasy: string;
}

const GenreTab: React.FC<GenreTabProps> = React.memo(props => {
  const { currentGenre, isPartials } = props;
  const genreInfo = genres[currentGenre] ?? genres.general;

  const showSubGenre = genreInfo.services.length > 1;
  const router = useRouter();
  const [latestSubServices, setLatestSubServices] = useState<SavedSubServices>({
    romance: '/romance',
    fantasy: '/fantasy',
    bl: '/bl',
  });

  useEffect(() => {
    const latestSubService = safeJSONParse(localStorage.getItem('latest_sub_service'), {
      romance: '/romance',
      fantasy: '/fantasy',
      bl: '/bl',
    });

    if (subServices.includes(router?.query?.genre?.toString() || '')) {
      if (
        ['/bl', '/bl/', '/bl-serial', '/bl-serial/', 'bl', 'bl-serial'].includes(
          router?.query?.genre.toString(),
        )
      ) {
        localStorage.setItem(
          'latest_sub_service',
          JSON.stringify({
            ...latestSubService,
            bl: `/${router?.query?.genre.toString()}`,
          }),
        );
        setLatestSubServices({
          ...latestSubService,
          bl: `/${router?.query?.genre.toString()}`,
        });
      }

      if (
        [
          '/romance',
          '/romance/',
          '/romance-serial',
          '/romance-serial/',
          'romance',
          'romance-serial',
        ].includes(router?.query?.genre?.toString() || '')
      ) {
        localStorage.setItem(
          'latest_sub_service',
          JSON.stringify({
            ...latestSubService,
            romance: `/${router?.query?.genre.toString() || ''}`,
          }),
        );
        setLatestSubServices({
          ...latestSubService,
          romance: `/${router?.query?.genre.toString() || ''}`,
        });
      }
      if (
        [
          '/fantasy',
          '/fantasy/',
          '/fantasy-serial',
          '/fantasy-serial/',
          'fantasy',
          'fantasy-serial',
        ].includes(router?.query?.genre.toString())
      ) {
        localStorage.setItem(
          'latest_sub_service',
          JSON.stringify({
            ...latestSubService,
            fantasy: `/${router?.query?.genre.toString()}`,
          }),
        );
        setLatestSubServices({
          ...latestSubService,
          fantasy: `/${router?.query?.genre.toString()}`,
        });
      }
    }
  }, [router]);
  return (
    <>
      <GenreTabWrapper>
        <li>
          <ul
            css={
              props.isPartials
                ? theme => genreListPartialsCSS(theme)
                : theme => genreListCSS(theme)
            }>
            <li
              css={css`
                ${router.query?.pathname?.toString().startsWith('/category/list')
                  ? css`
                      :hover {
                        opacity: 1 !important;
                      }
                    `
                  : css`
                      :hover {
                        opacity: 0.7;
                      }
                    `}
              `}>
              <a href={'/category/list'} aria-label={'카테고리 목록'}>
                <button>
                  <GNBCategory
                    css={(theme: RIDITheme) => css`
                      ${iconCSS(theme)};
                      ${router.query?.pathname?.toString().startsWith('/category/list')
                        ? css`
                            fill: ${theme.primaryColor};
                          `
                        : ''};
                    `}
                  />
                  <span className={'a11y'}>{labels.category}</span>
                </button>
              </a>
            </li>
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              currentPath={router.pathname === '/' && router.route === '/' && '/'}
              activePath={['/']}
              label={'일반'}
              route={'/'}
              isPartial={isPartials}
            />
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              currentPath={router?.query?.genre?.toString()}
              activePath={[
                '/romance',
                '/romance-serial',
                '/romance/',
                '/romance-serial/',
                'romance',
                'romance-serial',
              ]}
              label={'로맨스'}
              route={latestSubServices.romance || '/romance'}
              isPartial={isPartials}
            />
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              currentPath={router?.query?.genre?.toString()}
              activePath={[
                '/fantasy',
                '/fantasy-serial',
                '/fantasy/',
                '/fantasy-serial/',
                'fantasy',
                'fantasy-serial',
              ]}
              label={'판타지'}
              route={latestSubServices.fantasy || '/fantasy'}
              isPartial={isPartials}
            />
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              currentPath={router?.query?.genre?.toString()}
              activePath={['/comics', '/comics/', 'comics']}
              label={'만화'}
              route={'/comics'}
              isPartial={isPartials}
            />
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              currentPath={router?.query?.genre?.toString()}
              activePath={['/bl', '/bl-serial', '/bl/', '/bl-serial/', 'bl', 'bl-serial']}
              label={'BL'}
              route={latestSubServices.bl || '/bl'}
              isPartial={isPartials}
            />
          </ul>
        </li>
        <li>
          <hr css={rulerCSS} />
        </li>
        {showSubGenre ? (
          <>
            <li>
              <ul css={subServicesListCSS}>
                {genreInfo.services.map((service, index) => (
                  <TabItem
                    key={index}
                    route={service.path}
                    normalCSS={normal}
                    currentCSS={subServiceTab}
                    labelCSS={subServiceTabLabelCSS}
                    currentPath={router?.query?.genre?.toString()}
                    activePath={service.activePaths}
                    label={service.name}
                    isPartial={isPartials}
                  />
                ))}
              </ul>
            </li>
          </>
        ) : (
          <div
            css={[
              !props.isPartials &&
                css`
                  margin-bottom: 20px;
                `,
            ]}
          />
        )}
      </GenreTabWrapper>
      {props.isPartials && (
        <hr
          css={css`
            border: 0;
            height: 1px;
            display: block !important;
            background: #e6e8eb;
          `}
        />
      )}
    </>
  );
});

export default GenreTab;
