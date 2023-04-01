import React, { PureComponent } from 'react';
import {
  Upload,
  Form
} from 'antd';
import { messages } from 'src/constants/messages';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { join } from 'lodash';
import { CloudUploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const FormItem = Form.Item;

class UploadImage extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      formStatus: {
        validateStatus: undefined,
        help: undefined
      },
      previewImage: value || undefined
    };
  }

  getUrlPreview(file, callback) {
    if (window.FileReader) {
      const reader = new window.FileReader();
      const self = this;
      reader.readAsDataURL(file);
      reader.onload = function onReader(r) {
        self.setState({
          previewImage: r.target.result
        });
        if (callback) {
          callback(r.target.result);
        }
      };
    }
  }

  handleBeforeUpload = (fileChange) => {
    const {
      sizeLimit,
      typeLimit
    } = this.props;
    const size = parseInt(fileChange.size, 10);
    const { type } = fileChange;

    if (sizeLimit && size / 1024 / 1024 > sizeLimit) {
      this.setState({
        formStatus: {
          validateStatus: 'error',
          help: messages.ERROR_UPLOAD_MAX_SIZE.replace('{value}', sizeLimit)
        }
      });
      return false;
    }

    if (typeLimit) {
      if (Object.values(typeLimit).indexOf(type) === -1) {
        this.setState({
          formStatus: {
            validateStatus: 'error',
            help: messages.ERROR_UPLOAD_TYPE
          }
        });
        return false;
      }
    }

    this.triggerChange(fileChange);
    return false;
  }

  triggerChange = (changedValue) => {
    const {
      onChange
    } = this.props;
    this.getUrlPreview(changedValue, (data) => {
      if (onChange) {
        onChange(data);
      }
    });
    this.setState({
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
        Hỗ trợ loại file: { this.fileExtension(typeLimit) }
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
      <div
        className={classnames('uploader-wrapper', {
          'has-preview': previewAvatar
        })}
      >
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
                    className="upload-preivew"
                    style={{ backgroundImage: `url(${previewImage})` }}
                  >
                    {uploadButton}
                  </div>
                ) : (
                  uploadButton
                )
              )
            }
          </UploadCus>
        </FormItem>
      </div>
    );
  }
}

UploadImage.defaultProps = {
  onChange: () => {},
  sizeLimit: undefined,
  typeLimit: undefined,
  previewAvatar: '',
  children: undefined,
  dragger: undefined,
  multiple: undefined,
  className: ''
};

UploadImage.propTypes = {
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.any,
  onChange: PropTypes.func,
  sizeLimit: PropTypes.number,
  typeLimit: PropTypes.objectOf(PropTypes.any),
  previewAvatar: PropTypes.bool,
  children: PropTypes.any,
  dragger: PropTypes.bool,
  multiple: PropTypes.bool,
  className: PropTypes.string
};

export default UploadImage;
