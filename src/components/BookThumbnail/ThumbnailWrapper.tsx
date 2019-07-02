import styled from '@emotion/styled';

export const ThumbnailWrapper = styled.div`
  max-height: 216px;
  height: 216px;
  display: flex;
  align-items: flex-end;
  min-width: 140px;
  margin-bottom: 8px;
  flex-shrink: 0;
  @media (max-width: 999px) {
    min-width: 120px;
    max-height: 184px;
    height: 184px;
  }
  img {
    @media (max-width: 999px) {
      max-height: calc(120px * 1.618 - 10px);
    }
    max-height: calc(140px * 1.618 - 10px);
  }
`;
