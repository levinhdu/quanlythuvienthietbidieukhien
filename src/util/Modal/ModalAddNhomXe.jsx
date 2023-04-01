import React, {useState} from "react";
import {Modal, Form, Button} from "antd";
import PropTypes from "prop-types";
import {useDispatch} from 'react-redux';

import {fetchStart} from 'src/appRedux/actions/Common';
import {DEFAULT_FORM_STYLE} from 'src/constants/Config';
import {Input} from "src/components/Common";

const FormItem = Form.Item;

const initState = {
  maNhomXe: '',
  tenNhomXe: ''
};

function ModalAddNhomXe(props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fieldTouch, setFieldTouch] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setFieldsValue, validateFields} = form;

  const {maNhomXe, tenNhomXe} = initState;

  /**
   * Hành động thêm mới
   */
  const handleOk = () => {
    validateFields().then(values => {
      saveData(values.nhomXe);
    }).catch(error => {
      console.log('error', error);
    });
  }

  const handleCancel = () => {
    setFieldsValue({
      'nhomXe': {
        tenNhomXe: '',
        maNhomXe: ''
      }
    });
    props.setVisible(false);
  }

  const saveData = (data) => {
    setLoading(true);
    // Call API
    new Promise((resolve, reject) => {
      dispatch(fetchStart('NhomXe', 'POST', data, 'ADD', 'addNhomXe', resolve, reject));
    }).then(res => {
      if (res.status === 201) {
        setFieldsValue({
          'nhomXe': {
            tenNhomXe: '',
            maNhomXe: ''
          }
        });
        // Reload nhomXe
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
      title={`Thêm nhóm xe`}
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
        name="modal-add-nhomXe-control"
        onFinish={handleOk}
        onFieldsChange={() => setFieldTouch(true)}
      >
        <FormItem
          label="Mã nhóm xe"
          name={['nhomXe', 'maNhomXe']}
          rules={
            [{
              type: 'string',
              required: true,
              whitespace: true,
              max: 250,
            }]
          }
          initialValue={maNhomXe}
        >
          <Input
            className='input-item'
            placeholder='Nhập Mã nhóm xe'
          />
        </FormItem>
        <FormItem
          label="Tên nhóm xe"
          name={['nhomXe', 'tenNhomXe']}
          rules={[{
            type: 'string',
            required: true,
            whitespace: true,
            max: 250
          }]}
          initialValue={tenNhomXe}
        >
          <Input
            className='input-item'
            placeholder='Nhập Tên nhóm xe'
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

ModalAddNhomXe.defaultProps = {
  visible: false
}

ModalAddNhomXe.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  reloadList: PropTypes.func.isRequired
};

export default ModalAddNhomXe;
