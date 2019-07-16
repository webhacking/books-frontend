import * as React from 'react';
import { CategoryListProps } from 'src/components/CategoryList/Desktop';
import { css } from '@emotion/core';
import { useState } from 'react';
import { ParentCategory } from 'src/pages/category/list';

const headerCSS = css`
  background-color: #fff;
  padding: 10px 15px;
  border-bottom: 2px solid #1f8ce6;
  font-size: 14px;
`;

const listCSS = css`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  border-bottom: 1px solid #e6e8eb;
  background-color: #fff;
`;

const parentCategoryNameCSS = css`
  font-weight: 700;
  color: #636c73;
  font-size: 14px;
`;
//
// const SubCategoryList: React.FC = props => {
//   return (
//
//   )
// }

const Mobile: React.FC<CategoryListProps> = props => {
  console.log(props.categoryList);
  const [selectedCategory, setCategory] = useState<ParentCategory>(null);
  const handleSelectCategory = (category: ParentCategory) => {
    setCategory(selectedCategory && selectedCategory.name === category.name ? null : category);
  };
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        background-color: #f2f4f5;
      `}>
      <section css={css``}>
        <h3 css={headerCSS}>일반</h3>
        <ul css={listCSS}>
          {props.categoryList.general.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <li
                  onClick={handleSelectCategory.bind(null, item)}
                  css={css`
                    :first-of-type {
                      border-top: 0;
                    }
                    width: 50%;
                    height: 100%;
                    padding: 10px 10px 10px 15px;
                    border-left: 1px solid #e6e8eb;
                    display: flex;
                    flex-direction: column;
                    //transition: background 0.15s, color 0.15s;
                    span {
                      //transition: background 0.15s, color 0.15s;
                      ${selectedCategory && selectedCategory.name === item.name
                        ? 'color: #fff;'
                        : ''};
                    }
                    ${selectedCategory && selectedCategory.name === item.name
                      ? 'background: #636c73; color: #fff;'
                      : ''};
                  `}>
                  <span css={parentCategoryNameCSS}>{item.name}</span>
                </li>
                {selectedCategory &&
                  index !== 0 &&
                  index % 2 === 1 &&
                  (selectedCategory.name === item.name ||
                    selectedCategory.name === props.categoryList.general[index - 1].name) && (
                    <li
                      css={css`
                        width: 100%;
                        //height: 100%;
                        background-color: #ebf6ff;
                        border-top: 1px solid #e6e8eb;
                        border-bottom: 1px solid #e6e8eb;
                      `}>
                      <ul
                        css={css`
                          overflow: hidden;
                          display: flex;
                          flex-wrap: wrap;
                          ${selectedCategory.name === item.name
                            ? css`
                                display: flex;
                                max-height: 500px;
                              `
                            : 'max-height: 0;'};
                          //height: auto;
                          //transition: max-height 0.15s;
                        `}>
                        <li
                          css={css`
                            width: 100%;
                            padding: 10px 10px 10px 15px;
                            text-indent: 5px;
                            color: #636c73;
                            font-size: 14px;
                          `}>{`${item.name} 전체`}</li>
                        {item.subCategory.map((subItem, subIndex) => (
                          <li
                            css={css`
                              width: 50%;
                              padding: 10px 10px 10px 15px;
                              text-indent: 5px;
                              color: #636c73;
                              font-size: 14px;
                            `}
                            key={subIndex}>
                            {subItem.name}
                          </li>
                        ))}
                      </ul>
                      <ul
                        css={css`
                          overflow: hidden;
                          display: flex;
                          flex-wrap: wrap;

                          ${selectedCategory.name === props.categoryList.general[index - 1].name
                            ? css`
                                display: flex;
                                max-height: 500px;
                              `
                            : 'max-height: 0;'};
                          //height: auto;
                          //transition: max-height 0.15s;
                        `}>
                        <li
                          css={css`
                            width: 100%;
                            padding: 10px 10px 10px 15px;
                            text-indent: 5px;
                            color: #636c73;
                            font-size: 14px;
                          `}>{`${props.categoryList.general[index - 1].name} 전체`}</li>
                        {props.categoryList.general[index - 1].subCategory.map(
                          (subItem, subIndex) => (
                            <li
                              css={css`
                                width: 50%;
                                padding: 10px 10px 10px 15px;
                                text-indent: 5px;
                                color: #636c73;
                                font-size: 14px;
                              `}
                              key={subIndex}>
                              {subItem.name}
                            </li>
                          ),
                        )}
                      </ul>
                    </li>
                  )}
              </React.Fragment>
            );
          })}
        </ul>
      </section>
      <section>
        <h3 css={headerCSS}>로맨스/판타지/만화/BL</h3>
        <ul css={listCSS}>
          {props.categoryList.curatedCategory.map((item, index) => (
            <li
              css={css`
                width: 50%;
                height: 40px;
                padding: 10px 10px 10px 15px;
                border-bottom: 1px solid #e6e8eb;
                :nth-of-type(2n) {
                  border-left: 1px solid #e6e8eb;
                }
              `}
              key={index}>
              <span css={parentCategoryNameCSS}>{item.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Mobile;
