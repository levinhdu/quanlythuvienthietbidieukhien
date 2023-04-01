import React from "react";
import {useSelector} from "react-redux";
import {Menu} from "antd";
import {Icon} from '@ant-design/compatible';
import {Link} from "react-router-dom";
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import remove from 'lodash/remove';
import toNumber from 'lodash/toNumber';

import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "src/constants/ThemeSetting";
import {refillMenuPermission, themeColorHome} from 'src/util/Common';

const SubMenu = Menu.SubMenu;

const HorizontalNav = () => {

  const navStyle = useSelector(({settings}) => settings.navStyle);
  const {pathname} = useSelector(({common}) => common).toJS();
  const menuInfo = useSelector(({menus}) => menus);
  const {themeColor, themeType} = useSelector(({settings}) => settings);
  const newPathName = pathname === window.location.pathname ? pathname : window.location.pathname;

  const getNavStyleSubMenuClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve";
      default:
        return "gx-menu-horizontal";

    }
  };

  const renderMenuItem = (menu) => {
    if (isEmpty(menu.children)) {
      return (
        <Menu.Item key={menu.url}>
          <Link to={`/${menu.url}`}><Icon type={menu.icon}/>
            <span>{menu.tenMenu}</span></Link>
        </Menu.Item>
      )
    } else {
      return (
        <SubMenu key={menu.url} popupClassName={getNavStyleSubMenuClass(navStyle)}
                 title={<span>{menu.tenMenu}</span>}>
          {map(menu.children, item => {
            return renderMenuItem(item);
          })}
        </SubMenu>
      )
    }
  }

  const renderMenu = () => {
    if (menuInfo && !isEmpty(menuInfo.menus)) {
      const refillMenu = refillMenuPermission(menuInfo.menus);
      return map(refillMenu, menu => {
        return renderMenuItem(menu);
      });
    }
    return null;
  }

  /**
   * Thay đổi lại key menu để thiết lập active menu kể cả khi nhấn vào thêm mới chỉnh sửa
   * @params {*} list danh sách
   * @memberof HorizontalNav
   */
  const reSelectedKeys = (selectedKeys) => {
    const listToRemove = [
      'them-moi',
      'chinh-sua',
      '',
      'chi-tiet',
      'phan-quyen',
      'phan-bo-ke-hoach-giao',
      'phan-bo-ke-hoach-nhan',
      'phien-ban',
      'ban-sao'
    ];
    let selectedKeysTmp = selectedKeys.split('/');
    map(listToRemove, val => remove(selectedKeysTmp, item => item === val));
    // Remove all number as string in array
    remove(selectedKeysTmp, item => {
      // convert to number
      if (!isNaN(toNumber(item))) {
        return true;
      }
      if (item.length === 36) {
        return true;
      }
      return false;
    });
    return selectedKeysTmp.join('/');
  }

  const defaultHomeMenuColor = () => {
    let color = 'white';
    if (navStyle === 'NAV_STYLE_ABOVE_HEADER' || navStyle === 'NAV_STYLE_BELOW_HEADER') {
      color = '#7A7A7A';
    }
    return color;
  }

  const selectedKeys = newPathName.substr(1);
  const defaultOpenKeys = selectedKeys.split('/')[0];
  const newSelectedKeys = reSelectedKeys(selectedKeys);
  const styleColor = themeType === 'THEME_TYPE_DARK' ? {color: '#fa8c15'} : {color: themeColorHome(themeColor)};
  return (
    <Menu
      defaultOpenKeys={[defaultOpenKeys]}
      selectedKeys={[newSelectedKeys]}
      mode="horizontal">
      <Menu.Item key="home">
        <Link to="/home"><i
          className="-flex-column-reverse"/><span
          style={newSelectedKeys === 'home' ? styleColor : {color: defaultHomeMenuColor()}}>Trang chủ</span></Link>
      </Menu.Item>
      {renderMenu()}
    </Menu>

  );
};

HorizontalNav.propTypes = {};

export default HorizontalNav;

