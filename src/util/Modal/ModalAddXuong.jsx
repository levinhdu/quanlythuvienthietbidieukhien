import React, {useState} from "react";
import {Modal, Form, Button} from "antd";
import PropTypes from "prop-types";
import {useDispatch} from 'react-redux';

import {fetchStart} from 'src/appRedux/actions/Common';
import {DEFAULT_FORM_STYLE} from 'src/constants/Config';
import {Input} from "src/components/Common";

const FormItem = Form.Item;

const initState = {
  maXuong: '',
  tenXuong: ''
};

function ModalAddXuong(props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fieldTouch, setFieldTouch] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setFieldsValue, validateFields} = form;

  const {maXuong, tenXuong} = initState;

  /**
   * Hành động thêm mới
   */
  const handleOk = () => {
    validateFields().then(values => {
      saveData(values.xuong);
    }).catch(error => {
      console.log('error', error);
    });
  }

  const handleCancel = () => {
    setFieldsValue({
      'xuong': {
        tenXuong: '',
        maXuong: ''
      }
    });
    props.setVisible(false);
  }

  const saveData = (data) => {
    setLoading(true);
    // Call API
    new Promise((resolve, reject) => {
      dispatch(fetchStart('Xuong', 'POST', data, 'ADD', 'addXuong', resolve, reject));
    }).then(res => {
      if (res.status === 201) {
        setFieldsValue({
          'xuong': {
            tenXuong: '',
            maXuong: ''
          }
        });
        // Reload xuong
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
      title={`Thêm xưởng`}
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
        name="modal-add-xuong-control"
        onFinish={handleOk}
        onFieldsChange={() => setFieldTouch(true)}
      >
        <FormItem
          label="Mã xưởng"
          name={['xuong', 'maXuong']}
          rules={
            [{
              type: 'string',
              required: true,
              whitespace: true,
              max: 250,
            }]
          }
          initialValue={maXuong}
        >
          <Input
            className='input-item'
            placeholder='Nhập Mã xưởng'
          />
        </FormItem>
        <FormItem
          label="Tên xưởng"
          name={['xuong', 'tenXuong']}
          rules={[{
            type: 'string',
            required: true,
            whitespace: true,
            max: 250
          }]}
          initialValue={tenXuong}
        >
          <Input
            className='input-item'
            placeholder='Nhập Tên xưởng'
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

ModalAddXuong.defaultProps = {
  visible: false
}

ModalAddXuong.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  reloadList: PropTypes.func.isRequired
};

export default ModalAddXuong;
