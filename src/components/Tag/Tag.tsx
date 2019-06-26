import * as React from 'react';
import { Fragment } from 'react';
import { css } from '@emotion/core';

const tagWrapper = css`
  width: 34px;
  height: 21px;
  border-radius: 3px;
  font-family: AppleSDGothicNeo;
  font-size: 13px;
  font-weight: bold;
  line-height: 21px;
  letter-spacing: -0.37px;
  text-align: center;
`;

const novelCSS = css`
  ${tagWrapper};
  border: solid 1px rgba(203, 50, 86, 0.2);
  background-color: #f9eaee;
  color: #cb3256;
`;
const comicCSS = css`
  ${tagWrapper};
  border: solid 1px rgba(15, 93, 156, 0.2);
  background-color: #e7eef5;
  color: #0f5d9c;
`;

const NovelTag = () => {
  return <span css={novelCSS}>소설</span>;
};
const ComicTag = () => {
  return <span css={comicCSS}>만화</span>;
};

export default class Tag extends React.Component {
  public static Comic = ComicTag;
  public static Novel = NovelTag;
  public render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}
