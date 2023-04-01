import React from 'react';
import { Dropdown } from 'antd';
import PropTypes from 'prop-types';

export default function dropdown(props) {
  const { children } = props;
  return (
    <Dropdown {...props}>
      {children}
    </Dropdown>
  );
}
dropdown.defaultProps = {
  children: ''
};
dropdown.propTypes = {
  children: PropTypes.objectOf(PropTypes.any)
};

dropdown.displayName = 'Dropdown';
