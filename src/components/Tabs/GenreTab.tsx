import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import * as labels from 'src/labels/common.json';
import GNBCategory from 'src/svgs/GNB_Category.svg';
import { css } from '@emotion/core';
import { clearOutline } from 'src/styles';
import { orBelow } from 'src/utils/mediaQuery';
import { useRouter } from 'next/router';
import * as Cookies from 'js-cookie';
import * as colors from '@ridi/colors';
import { safeJSONParse } from 'src/utils/common';
import Link from 'next/link';

const GenreTabWrapper = styled.ul`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
`;

const Ruler = styled.hr`
  position: absolute;
  width: 100vw;
  border: 0 none;
  left: 0;
  height: 1px;
  background-color: ${colors.slateGray10};
`;

const genreListPartialsCSS = css`
  line-height: 47px;
  position: relative;
  top: -2px;
`;

const GenreList = styled.ul<{ isPartials: boolean }>`
  display: flex;
  flex-direction: row;
  height: 47px;
  align-items: center;
  li {
    outline: none;
    a {
      display: inline-block;
      padding: 0 22px;
      ${orBelow(999, css`
          padding: 0;
      `)};
      font-size: 16px;
      font-weight: 500;
      line-height: 47px;
      height: 100%;
      width: 100%;
      ${clearOutline};
      button {
        outline: none;
      }
    }
    height: 100%;
    text-align: center;
    color: ${colors.slateGray80};
    cursor: pointer;
    :first-of-type {
      line-height: 56px;
      ${(props) => props.isPartials && genreListPartialsCSS};
      margin-right: 0;
      a {
        padding: 0 20px;
        ${orBelow(999, css`
            padding: 0;
        `)};
      }
    }
    margin-right: 10px;
  }
  ${orBelow(999, css`
    justify-content: space-around;
    li {
      flex-grow: 1;
      padding: 0;
      margin: 0;
      :first-of-type {
        padding: 0;
      }
    }
  `)};
`;

const GenreListItem = styled.li<{ isCategory: boolean }>`
  :hover {
    opacity: 1;
    ${(props) => props.isCategory && css`opacity: 0.7;`}
  }
`;

const iconCSS = css`
  position: relative;
  top: 2px;
  width: 24px;
  height: 24px;
  fill: ${colors.slateGray60};
`;

const SubServicesList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 17px;
  color: ${colors.slateGray50};
  li {
    height: 100%;
    line-height: 50px;
    button {
      font-size: 17px;
      ${clearOutline};
    }
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
        color: ${colors.slateGray20};
      }
    }
  }
`;

const activeLabelCSS = css`
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
`;

const genreLabelCSS = css`
  :hover {
    opacity: 0.7;
  }
`;

const ActiveText = styled.span`
  color: ${colors.dodgerBlue50};
  font-weight: bold;
  :hover {
    opacity: 1;
  }
`;

const GenreTabDivider = styled.hr`
  border: 0;
  height: 1px;
  display: block !important;
  background: #e6e8eb;
`;

interface TabItemProps {
  label: string;
  activePath: RegExp;
  href: string;
}

const subGenres: { [genre: string]: Array<{ name: string; path: string; activePaths: RegExp }> } = {
  bl: [
    { name: '단행본', path: '/bl', activePaths: /^\/bl\/?$/ },
    { name: '연재', path: '/bl-serial', activePaths: /^\/bl-serial\/?$/ },
  ],
  fantasy: [
    { name: '단행본', path: '/fantasy', activePaths: /^\/fantasy\/?$/ },
    { name: '연재', path: '/fantasy-serial', activePaths: /^\/fantasy-serial\/?$/ },
  ],
  romance: [
    { name: '단행본', path: '/romance', activePaths: /^\/romance\/?$/ },
    { name: '연재', path: '/romance-serial', activePaths: /^\/romance-serial\/?$/ },
  ],
};

const TabItem: React.FC<TabItemProps> = (props) => {
  const router = useRouter();
  const { href, activePath, label } = props;
  const [isActivePath, setIsActivePath] = useState(false);
  const cookieGenre = Cookies.get('main_genre') || '';

  useEffect(() => {
    setIsActivePath(activePath.test(router.asPath));
  }, [activePath, router.asPath]);

  return (
    <li
      css={isActivePath ? activeLabelCSS : genreLabelCSS}
    >
      {process.env.IS_PRODUCTION ? (
        <a
          aria-label={label}
          href={href}
          onClick={() => {
            if (href === '/' && cookieGenre) {
              Cookies.set('main_genre', '', { sameSite: 'lax' });
            }
          }}
        >
          {isActivePath ? <ActiveText>{label}</ActiveText> : <span>{label}</span>}
        </a>
      ) : (
        <Link href={href === '/' ? '/' : '/[genre]'} as={href}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a aria-label={label}>
            {isActivePath ? <ActiveText>{label}</ActiveText> : <span>{label}</span>}
          </a>
        </Link>
      )}
    </li>
  );
};

interface GenreTabProps {
  currentGenre: string;
  isPartials?: boolean;
  hasBookId?: boolean;
  bookPath?: string;
}

interface SavedSubServices {
  romance: string;
  bl: string;
  fantasy: string;
}

const GenreTab: React.FC<GenreTabProps> = React.memo((props) => {
  const { currentGenre, isPartials } = props;
  const subGenreData = subGenres[currentGenre.split('-')[0]];

  const router = useRouter();
  const [subServices, setSubServices] = useState<SavedSubServices>({
    romance: '/romance',
    fantasy: '/fantasy',
    bl: '/bl',
  });
  const isCategoryList = router.asPath.startsWith('/category/list');

  useEffect(() => {
    const latestSubService = safeJSONParse(localStorage.getItem('latest_sub_service'), subServices);
    setSubServices(latestSubService);

    const genre = /romance|fantasy|bl/.exec(router.asPath)?.[0];
    if (genre) {
      const updatedSubService = {
        ...latestSubService,
        [genre]: router.asPath,
      };
      setSubServices(updatedSubService);
      localStorage.setItem('latest_sub_service', JSON.stringify(updatedSubService));
    }
  }, [router.asPath]);
  return (
    <>
      <GenreTabWrapper>
        <li>
          <GenreList isPartials={isPartials}>
            <GenreListItem isCategory={isCategoryList}>
              <a href="/category/list" aria-label="카테고리 목록">
                <GNBCategory
                  css={css`
                    ${iconCSS};
                    ${isCategoryList && css`
                      fill: ${colors.dodgerBlue50};
                      `};
                  `}
                />
                <span className="a11y">{labels.category}</span>
              </a>
            </GenreListItem>
            <TabItem
              activePath={/^\/?$/}
              label="일반"
              href="/"
            />
            <TabItem
              activePath={/^\/romance(-serial)?\/?$/}
              label="로맨스"
              href={subServices.romance || '/romance'}
            />
            <TabItem
              activePath={/^\/fantasy(-serial)?\/?$/}
              label="판타지"
              href={subServices.fantasy || '/fantasy'}
            />
            <TabItem
              activePath={/^\/comics\/?$/}
              label="만화"
              href="/comics"
            />
            <TabItem
              activePath={/^\/bl(-serial)?\/?$/}
              label="BL"
              href={subServices.bl || '/bl'}
            />
          </GenreList>
        </li>
        <li>
          <Ruler />
        </li>
        {subGenreData ? (
          <li>
            <SubServicesList>
              {subGenreData.map((service, index) => (
                <TabItem
                  key={index}
                  href={service.path}
                  activePath={service.activePaths}
                  label={service.name}
                />
              ))}
            </SubServicesList>
          </li>
        ) : (
          <div
            css={[
              !props.isPartials
                && css`
                  margin-bottom: 20px;
                `,
            ]}
          />
        )}
      </GenreTabWrapper>
      {props.isPartials && <GenreTabDivider />}
    </>
  );
});

export default GenreTab;
