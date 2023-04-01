import React, {useState} from "react";
import {Modal, Form, Button} from "antd";
import PropTypes from "prop-types";
import {useDispatch} from 'react-redux';

import {fetchStart} from 'src/appRedux/actions/Common';
import {DEFAULT_FORM_STYLE} from 'src/constants/Config';
import {Input} from "src/components/Common";

const FormItem = Form.Item;

const initState = {
  maLoaiVatTu: '',
  tenLoaiVatTu: ''
};

function ModalAddLoaiVatTu(props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fieldTouch, setFieldTouch] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setFieldsValue, validateFields} = form;

  const {maLoaiVatTu, tenLoaiVatTu} = initState;

  /**
   * Hành động thêm mới
   */
  const handleOk = () => {
    validateFields().then(values => {
      saveData(values.loaiVatTu);
    }).catch(error => {
      console.log('error', error);
    });
  }

  const handleCancel = () => {
    setFieldsValue({
      'loaiVatTu': {
        tenLoaiVatTu: '',
        maLoaiVatTu: ''
      }
    });
    props.setVisible(false);
  }

  const saveData = (data) => {
    setLoading(true);
    // Call API
    new Promise((resolve, reject) => {
      dispatch(fetchStart('LoaiVatTu', 'POST', data, 'ADD', 'addLoaiVatTu', resolve, reject));
    }).then(res => {
      if (res.status === 201) {
        setFieldsValue({
          'loaiVatTu': {
            tenLoaiVatTu: '',
            maLoaiVatTu: ''
          }
        });
        // Reload loaiVatTu
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
      title={`Thêm loại vật tư`}
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
        name="modal-add-loaiVatTu-control"
        onFinish={handleOk}
        onFieldsChange={() => setFieldTouch(true)}
      >
        <FormItem
          label="Mã loại vật tư"
          name={['loaiVatTu', 'maLoaiVatTu']}
          rules={
            [{
              type: 'string',
              required: true,
              whitespace: true,
              max: 250,
            }]
          }
          initialValue={maLoaiVatTu}
        >
          <Input
            className='input-item'
            placeholder='Nhập Mã loại vật tư'
          />
        </FormItem>
        <FormItem
          label="Tên loại vật tư"
          name={['loaiVatTu', 'tenLoaiVatTu']}
          rules={[{
            type: 'string',
            required: true,
            whitespace: true,
            max: 250
          }]}
          initialValue={tenLoaiVatTu}
        >
          <Input
            className='input-item'
            placeholder='Nhập Tên loại vật tư'
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

ModalAddLoaiVatTu.defaultProps = {
  visible: false
}

ModalAddLoaiVatTu.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  reloadList: PropTypes.func.isRequired
};

export default ModalAddLoaiVatTu;
