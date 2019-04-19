/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import * as React from 'react';
import axios from 'axios';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ConnectedInitializeProps } from 'src/types/common';

const GNBWrapper = styled.div`
  width: 100vw;
  #books_header {
    background-color: ${props => props.theme.primaryColor};
  }
`;

interface GNBState {
  result?: {
    email: string;
  };
  theme?: string | boolean;
}

interface GNBProps {
  gnbType?: string;
  email?: string;
  theme?: string;
}
export default class GNB extends React.Component<GNBProps, GNBState> {
  public static async getInitialProps(
    initialProps: ConnectedInitializeProps<{ gnbType: string; theme: string }>,
  ) {
    return { ...initialProps.query };
  }

  public state: GNBState = {
    result: undefined,
    theme: this.props.theme,
  };

  public click = async () => {
    const result = await axios.get('https://randomuser.me/api/');
    this.setState({
      result: result.data.results[0],
    });
  };
  public render() {
    return (
      <ThemeProvider theme={!this.state.theme ? defaultTheme : darkTheme}>
        <GNBWrapper>
          <header id="books_header">
            <nav className="GNBNavigation">
              <ul className="GNBNavigation_List">
                <li className="GNBNavigation_Item">
                  <a href="{{ RIDISELECT_URL }}">
                    <span className="GNBNavigation_RidiSelectIcon" />
                    <span className="indent_hidden">리디셀렉트</span>
                  </a>
                </li>
                <li className="GNBNavigation_Item">
                  <a href="https://paper.ridibooks.com">
                    <span className="GNBNavigation_PaperIcon" />
                    <span className="indent_hidden">페이퍼</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div className="header_top">
              <div className="top_contents">
                <div className="top_left">
                  <h1 id="main_logo">
                    <a href="/" className="main_logo_link">
                      <span className="main_logo_icon" />
                      <span className="indent_hidden">RIDIBOOKS</span>
                    </a>
                  </h1>
                </div>
                <div className="top_right">
                  <ul className="right_list_wrapper">
                    <li className="top_right_item menu_noti {% if isPc %}pc_hover js_track_trigger_mouseenter{% endif %}">
                      <a href="/notification" id="gnb_noti_link">
                        <span className="indent_hidden">리디 알림센터</span>
                        <span className="icon-bell_1" />
                        <span className="indent_hidden">, 새로운 알림 </span>
                        <span className="noti_num museo_sans hidden" />
                        <span className="indent_hidden">개</span>
                      </a>
                      <div id="notiMenuPopup" className="GNB_popup">
                        <div className="arrow_wrapper">
                          <span className="icon-arrow_1_up arrow_up_black" />
                          <span className="icon-arrow_1_up arrow_up_steelblue" />
                        </div>
                        <h3 className="indent_hidden">알림센터 팝업</h3>
                        <div className="popup_contents">
                          <p className="popup_header">
                            <span className="popup_header_title">알림센터</span>
                            <span className="btn_link">
                              <a href="/notification/">
                                전체보기 <span className="icon-arrow_9_right" />
                              </a>
                            </span>
                          </p>
                          <ul className="noti_list_wrapper" />
                          <p className="noti_empty_text indent_hidden">새로운 알림이 없습니다.</p>
                          <div className="spin" />
                          <div className="more_btn_wrapper">
                            <a className="more_btn" href="/notification/">
                              <span className="icon-dotdotdot" />
                              <span className="indent_hidden">더보기</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="top_right_item menu_user {% if isPc %}pc_hover{% endif %}">
                      <a href="/account/myridi" id="gnb_myridi_link">
                        마이리디
                      </a>
                      <div id="divMyMenuLayer" className="GNB_popup">
                        <div className="arrow_wrapper">
                          <span className="icon-arrow_1_up arrow_up_black" />
                          <span className="icon-arrow_1_up arrow_up_steelblue" />
                        </div>
                        <div className="popup_contents">
                          <h3 className="indent_hidden">마이리디 팝업</h3>
                          <div className="header_wrapper">
                            <p className="id_wrapper">
                              <a className="myridi_link" href="/account/myridi">
                                마이리디 홈 <span className="icon-arrow_9_right icon" />
                              </a>
                            </p>
                          </div>
                          <div className="spin" />
                        </div>
                      </div>
                    </li>
                    <li className="top_right_item menu_cart {% if isPc %}pc_hover{% endif %}">
                      <a href="/cart" id="gnb_cart_link" className="menu_cart_link">
                        카트 <span className="cart_num museo_sans">CARD COUNT</span>
                      </a>
                      <div id="cartMenuPopup" className="GNB_popup">
                        <div className="arrow_wrapper">
                          <span className="icon-arrow_1_up arrow_up_black" />
                          <span className="icon-arrow_1_up arrow_up_steelblue" />
                        </div>
                        <h3 className="indent_hidden">카트 팝업</h3>
                        <div className="popup_contents">
                          <p className="book_count">
                            <span className="indent_hidden">카트에 담긴 도서:</span>
                            <span className="count_num" />
                            <span className="btn_link">
                              <a href="/cart/">
                                전체보기 <span className="icon-arrow_9_right" />
                              </a>
                            </span>
                          </p>
                          <div className="spin" />
                        </div>
                      </div>
                    </li>
                    <li className="top_right_item menu_library">
                      <a
                        href="{{ LIBRARY_URL }}"
                        id="gnb_library_link"
                        className="menu_library_link">
                        내 서재 <img src="{{ STATIC_URL }}/books/dist/images/icon_beta.svg" />
                      </a>
                    </li>
                    <li className="top_right_item menu_join">
                      <a id="gnb_join_btn" className="menu_join_link" href="{{ join_link }}">
                        <span>회원가입</span>
                      </a>
                    </li>
                    <li className="top_right_item menu_login">
                      <a id="gnb_login_btn" href="{{ login_link }}">
                        <span>로그인</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <hr className="clear_both" />
            </div>
          </header>
        </GNBWrapper>
      </ThemeProvider>
    );
  }
}
