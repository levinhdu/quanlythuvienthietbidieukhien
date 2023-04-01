import React from "react";
import { useSelector } from "react-redux";
import { Menu } from "antd";
import { Icon } from "@ant-design/compatible";
import { Link } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import remove from "lodash/remove";
import toNumber from "lodash/toNumber";
import includes from "lodash/includes";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import {
  THEME_TYPE_LITE,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
} from "src/constants/ThemeSetting";
import { refillMenuPermission, themeColorHome } from "src/util/Common";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SidebarContent = () => {
  let { pathname } = useSelector(({ common }) => common).toJS();
  let { themeType, navStyle, themeColor } = useSelector(
    ({ settings }) => settings
  );
  const menuInfo = useSelector(({ menus }) => menus);
  const newPathName =
    pathname === window.location.pathname ? pathname : window.location.pathname;

  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  const renderMenuItem = (menu) => {
    if (isEmpty(menu.children)) {
      return (
        <Menu.Item key={menu.url}>
          <Link to={`/${menu.url}`}>
            <Icon type={menu.icon} />
            <span style={{ margin: 0 }}>{menu.tenMenu}</span>
          </Link>
        </Menu.Item>
      );
    } else {
      if (!includes(menu.url, "/") && !isEmpty(menu.children)) {
        return (
          <MenuItemGroup
            key={menu.url}
            className="gx-menu-group"
            title={
              <span style={{ color: themeColorHome(themeColor) }}>
                {menu.tenMenu}
              </span>
            }
          >
            {map(menu.children, (item) => {
              return renderMenuItem(item);
            })}
          </MenuItemGroup>
        );
      }
      return (
        <SubMenu
          key={menu.url}
          popupClassName={getNavStyleSubMenuClass(navStyle)}
          title={
            <span>
              {" "}
              <i className={`icon icon-${menu.icon}`} />
              <span>{menu.tenMenu}</span>
            </span>
          }
        >
          {map(menu.children, (item) => {
            return renderMenuItem(item);
          })}
        </SubMenu>
      );
    }
  };

  const renderMenu = () => {
    if (menuInfo && !isEmpty(menuInfo.menus)) {
      const refillMenu = refillMenuPermission(menuInfo.menus);
      return map(refillMenu, (menu) => {
        return renderMenuItem(menu);
      });
    }
    return null;
  };

  /**
   * Thay đổi lại key menu để thiết lập active menu kể cả khi nhấn vào thêm mới chỉnh sửa
   * @params {*} list danh sách
   * @memberof SidebarContent
   */
  const reSelectedKeys = (selectedKeys) => {
    const listToRemove = [
      "them-moi",
      "chinh-sua",
      "",
      "chi-tiet",
      "phan-quyen",
      "phan-bo-ke-hoach-giao",
      "phan-bo-ke-hoach-nhan",
      "lap-yeu-cau",
    ];
    let selectedKeysTmp = selectedKeys.split("/");
    map(listToRemove, (val) => remove(selectedKeysTmp, (item) => item === val));
    // Remove all number as string in array
    remove(selectedKeysTmp, (item) => {
      let result = false;
      // convert to number
      if (!isNaN(toNumber(item))) {
        result = true;
      }
      if (item.length === 36) {
        result = true;
      }
      return result;
    });
    return selectedKeysTmp.join("/");
  };

  const selectedKeys = newPathName.substr(1);
  const defaultOpenKeys = selectedKeys.split("/")[0];
  const newSelectedKeys = reSelectedKeys(selectedKeys);
  return (
    <>
      <SidebarLogo />
      <div className="gx-sidebar-content" style={{ marginTop: 5 }}>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[newSelectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            mode="inline"
          >
            <Menu.Item key="home">
              <Link to="/home">
                <Icon type="home" />
                <span style={{ margin: 0 }}>Trang chủ</span>
              </Link>
            </Menu.Item>
            {renderMenu()}
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
};

SidebarContent.propTypes = {};

export default SidebarContent;
