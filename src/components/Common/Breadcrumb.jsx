import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';

export default function breadcrumb(props) {
  const { dataBreadcrumb } = props;
  return (
    <Breadcrumb className="breadcrumb-container" {...props}>
      {dataBreadcrumb && dataBreadcrumb.map((item, i) => (
        <Breadcrumb.Item key={i}>
          <span
            className={props.dataBreadcrumb.length === i + 1 ? 'active' : ''}
            onClick={() => props.handleClick(item.donViId, i)}
          >
            {item.name}
          </span>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

breadcrumb.propTypes = {
  dataBreadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func.isRequired
};

breadcrumb.displayName = 'Breadcrumb';
