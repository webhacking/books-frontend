import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as React from 'react';
import PaperIcon from 'src/svgs/Paper.svg';
import NewIcon from 'src/svgs/New_1.svg';
import { RIDITheme } from 'src/styles';

const ridiMeta = {
  serviceCenterNumber: '1644-0331',
  address: '서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)',
  info:
    '리디 (주) 대표 배기식 사업자등록번호 120-87-27435 통신판매업신고 제 2009-서울강남 35-02139호',
};

const FNBWrapper = styled.section`
  width: 100%;
  //min-width: 375px;
  color: ${(props: { theme: RIDITheme }) => props.theme.footerTextColor};
  hr {
    display: none;
  }
  margin-top: 24px;
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
    justify-content: flex-start;
    align-items: unset;
  }
`;

const contactListCSS = (theme: RIDITheme) => css`
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
        color: ${theme.verticalRuleColor};
        margin: 0 10px;
      }
    }
  }
  margin-right: 80px;

  @media (max-width: 999px) {
    margin-bottom: 28px;
  }
`;

const serviceNumber = css`
  word-break: keep-all;
  font-size: 20px;
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
    width: 140px;
    :not(:last-of-type) {
      margin-bottom: 16px;
    }
  }
`;
const FooterMenuLabel = styled.span`
  font-size: 14px;
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
  li {
    flex-shrink: 0;
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
  color: #7e8992;
  margin-right: 24px;
  @media (max-width: 999px) {
    margin-bottom: 16px;
  }
`;

const menuListCSS = (theme: RIDITheme) => css`
  display: flex;
  li {
    :not(:last-of-type) {
      ::after {
        position: relative;
        font-size: 10px;
        content: '|';
        top: -1px;
        color: ${theme.verticalRuleColor};
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
  color: #7e8992;
`;

const paperIcon = css`
  width: 45px;
  height: 12px;
  fill: white;
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

const Footer: React.FC<FooterProps> = () => (
  // @ts-ignore
  <FNBWrapper css={theme => ({ backgroundColor: theme.secondaryColor })}>
    <FooterWrapper>
      <FlexBox>
        <ul css={contactListCSS}>
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
          <li>
            <a css={anchorHover} href="/support/notice">
              <span css={serviceCenter}>공지사항</span>
            </a>
          </li>
        </ul>
        <FooterMenuWrapper>
          <li>
            <FooterMenu>
              <li>
                <a css={anchorHover} href="https://paper.ridibooks.com">
                  <PaperIcon css={paperIcon} />
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
                  <NewIcon
                    css={css`
                      position: relative;
                      top: 1.5px;
                      margin-left: 6px;
                      fill: #509deb;
                      width: 14px;
                      height: 14px;
                    `}
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
        <ul css={menuListCSS}>
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
                css={() => css`
                  font-weight: bold;
                `}>
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
        </ul>
      </MiscWrapper>
    </FooterWrapper>
  </FNBWrapper>
);

export default Footer;
