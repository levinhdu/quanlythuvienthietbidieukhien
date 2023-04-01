import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTokenInfo } from "src/util/Common";

import {
  hideMessage,
  showAuthLoader,
  userSignIn,
} from "../appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import InfoView from "src/components/InfoView";
import CircularProgress from "src/components/CircularProgress";

const { Option } = Select;

const SignIn = ({ history }) => {
  const [domain, setDomain] = useState("thaco.com.vn");
  const dispatch = useDispatch();
  const { authUser, loader, showMessage, alertMessage } = useSelector(
    ({ auth }) => auth
  );

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (values) => {
    dispatch(hideMessage());
    const signInValue = { ...values, domain };
    dispatch(showAuthLoader());
    dispatch(userSignIn(signInValue));
  };

  useEffect(() => {
    const userInfo = getTokenInfo();
    if ((authUser && authUser.token) || (userInfo && userInfo.token)) {
      history.push("/home");
    }
  }, [authUser, history]);

  const optionSignIn = () => {
    return (
      <Select defaultValue={domain} onChange={(e) => setDomain(e)}>
        <Option value="thaco.com.vn">@thaco.com.vn</Option>
        <Option value="thagrico.vn">@thagrico.vn</Option>
        <Option value="dqmcorp.vn">@dqmcorp.vn</Option>
        <Option value="vinamazda.vn">@vinamazda.vn</Option>
        <Option value="">Mã nhân viên</Option>
      </Select>
    );
  };

  const placeHolderText = domain === "" ? "Mã nhân viên" : "Email";

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg"></div>
            <div className="gx-app-logo-wid">
              <h1>
                <IntlMessages id="app.userAuth.signIn" />
              </h1>
              <p>
                <IntlMessages id="app.userAuth.bySigning" />
              </p>
              <p>
                <IntlMessages id="app.userAuth.getAccount" />
              </p>
            </div>
            <div className="gx-app-logo">
              <img alt="example" src={require("src/assets/images/logo.png")} />
            </div>
          </div>
          <div className="gx-app-login-content">
            <Form
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <Form.Item
                initialValue=""
                rules={[{ required: true, message: "Hãy điền tài khoản" }]}
                name="username"
              >
                <Input
                  placeholder={placeHolderText}
                  type="text"
                  addonAfter={optionSignIn()}
                />
              </Form.Item>

              <Form.Item
                initialValue=""
                rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}
                name="password"
              >
                <Input type="password" placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  <IntlMessages id="app.userAuth.signIn" />
                </Button>
              </Form.Item>
            </Form>
          </div>
          {loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
          {showMessage ? message.error(alertMessage.toString()) : null}
          <InfoView />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
