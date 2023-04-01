import React from "react";
import { Modal } from 'antd';
import PropType from "prop-types";

/**
 * Hiển thị hình ảnh preview
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ModalPreviewImageVatTu(props) {
  return(
    <Modal visible={props.visible} footer={null} onCancel={props.modalClose}>
      <img alt="Ảnh sản phẩm" style={{ width: '100%' }} src={props.image} />
    </Modal>
  )
}

ModalPreviewImageVatTu.defaultProps = {
  visible: false
}

ModalPreviewImageVatTu.propTypes = {
  visible: PropType.bool.isRequired,
  modalClose: PropType.func.isRequired,
  image: PropType.string.isRequired
}

export default ModalPreviewImageVatTu;
