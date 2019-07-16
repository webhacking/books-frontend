import * as React from 'react';
import { css } from '@emotion/core';
import { RIDITheme } from 'src/styles';
import ArrowRight from 'src/svgs/Arrow_Right_9.svg';
import { useState } from 'react';
import { CategoryList as CategoryListScheme, ParentCategory } from 'src/pages/category/list';

const parentCategoryItemCSS = (theme: RIDITheme) => css`
  position: relative;
  cursor: pointer;
  width: 149px;
  height: 34px;
  padding: 10px 15px 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  :hover {
    background-color: ${theme.primaryColor};
    color: white;
    svg {
      fill: white;
    }
  }
  transition: all 0.1s;
`;

const parentCategoryItemHoverCSS = (theme: RIDITheme) => css`
  background-color: ${theme.primaryColor};
  color: white;
  svg {
    fill: white;
  }
`;

const subCategoryCSS = css`
  border-left: 1px solid #c4d1de;
  padding-top: 15px;
  width: 150px;
  padding-left: 15px;
  padding-right: 15px;
  flex-shrink: 0;
`;

const subCategoryItemCSS = (theme: RIDITheme) => css`
  height: 26px;
  padding: 7px 18px;
  display: flex;
  align-items: center;
  margin-top: 2px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  :first-of-type {
    margin-top: 5px;
  }
  :hover {
    color: ${theme.primaryColor};
    font-weight: bold;
  }
  transition: all 0.1s;
`;

const CuratedCategoryList: React.FC<{ category: ParentCategory }> = React.memo(props => {
  return (
    <>
      <button
        css={css`
          padding: 10px;
          margin-top: 4px;
          height: 34px;
          width: 100%;
          background-color: #1f8ce6;
          border-radius: 3px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          :hover {
            background-color: #0f5e9c;
          }
          transition: background-color 0.1s;
        `}>
        <h3
          css={css`
            color: white;
            font-weight: 700;
            font-size: 14px;
            line-height: 14px;
          `}>
          {props.category.name}
        </h3>
        <ArrowRight
          css={css`
            fill: white;
            width: 5.6px;
            height: 14px;
            margin-right: -1px;
          `}
        />
      </button>
      <ul>
        {props.category.subCategory.map((category, index) => (
          <li
            css={(theme: RIDITheme) => css`
              ${subCategoryItemCSS(theme)};
              padding-left: 10px;
              padding-right: 10px;
              :first-of-type {
                margin-top: 2px;
              }
            `}
            key={index}>
            {category.name}
          </li>
        ))}
      </ul>
    </>
  );
});

export interface CategoryListProps {
  categoryList: CategoryListScheme;
}

const Desktop: React.FC<CategoryListProps> = props => {
  const [categoryList] = useState(props.categoryList || { general: [], curatedCategory: [] });
  const [selectedCategory, setCategory] = useState(categoryList.general[0]);
  return (
    <div
      css={css`
        display: flex;
        height: 615px;
        padding-top: 20px;
        padding-left: 8px;
      `}>
      <ul
        css={css`
          padding-top: 15px;
        `}>
        {categoryList.general.map((item, index) => (
          <li
            css={(theme: RIDITheme) =>
              css`
                ${parentCategoryItemCSS(theme)}
                ${selectedCategory.id === item.id ? parentCategoryItemHoverCSS(theme) : ''};
              `
            }
            onMouseEnter={() => setCategory(item)}
            onMouseLeave={() => setCategory(categoryList.general[0])}
            key={index}>
            <h3
              css={css`
                font-size: 14px;
              `}>
              {item.name}
            </h3>
            <ArrowRight
              css={(theme: RIDITheme) => css`
                fill: ${theme.primaryColor};
                width: 5.6px;
                height: 14px;
                margin-right: -1px;
              `}
            />
            {selectedCategory.id === item.id && (
              <ul
                css={css`
                  position: absolute;
                  left: 100%;
                  ${selectedCategory.name === '잡지' ? 'bottom: 3px;' : 'top: 0'};
                  width: 151px;
                `}>
                <li css={subCategoryItemCSS}>
                  <span>{`${selectedCategory.name} 전체`}</span>
                </li>
                {selectedCategory.subCategory.map((subItem, subIndex) => (
                  <li css={subCategoryItemCSS} key={subIndex}>
                    <span>{subItem.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div
        css={css`
          background-color: #ebf6ff;
          ${subCategoryCSS};
        `}
      />

      <div css={subCategoryCSS}>
        <CuratedCategoryList category={categoryList.curatedCategory[0]} />
        <CuratedCategoryList category={categoryList.curatedCategory[1]} />
      </div>
      <div css={subCategoryCSS}>
        <CuratedCategoryList category={categoryList.curatedCategory[2]} />
        <CuratedCategoryList category={categoryList.curatedCategory[3]} />
      </div>
      <div css={subCategoryCSS}>
        <CuratedCategoryList category={categoryList.curatedCategory[4]} />
      </div>
      <div css={subCategoryCSS}>
        <CuratedCategoryList category={categoryList.curatedCategory[5]} />
        <CuratedCategoryList category={categoryList.curatedCategory[6]} />
        <CuratedCategoryList category={categoryList.curatedCategory[7]} />
      </div>
    </div>
  );
};

export default Desktop;
