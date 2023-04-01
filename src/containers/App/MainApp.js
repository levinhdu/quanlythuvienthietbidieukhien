import React, { useEffect } from "react";
import { Layout } from "antd";
// import * as signalR from "@microsoft/signalr";

import Sidebar from "../Sidebar/index";
import HorizontalDefault from "../Topbar/HorizontalDefault/index";
import HorizontalDark from "../Topbar/HorizontalDark/index";
import InsideHeader from "../Topbar/InsideHeader/index";
import AboveHeader from "../Topbar/AboveHeader/index";
import BelowHeader from "../Topbar/BelowHeader/index";

import Topbar from "../Topbar/index";
import { footerText } from "util/config";
import App from "src/routes/index";
import { useSelector, useDispatch } from "react-redux";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR
} from "src/constants/ThemeSetting";
import NoHeaderNotification from "../Topbar/NoHeaderNotification/index";
import { useRouteMatch } from "react-router-dom";
import Customizer from "../Customizer";
import { getTokenInfo } from "src/util/Common";
import { loadMenu } from "src/appRedux/actions";

const { Content, Footer } = Layout;

const MainApp = ({ location }) => {
  const { navStyle } = useSelector(({ settings }) => settings);
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const menuData = useSelector(({ menus }) => menus);

  // useEffect(() => {
  //   const tokenInfo = getCookieValue('tokenInfo');
    // const protocol = new signalR.JsonHubProtocol();

    // const options = {
      // transport,
      // logMessageContent: false,
      // skipNegotiation: true,
      // logger: signalR.LogLevel.Trace,
      // skipNegotiation: true,
      // transport: signalR.HttpTransportType.WebSockets,
    //   accessTokenFactory: () => tokenInfo.token,
    // };

    // Builds the SignalR connection, mapping it to /dashboard
    // const hubConnection = new signalR.HubConnectionBuilder()
      // .withUrl(`${BASE_URL_API}/dashboard`, options)
      // .withAutomaticReconnect()
      // .withHubProtocol(protocol)
      // .configureLogging(signalR.LogLevel.Information)
      // .build();

    // Starts the SignalR connection
    // hubConnection.start().then(a => {
      // Once started, invokes the sendConnectionId in our ChatHub inside our ASP.NET Core application.
      // if (hubConnection.connectionId) {
        // hubConnection.invoke("sendConnectionId", hubConnection.connectionId);
    //   }
    // });
    // hubConnection.on("Receive_Dashboard", receiveMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  /**
   * Xử lý sau khi nhân dữ liệu
   *
   * @param {*} message
   */
  // const receiveMessage = message => {
  //   dispatch(loadThongBao(message.Value));
  // }

  useEffect(() => {
    const info = getTokenInfo();
    if (info && info.token) {
      if(!info.mustChangePass) dispatch(loadMenu());
    }
  }, [dispatch])

  /**
   * Cấu hình gọi giao diện bên ngoài
   *
   * @param {*} navStyle
   * @returns
   */
  const getContainerClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DARK_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-container-wrap";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-container-wrap";
      default:
        return '';
    }
  };

  /**
   * Hiển thị giao diện menu
   *
   * @param {*} navStyle
   * @returns
   */
  const getNavStyles = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return <HorizontalDefault />;
      case NAV_STYLE_DARK_HORIZONTAL:
        return <HorizontalDark />;
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return <InsideHeader />;
      case NAV_STYLE_ABOVE_HEADER:
        return <AboveHeader />;
      case NAV_STYLE_BELOW_HEADER:
        return <BelowHeader />;
      case NAV_STYLE_FIXED:
        return <Topbar />;
      case NAV_STYLE_DRAWER:
        return <Topbar />;
      case NAV_STYLE_MINI_SIDEBAR:
        return <Topbar />;
      case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
        return <NoHeaderNotification />;
      case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
        return <NoHeaderNotification />;
      default:
        return null;
    }
  };

  return (
    <Layout className="gx-app-layout">
      <Sidebar />
      <Layout>
        {getNavStyles(navStyle)}
        <Content className={`gx-layout-content ${getContainerClass(navStyle)} `}>
          <App match={match} menus={menuData ? menuData.menus : []} location={location} />
          <Footer>
            <div className="gx-layout-footer-content">
              {footerText}
            </div>
          </Footer>
        </Content>
      </Layout>
      <Customizer />
    </Layout>
  )
};
export default MainApp;

