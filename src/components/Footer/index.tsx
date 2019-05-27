import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as React from 'react';
import { Svg } from 'src/components/Svg';

const ridiMeta = {
  serviceCenterNumber: '1644-0331',
  address: '서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)',
  info:
    '리디 (주) 대표 배기식 사업자등록번호 120-87-27435 통신판매업신고 제 2009-서울강남 35-02139호',
};

const FNBWrapper = styled.section`
  width: 100%;
  //min-width: 375px;
  color: ${props => props.theme.footerTextColor};
  hr {
    display: none;
  }
`;

const NoticeSection = styled.section`
  border-bottom: 1px solid ${props => props.theme.horizontalRuleColor};
  article {
    margin: 0 auto;
    padding: 15px 17px 14px 16px;
    max-width: 1000px;
  }
  @media (max-width: 999px) {
    //font-size: 3rem;
  }
`;

const FooterWrapper = styled.footer`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const FlexBox = styled.div`
  display: flex;
  align-items: start;
  justify-content: unset;
  @media (max-width: 999px) {
    flex-direction: column;
    justify-content: start;
    align-items: unset;
  }
`;

const Contact = styled.ul`
  //min-width: 192px;
  display: flex;
  align-items: center;
  li {
    word-break: keep-all;
    span {
      word-break: keep-all;
      white-space: nowrap;
    }
    :not(:last-of-type) {
      ::after {
        position: relative;
        font-size: 13px;
        content: '|';
        top: -3px;
        color: ${props => props.theme.verticalRuleColor};
        margin: 0 10px;
      }
    }
  }
  margin-right: 74px;

  @media (max-width: 999px) {
    margin-bottom: 28px;
  }
`;

const serviceNumber = css`
  word-break: keep-all;
  font-size: 20px;
  letter-spacing: -0.3px;
  font-weight: bold;
  color: white;
`;

const serviceCenter = css`
  ${serviceNumber};
  line-height: 1;
  word-break: keep-all;
`;

const FooterMenuWrapper = styled.ul`
  display: flex;
  padding-top: 6px;
  margin-bottom: 48px;
  @media (max-width: 999px) {
    margin-bottom: 24px;
  }
`;

const FooterMenu = styled.ul`
  & {
    margin-right: 16px;
  }
  li {
    width: 164px;
    :not(:last-of-type) {
      margin-bottom: 16px;
    }
  }
`;
const FooterMenuLabel = styled.span`
  font-size: 14px;
  letter-spacing: -0.2px;
`;

const hiddenMenu = css`
  @media (max-width: 999px) {
    display: none;
  }
`;

const anchorHover = css`
  word-break: keep-all;
  :hover {
    opacity: 0.7;
  }
`;

const InformationWrapper = styled.address`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  @media (max-width: 999px) {
    flex-direction: column;
    margin-bottom: 16px;
  }
`;

const address = css`
  display: block;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.82;
  letter-spacing: -0.2px;
  margin-right: 8px;
  color: #7e8992;
`;

const MiscWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  @media (max-width: 999px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`;

const Copyright = styled.p`
  width: 83px;
  height: 17px;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #7e8992;
  margin-right: 24px;
  @media (max-width: 999px) {
    margin-bottom: 16px;
  }
`;

const MiscMenu = styled.ul`
  display: flex;
  li {
    :not(:last-of-type) {
      ::after {
        position: relative;
        font-size: 10px;
        content: '|';
        top: -1px;
        color: ${props => props.theme.verticalRuleColor};
        margin: 0 5.5px;
      }
    }
  }
`;

const MiscMenuLabel = styled.span`
  width: 41px;
  height: 20px;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.82;
  letter-spacing: -0.2px;
  color: #7e8992;
`;

const NoticeWrapper = styled.article`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

const NoticeLabel = styled.h2`
  line-height: 14px;
  a {
    font-size: 15px;
    font-weight: bold;
    line-height: 0.93;
    letter-spacing: -0.5px;
  }
  margin-right: 10px;
`;

interface NoticeItem {
  title: string;
  url: string;
}

interface FooterProps {
  // Fix me
  // tslint:disable-next-line
  noticeItems?: NoticeItem[];
}

export default class Footer extends React.PureComponent<FooterProps> {
  public render() {
    return (
      <FNBWrapper css={theme => ({ backgroundColor: theme.secondaryColor })}>
        <NoticeSection>
          <NoticeWrapper>
            <NoticeLabel>
              <a href="/support/notice">공지사항</a>
            </NoticeLabel>
            <ul>
              <li>{this.props.noticeItems ? this.props.noticeItems[0].title : ''}</li>
            </ul>
          </NoticeWrapper>
        </NoticeSection>
        <hr />
        <FooterWrapper>
          <FlexBox>
            <Contact>
              <li>
                <span className={'a11y'}>전화번호 : </span>
                <span css={serviceNumber} className={'museo_sans'}>
                  {ridiMeta.serviceCenterNumber}
                </span>
              </li>
              <li>
                <a
                  css={anchorHover}
                  href="https://help.ridibooks.com/hc/ko"
                  target="_blank"
                  rel="noopener">
                  <span css={serviceCenter}>고객센터</span>
                </a>
              </li>
            </Contact>
            <FooterMenuWrapper>
              <li>
                <FooterMenu>
                  <li>
                    <a css={anchorHover} href="https://paper.ridibooks.com">
                      <Svg iconName={'Paper'} width={'45px'} height={'12px'} fill={'white'} />
                      <span className={'a11y'}>페이퍼</span>
                    </a>
                  </li>
                  <li>
                    <a css={anchorHover} href="https://ridibooks.com/support/partner-card">
                      <FooterMenuLabel>제휴카드</FooterMenuLabel>
                    </a>
                  </li>
                  <li>
                    <a css={anchorHover} href="https://ridibooks.com/support/app/download">
                      <FooterMenuLabel>뷰어 다운로드</FooterMenuLabel>
                    </a>
                  </li>
                  <li>
                    <a css={anchorHover} href="https://ridibooks.com/order/checkout/cash">
                      <FooterMenuLabel>리디캐시 충전</FooterMenuLabel>
                    </a>
                  </li>
                </FooterMenu>
              </li>
              <li css={hiddenMenu}>
                <FooterMenu>
                  <li>
                    <a css={anchorHover} href="https://ridibooks.com/partners/">
                      <FooterMenuLabel>콘텐츠 제공 문의</FooterMenuLabel>
                    </a>
                  </li>
                  <li>
                    <a
                      css={anchorHover}
                      href="https://cp.ridibooks.com"
                      target="_blank"
                      rel="noopener">
                      <FooterMenuLabel>CP 사이트</FooterMenuLabel>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:biz@ridi.com">
                      <FooterMenuLabel>사업 제휴 문의</FooterMenuLabel>
                    </a>
                  </li>
                </FooterMenu>
              </li>
              <li css={hiddenMenu}>
                <FooterMenu>
                  <li>
                    <a
                      css={anchorHover}
                      href="https://www.facebook.com/ridibooks"
                      target="_blank"
                      rel="noopener">
                      <FooterMenuLabel>페이스북</FooterMenuLabel>
                    </a>
                  </li>
                  <li>
                    <a
                      css={anchorHover}
                      href="https://instagram.com/ridibookspaper/"
                      target="_blank"
                      rel="noopener">
                      <FooterMenuLabel>인스타그램</FooterMenuLabel>
                    </a>
                  </li>
                </FooterMenu>
              </li>
              <li>
                <FooterMenu>
                  <li>
                    <a
                      css={anchorHover}
                      href="https://www.ridicorp.com/"
                      target="_blank"
                      rel="noopener">
                      <FooterMenuLabel>회사 소개</FooterMenuLabel>
                    </a>
                  </li>
                  <li>
                    <a
                      css={anchorHover}
                      href="https://www.ridicorp.com/career/"
                      target="_blank"
                      rel="noopener">
                      <FooterMenuLabel>인재 채용</FooterMenuLabel>
                      <Svg
                        css={() => css`
                          position: relative;
                          top: 1.5px;
                          margin-left: 6px;
                        `}
                        fill={'#509DEB'}
                        iconName={'New_1'}
                        width={'14px'}
                        height={'14px'}
                      />
                    </a>
                  </li>
                </FooterMenu>
              </li>
            </FooterMenuWrapper>
          </FlexBox>

          <InformationWrapper>
            <span css={address}>{ridiMeta.address}</span>
            <span css={address}>{ridiMeta.info}</span>
          </InformationWrapper>
          <MiscWrapper>
            <Copyright className="museo">© RIDI Corp.</Copyright>
            <MiscMenu>
              <li>
                <a
                  css={anchorHover}
                  href="https://ridibooks.com/legal/terms"
                  target="_blank"
                  rel="noopener">
                  <MiscMenuLabel>이용 약관</MiscMenuLabel>
                </a>
              </li>
              <li>
                <a
                  css={anchorHover}
                  href="https://ridibooks.com/legal/privacy"
                  target="_blank"
                  rel="noopener">
                  <MiscMenuLabel
                    css={() =>
                      css`
                        font-weight: bold;
                      `
                    }>
                    개인 정보 처리 방침
                  </MiscMenuLabel>
                </a>
              </li>
              <li>
                <a
                  css={anchorHover}
                  href="https://ridibooks.com/legal/youth"
                  target="_blank"
                  rel="noopener">
                  <MiscMenuLabel>청소년 보호 정책</MiscMenuLabel>
                </a>
              </li>
              <li>
                <a
                  css={anchorHover}
                  href="http://ftc.go.kr/info/bizinfo/communicationList.jsp"
                  target="_blank"
                  rel="noopener">
                  <MiscMenuLabel>사업자 정보 확인</MiscMenuLabel>
                </a>
              </li>
            </MiscMenu>
          </MiscWrapper>
        </FooterWrapper>
      </FNBWrapper>
    );
  }
}
