import React from 'react';
import { VERTICAL_RIGHT_ARROW_ICON_URL } from 'src/constants/icons';
import styled from '@emotion/styled';

interface MarginProps {
  marginTop?: number;
  marginLeft?: number;
  marginBottom?: number;
  marginRight?: number;
}

const SpacingImg = styled.img<MarginProps>`
  margin-top: ${(props) => props.marginTop}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
`;

export const VerticalAnchorArrow: React.FC<MarginProps> = ({
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
}) => (
  <SpacingImg
    marginTop={marginTop}
    marginBottom={marginBottom}
    marginLeft={marginLeft}
    marginRight={marginRight}
    width={11}
    height={14}
    src={VERTICAL_RIGHT_ARROW_ICON_URL}
    alt="페이지 이동"
  />
);
