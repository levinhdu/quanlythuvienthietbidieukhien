import React from 'react';
import PropTypes from 'prop-types';
import { Upload } from 'antd';

const { Dragger } = Upload;

export default function upload(props) {
  return (
    <React.Fragment>
      {!props.dragger && (
        <Upload {...props}>
          {props.children}
        </Upload>
      )}

      {props.dragger && (
        <Dragger {...props}>
          {props.children}
        </Dragger>
      )}
    </React.Fragment>
  );
}

upload.propTypes = {
  dragger: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element
  ]).isRequired
};

upload.defaultProps = {
  dragger: false
};

upload.displayName = 'Upload';
