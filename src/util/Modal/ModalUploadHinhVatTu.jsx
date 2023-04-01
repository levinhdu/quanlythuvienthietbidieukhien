import React from "react";
import { Modal, Button, Upload } from 'antd';
import PropType from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import {BASE_URL_API} from "src/constants/Config";
import {getTokenInfo} from "src/util/Common";

function ModalUploadHinhVatTu(props) {
  const token = getTokenInfo().token;
  return (
    <Modal
      title="Upload ảnh"
      visible={props.visible}
      onCancel={() => props.openModal(false)}
      footer={[
        <Button key="back" onClick={() => props.openModal(false)}>
          Thoát
        </Button>
      ]}
    >
      <Upload
        name="file"
        accept="image/*"
        headers={{
          authorization: `Bearer ${token}`
        }}
        action={`${BASE_URL_API}/api/Upload`}
        listType="picture-card"
        fileList={props.fileList}
        onPreview={props.onPreview}
        onChange={props.onChange}
        onRemove={props.onRemove}
      >
        {props.fileList.length === 0 &&
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
        }
      </Upload>
    </Modal>
  )
}

ModalUploadHinhVatTu.defaultProps = {
  visible: false
}

ModalUploadHinhVatTu.propTypes = {
  visible: PropType.bool.isRequired,
  fileList: PropType.array.isRequired,
  openModal: PropType.func.isRequired,
  onPreview: PropType.func.isRequired,
  onChange: PropType.func.isRequired,
  onRemove: PropType.func.isRequired
}

export default ModalUploadHinhVatTu;
