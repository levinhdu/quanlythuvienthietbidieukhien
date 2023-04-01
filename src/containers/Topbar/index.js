import React from "react";
import {Layout} from "antd";
import {Link} from "react-router-dom";

import {toggleCollapsedSideNav} from "src/appRedux/actions/Setting";
import UserInfo from "src/components/UserInfo";

import {NAV_STYLE_DRAWER, NAV_STYLE_FIXED, NAV_STYLE_MINI_SIDEBAR, TAB_SIZE} from "src/constants/ThemeSetting";
import {useDispatch, useSelector} from "react-redux";

const {Header} = Layout;

const Topbar = () => {
  const {navStyle} = useSelector(({settings}) => settings);
  const {navCollapsed, width} = useSelector(({common}) => common).toJS();
  const dispatch = useDispatch();

  return (
    <Header>
      {navStyle === NAV_STYLE_DRAWER || ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) && width < TAB_SIZE) ?
        <div className="gx-linebar gx-mr-3">
          <i className="gx-icon-btn icon icon-menu"
             onClick={() => {
               dispatch(toggleCollapsedSideNav(!navCollapsed));
             }}
          />
        </div> : null}
      <Link to="/" className="gx-d-block gx-d-lg-none gx-pointer">
        <img alt="" src={require("assets/images/w-logo.png")}/></Link>
      {width >= TAB_SIZE
        ?
        <div style={{marginBottom: -8}}>
          <h3>QUẢN LÝ THƯ VIỆN THIẾT BỊ ĐIỆN ĐIỀU KHIỂN</h3>
        </div>
        : null
      }
      <ul className="gx-header-notifications gx-ml-auto">
        <li className="gx-user-nav"><UserInfo isDesktop={width >= TAB_SIZE}/></li>
      </ul>
    </Header>
  );
};

export default Topbar;
