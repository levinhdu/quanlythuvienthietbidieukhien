import React from 'react';
import PropTypes from 'prop-types';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function Back({ title, func }) {
  return (
    <div className="th-card-header-title">
      <ArrowLeftOutlined style={{ marginRight: 10 }} onClick={func} />
      <h4 style={{ marginBottom: 0 }}>{title}</h4>
    </div>
  );
}

Back.propTypes = {
  func: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
