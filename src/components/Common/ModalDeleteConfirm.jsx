import { Modal } from 'antd';
import { messages } from 'src/constants/Messages';

/**
 * Xóa item
 *
 * @param {*} deleteAction Hàm xóa item
 * @param {*} id item
 * @returns
 */
function ModalDeleteConfirm(deleteAction, item) {
  Modal.confirm({
    title: messages.MODAL_DELETE_TITLE,
    content: messages.MODAL_DELETE_CONTENT,
    onOk(e) {
      e();
      deleteAction(item)
    },
    okText: messages.MODAL_CONFIRM_OK,
    onCancel() { },
    cancelText: messages.MODAL_CONFIRM_CANCEL
  });
}

export default ModalDeleteConfirm;

