import React, {useState} from "react";
import {Modal, Form, Button} from "antd";
import PropTypes from "prop-types";
import {useDispatch} from 'react-redux';

import {fetchStart} from 'src/appRedux/actions/Common';
import {DEFAULT_FORM_STYLE} from 'src/constants/Config';
import {Input} from "src/components/Common";

const FormItem = Form.Item;

const initState = {
  maNhomVatTu: '',
  tenNhomVatTu: ''
};

function ModalAddNhomVatTu(props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fieldTouch, setFieldTouch] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setFieldsValue, validateFields} = form;

  const {maNhomVatTu, tenNhomVatTu} = initState;

  /**
   * Hành động thêm mới
   */
  const handleOk = () => {
    validateFields().then(values => {
      saveData(values.nhomVatTu);
    }).catch(error => {
      console.log('error', error);
    });
  }

  const handleCancel = () => {
    setFieldsValue({
      'nhomVatTu': {
        tenNhomVatTu: '',
        maNhomVatTu: ''
      }
    });
    props.setVisible(false);
  }

  const saveData = (data) => {
    setLoading(true);
    // Call API
    new Promise((resolve, reject) => {
      dispatch(fetchStart('NhomVatTu', 'POST', data, 'ADD', 'addNhomVatTu', resolve, reject));
    }).then(res => {
      if (res.status === 201) {
        setFieldsValue({
          'nhomVatTu': {
            tenNhomVatTu: '',
            maNhomVatTu: ''
          }
        });
        // Reload nhomVatTu
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
      title={`Thêm nhóm vật tư`}
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
        name="modal-add-nhomVatTu-control"
        onFinish={handleOk}
        onFieldsChange={() => setFieldTouch(true)}
      >
        <FormItem
          label="Mã nhóm vật tư"
          name={['nhomVatTu', 'maNhomVatTu']}
          rules={
            [{
              type: 'string',
              required: true,
              whitespace: true,
              max: 250,
            }]
          }
          initialValue={maNhomVatTu}
        >
          <Input
            className='input-item'
            placeholder='Nhập Mã nhóm vật tư'
          />
        </FormItem>
        <FormItem
          label="Tên nhóm vật tư"
          name={['nhomVatTu', 'tenNhomVatTu']}
          rules={[{
            type: 'string',
            required: true,
            whitespace: true,
            max: 250
          }]}
          initialValue={tenNhomVatTu}
        >
          <Input
            className='input-item'
            placeholder='Nhập Tên nhóm vật tư'
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

ModalAddNhomVatTu.defaultProps = {
  visible: false
}

ModalAddNhomVatTu.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  reloadList: PropTypes.func.isRequired
};

export default ModalAddNhomVatTu;
