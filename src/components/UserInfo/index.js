import React from "react";
import { Avatar, Popover, Button } from "antd";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import IntlMessages from 'src/util/IntlMessages';
import { logOut, getTokenInfo } from 'src/util/Common';

const UserInfo = ({ isDesktop, color }) => {

  const userInfo = getTokenInfo();

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li><Link to={'/tai-khoan'} className="ant-btn ant-btn-link" style={{ margin:0 }}><UserOutlined /> <IntlMessages id="user.account" /></Link></li>
      <li onClick={() => logOut()}><Button type="link" style={{ margin: 0 }}><LogoutOutlined /> <IntlMessages id="user.logout" /></Button></li>
    </ul>
  );

  return (
    <div className="gx-flex-row gx-align-items-center gx-avatar-row">
        <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
          {isDesktop &&
            <Avatar src={'https://via.placeholder.com/150x150'}
              className="gx-size-40 gx-pointer gx-mr-3" alt="" />
          }
          <span className="gx-avatar-name" style={color ? { color } : {}}>{userInfo ? userInfo.fullName : ''}<i
            className="icon icon-chevron-down gx-fs-xxs gx-ml-2" /></span>
        </Popover>
      </div>
  )

}

export default UserInfo;
