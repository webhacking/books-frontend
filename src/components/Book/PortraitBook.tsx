import styled from '@emotion/styled';

export const PortraitBook = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  :first-of-type {
    padding-left: 20px;
  }
  :last-of-type {
    padding-right: 20px;
  }
  :not(:last-of-type) {
    margin-right: 24px;
  }

  @media (max-width: 999px) {
    min-width: 120px;
    width: 120px;
    :first-of-type {
      padding-left: 16px;
    }
    :last-of-type {
      padding-right: 16px;
    }
    :not(:last-of-type) {
      margin-right: 20px;
    }
  }
`;
