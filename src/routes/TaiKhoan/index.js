import React, { useEffect, useState } from 'react';
import { PageHeader, Descriptions, Form, Card } from 'antd';
import { useDispatch } from 'react-redux';

import { fetchStart, fetchReset } from 'src/appRedux/actions/Common';
import { Input, FormSubmit } from 'src/components/Common';
import { getTokenInfo, setCookieValue } from 'src/util/Common';
import { DEFAULT_FORM_STYLE } from 'src/constants/Config';

const FormItem = Form.Item;

function TaiKhoan() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [fieldTouch, setFieldTouch] = useState(false);

  const { resetFields } = form;

  useEffect(() => {
    const load = () => {
      const userInfo = getTokenInfo();
      setFullName(userInfo.fullName);
      setEmail(userInfo.email);
    }
    load();
    return () => dispatch(fetchReset());
  }, [dispatch]);

  /**
   * Submit thay đổi mật khẩu
   *
   * @param {*} values
   */
  const onFinish = values => {
    new Promise((resolve, reject) => {
      dispatch(fetchStart('Account/ChangePassword', 'POST', values.user, 'EDIT', '', resolve, reject));
    }).then(res => {
      if (!res.data) resetFields();
      resetFields([{
        'user': 'password'
      }]);
      setFieldTouch(false);
      if (res.status === 200) {
        // Change tokenInfo
        let tokenInfo = getTokenInfo();
        tokenInfo.mustChangePass = false;
        const maxAge = new Date(tokenInfo.expires);
        setCookieValue('tokenInfo', tokenInfo, { path: '/', maxAge: maxAge.getTime() });
        setTimeout(() => {
          window.location.href = '/home';
        }, 3000);
      }
    }).catch(error => console.error(error));
  };

  return (
    <Card>
      <PageHeader
        title="Thông tin tài khoản"
        subTitle="Chi tiết"
      >
        <Descriptions>
          <Descriptions.Item label="Email"><strong>{email}</strong></Descriptions.Item>
          <Descriptions.Item label="Họ tên"><strong>{fullName}</strong></Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <Form
        {...DEFAULT_FORM_STYLE}
        form={form}
        name="tai-khoan-control"
        onFinish={onFinish}
        onFieldsChange={() => setFieldTouch(true)}
      >
        <FormItem
          label="Mật khẩu cũ"
          name={['user', 'password']}
          rules={[{
            required: true,
            type: 'string'
          }]}
          initialValue=''
        >
          <Input
            className='input-item'
            placeholder='Nhập mật khẩu cũ'
            type="password"
          />
        </FormItem>
        <FormItem
          label="Mật khẩu mới"
          name={['user', 'newPassword']}
          rules={[{
            required: true,
            type: 'string',
            min: 6
          },
          { pattern: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/, message: 'Mật khẩu cần có Ký tự hoa, ký tự đặc biệt và số' },
          ]}
          initialValue=''
        >
          <Input
            className='input-item'
            placeholder='Nhập mật khẩu mới'
            type="password"
          />
        </FormItem>
        <FormItem
          label="Xác nhận mật khẩu"
          name={['user', 'confirmNewPassword']}
          rules={[{
            required: true,
            type: 'string',
            min: 6,
          },
          {
            pattern: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
            message: 'Mật khẩu cần có Ký tự hoa, ký tự đặc biệt và số'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue(['user', 'newPassword']) === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Hai mật khẩu không giống nhau!'));
            },
          }),
          ]}
          initialValue=''
        >
          <Input
            className='input-item'
            placeholder='Nhập Xác nhận mật khẩu'
            type="password"
          />
        </FormItem>
        <FormSubmit disabled={fieldTouch} />
      </Form>
    </Card>
  )
}

export default TaiKhoan
