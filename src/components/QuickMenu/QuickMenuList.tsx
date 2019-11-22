import React, { useRef } from 'react';
import styled from '@emotion/styled';
import QuickMenuShape from 'src/svgs/QuickMenuShape.svg';
import { css } from '@emotion/core';
import { scrollBarHidden } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { QuickMenu } from 'src/types/sections';
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

interface QuickMenuListProps {
  items: QuickMenu[];
}
export const QuickMenuList: React.FC<QuickMenuListProps> = props => {
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);

  return (
    <section
      css={css`
        position: relative;
      `}>
      <MenuList ref={ref}>
        {props.items.map((menu, index) => (
          <MenuItem key={index}>
            <MenuItemWrapper>
              <a href={menu.url} aria-label={menu.name}>
                <div
                  css={css`
                    position: relative;
                  `}>
                  <QuickMenuShape
                    css={css`
                      height: 44px;
                      width: 44px;
                      fill: ${menu.bg_color};
                    `}
                  />
                  <img
                    css={css`
                      position: absolute;
                      transform: translate(-50%, -54%);
                      top: 50%;
                      left: 50%;
                    `}
                    alt={menu.name}
                    src={menu.icon}
                  />
                </div>
                <span css={labelCSS}>{menu.name}</span>
              </a>
            </MenuItemWrapper>
          </MenuItem>
        ))}
      </MenuList>
      <form
        css={css`
          height: 0;
          @media (hover: none) {
            display: none;
          }
        `}>
        <Arrow
          label={'이전'}
          side={'left'}
          onClickHandler={moveLeft}
          wrapperStyle={[
            css`
              position: absolute;
              left: 5px;
              top: 30px;
              transition: opacity 0.2s;
            `,
            !isOnTheLeft && arrowTransition,
          ]}
        />
        <Arrow
          label={'다음'}
          side={'right'}
          onClickHandler={moveRight}
          wrapperStyle={[
            css`
              position: absolute;
              right: 5px;
              top: 30px;
              transition: opacity 0.2s;
            `,
            !isOnTheRight && arrowTransition,
          ]}
        />
      </form>
    </section>
  );
};
