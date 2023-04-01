import React, {useState} from "react";
import {Modal, Form, Button} from "antd";
import PropTypes from "prop-types";
import {useDispatch} from 'react-redux';

import {fetchStart} from 'src/appRedux/actions/Common';
import {DEFAULT_FORM_STYLE} from 'src/constants/Config';
import {Input} from "src/components/Common";

const FormItem = Form.Item;

const initState = {
  maDonViTinh: '',
  tenDonViTinh: ''
};

function ModalAddDonViTinh(props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fieldTouch, setFieldTouch] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setFieldsValue, validateFields} = form;

  const {maDonViTinh, tenDonViTinh} = initState;

  /**
   * Hành động thêm mới
   */
  const handleOk = () => {
    validateFields().then(values => {
      saveData(values.donViTinh);
    }).catch(error => {
      console.log('error', error);
    });
  }

  const handleCancel = () => {
    setFieldsValue({
      'donViTinh': {
        tenDonViTinh: '',
        maDonViTinh: ''
      }
    });
    props.setVisible(false);
  }

  const saveData = (data) => {
    setLoading(true);
    // Call API
    new Promise((resolve, reject) => {
      dispatch(fetchStart('DonViTinh', 'POST', data, 'ADD', 'addDonViTinh', resolve, reject));
    }).then(res => {
      if (res.status === 201) {
        setFieldsValue({
          'donViTinh': {
            tenDonViTinh: '',
            maDonViTinh: ''
          }
        });
        // Reload donViTinh
        props.reloadList();
        props.setVisible(false);
      }
      setLoading(false);
    }).catch(error => {
      console.error(error);
      setLoading(false);
    });
  }

  return (
    <Modal
      visible={props.visible}
      title={`Thêm đơn vị tính`}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={`Thêm`}
      cancelText={`Hủy`}
      closable={false}
      maskClosable={false}
      okButtonProps={{disabled: fieldTouch}}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Thoát
        </Button>,
        <Button key="submit" type="primary" loading={loading} htmlType="submit" onClick={handleOk}>
          Lưu
        </Button>
      ]}
    >
      <Form
        {...DEFAULT_FORM_STYLE}
        form={form}
        name="modal-add-donViTinh-control"
        onFinish={handleOk}
        onFieldsChange={() => setFieldTouch(true)}
      >
        <FormItem
          label="Mã đơn vị tính"
          name={['donViTinh', 'maDonViTinh']}
          rules={
            [{
              type: 'string',
              required: true,
              whitespace: true,
              max: 250,
            }]
          }
          initialValue={maDonViTinh}
        >
          <Input
            className='input-item'
            placeholder='Nhập Mã đơn vị tính'
          />
        </FormItem>
        <FormItem
          label="Tên đơn vị tính"
          name={['donViTinh', 'tenDonViTinh']}
          rules={[{
            type: 'string',
            required: true,
            whitespace: true,
            max: 250
          }]}
          initialValue={tenDonViTinh}
        >
          <Input
            className='input-item'
            placeholder='Nhập Tên đơn vị tính'
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

ModalAddDonViTinh.defaultProps = {
  visible: false
}

ModalAddDonViTinh.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  reloadList: PropTypes.func.isRequired
};

export default ModalAddDonViTinh;
