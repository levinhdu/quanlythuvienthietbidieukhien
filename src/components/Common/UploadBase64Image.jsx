import React, {Fragment} from "react";
import PropTypes from 'prop-types';
import {Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import { ModalPreviewImageVatTu } from 'src/util/Modal';

import {getTokenInfo} from "src/util/Common";
import {DEFAULT_IMAGE_URL} from "src/constants/Config";

/**
 * Chuyển đổi hình thành base64 và preview hình
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function UploadBase64Image(props) {
  const {fileList, onPreview, onChange, onRemove, beforeUpload, previewImage, visiblePreviewModal, previewModalClose} = props;
  const token = getTokenInfo().token;
  return (
    <Fragment>
      <Upload
        name="file"
        accept="image/*"
        headers={{
          authorization: `Bearer ${token}`
        }}
        listType="picture-card"
        fileList={fileList}
        onPreview={onPreview}
        onChange={onChange}
        onRemove={onRemove}
        beforeUpload={beforeUpload}
      >
        {fileList.length < 1 &&
        <div>
          <PlusOutlined/>
          <div className="ant-upload-text">Upload</div>
        </div>
        }
      </Upload>
      <ModalPreviewImageVatTu
        image={previewImage}
        visible={visiblePreviewModal}
        modalClose={previewModalClose}
      />
    </Fragment>
  )
}

UploadBase64Image.defaultProps = {
  count: 1,
  fileList: [],
  previewImage: DEFAULT_IMAGE_URL,
  visiblePreviewModal: false
}

UploadBase64Image.propTypes = {
  count: PropTypes.number,
  fileList: PropTypes.array.isRequired,
  onPreview: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  visiblePreviewModal: PropTypes.bool.isRequired,
  previewModalClose: PropTypes.func.isRequired
}

export default UploadBase64Image;
