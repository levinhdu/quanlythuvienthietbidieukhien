import React, { PureComponent } from 'react';
import {
  Upload,
  Form
} from 'antd';
import { messages } from 'src/constants/messages';
import Helpers from 'src/helpers';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { join } from 'lodash';
import { CloseOutlined, CloudUploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const FormItem = Form.Item;

class UploadFileDinhKem extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || []),
        fileList: nextProps.value
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || [];
    this.state = {
      fileList: value || [],
      formStatus: {
        validateStatus: undefined,
        help: undefined
      },
      previewImage: value.length ? value[0] : undefined
    };
  }

  getUrlPreview(file) {
    if (window.FileReader) {
      const reader = new window.FileReader();
      const self = this;
      reader.readAsDataURL(file);
      reader.onload = (r) => {
        self.setState({
          previewImage: r.target.result
        });
      };
    }
  }

  handleBeforeUpload = (fileChange, fileListChange) => {
    const {
      totalLimit,
      sizeLimit,
      typeLimit,
      messageError
    } = this.props;
    let size = 0;
    const type = [];
    const fileList = [...this.state.fileList];
    const changedValue = this.props.multiple ? [...fileList.concat(fileListChange)] : [fileChange];
    changedValue.forEach((item) => {
      const result = item;
      if (result.size) {
        size += parseInt(result.size, 10);
      }
      return result;
    });

    fileListChange.forEach((item) => {
      const itemType = item.name.split('.').pop();
      if (itemType && type.indexOf(itemType) === -1) {
        type.push(itemType);
      }
    });

    if (totalLimit && changedValue.length > totalLimit) {
      this.setState({
        formStatus: {
          validateStatus: 'error',
          help: messageError || messages.ERROR_UPLOAD_MAX_FILE.replace('{value}', totalLimit)
        }
      });
      return false;
    }

    if (sizeLimit && size / 1024 / 1024 > sizeLimit) {
      this.setState({
        formStatus: {
          validateStatus: 'error',
          help: messageError || messages.ERROR_UPLOAD_MAX_SIZE.replace('{value}', sizeLimit)
        }
      });
      return false;
    }

    if (typeLimit) {
      let typeCheck;
      type.forEach((item) => {
        if (Object.keys(typeLimit).indexOf(item.toLowerCase()) === -1) {
          typeCheck = true;
        }
      });
      if (typeCheck) {
        this.setState({
          formStatus: {
            validateStatus: 'error',
            help: (messageError || messages.ERROR_UPLOAD_FILE_TYPE).replace('{value}', this.fileExtension(typeLimit))
          }
        });
        return false;
      }
    }

    this.triggerChange(changedValue);
    return false;
  }

  triggerChange = (changedValue) => {
    const {
      onChange,
      previewAvatar
    } = this.props;
    if (previewAvatar) {
      this.getUrlPreview(changedValue[0]);
    }
    if (onChange) {
      onChange(changedValue);
    }
    this.setState({
      fileList: changedValue,
      formStatus: {
        validateStatus: '',
        help: ''
      }
    });
  }

  fileExtension = (typeLimit) => {
    const listType = [];
    Object.keys(typeLimit).forEach((item) => {
      listType.push(`.${item}`);
    });
    return join(listType, ', ');
  }

  defaultTemplete = typeLimit => (
    <div className="upload-dragger">
      <p className="ant-upload-drag-icon">
        <CloudUploadOutlined />
      </p>
      <p className="ant-upload-text">
        Nhấp hoặc kéo và thả tệp để tải lên tại đây
      </p>
      <p className="ant-upload-hint">
        Hỗ trợ loại file: {this.fileExtension(typeLimit)}
      </p>
    </div>
  )

  remove = (e, index) => {
    e.preventDefault();
    const { fileList } = this.state;
    const newValue = [...fileList];
    newValue.splice(index, 1);
    this.triggerChange(newValue);
  }

  render() {
    const {
      fileList,
      formStatus,
      previewImage
    } = this.state;
    const {
      previewAvatar,
      typeLimit
    } = this.props;
    const uploadButton = this.props.children ? this.props.children : this.defaultTemplete(typeLimit);
    const UploadCus = this.props.dragger ? Dragger : Upload;
    return (
      <React.Fragment>
        <FormItem
          className="mb0"
          help={formStatus.help}
          validateStatus={formStatus.validateStatus}
        >
          <UploadCus
            beforeUpload={this.handleBeforeUpload}
            className={this.props.className}
            multiple={this.props.multiple}
            showUploadList={false}
          >
            {!previewAvatar && uploadButton}
            {
              previewAvatar && (
                previewImage ? (
                  <div
                    className={classnames('avatar-custom', {
                      'avatar-custom-has-background': previewImage
                    })}
                    style={{ backgroundImage: `url(${previewImage})` }}
                  >
                    <div className="avatar-uploaded">{uploadButton}</div>
                  </div>
                ) : (
                  uploadButton
                )
              )
            }
          </UploadCus>
        </FormItem>
        {this.props.showUploadList && (
          <div className="upload-file-list mt10">
            {
              fileList && fileList.map((item, index) => (
                <div key={index} className="view-file">
                  <span className={Helpers.viewTypeFile(item)}>{item.name}</span>
                  <CloseOutlined
                    onClick={e => this.remove(e, index)}
                    style={{ fontSize: '12px', marginLeft: '5px' }}
                  />
                </div>
              ))
            }
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default UploadFileDinhKem;

UploadFileDinhKem.propTypes = {
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.any,
  totalLimit: PropTypes.number,
  typeLimit: PropTypes.objectOf(PropTypes.any),
  sizeLimit: PropTypes.number,
  messageError: PropTypes.string,
  multiple: PropTypes.any,
  onChange: PropTypes.func,
  previewAvatar: PropTypes.any,
  children: PropTypes.any,
  dragger: PropTypes.any,
  showUploadList: PropTypes.any,
  className: PropTypes.string
};

UploadFileDinhKem.defaultProps = {
  totalLimit: 0,
  typeLimit: null,
  sizeLimit: 0,
  messageError: null,
  multiple: null,
  onChange: null,
  previewAvatar: '',
  children: null,
  dragger: false,
  showUploadList: false,
  className: ''
};
