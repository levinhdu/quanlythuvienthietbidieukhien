import React from 'react';
import PropTypes from 'prop-types';
import { Button as BtnAnt } from 'antd';

export default function Button(props) {
  const { children } = props;
  return (
    <BtnAnt {...props}>
      {children}
    </BtnAnt>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element
  ]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'link', 'text', 'default']),
  icon: PropTypes.element
};

Button.defaultProps = {
  className: '',
  onClick: null,
  children: '',
  loading: false,
  disabled: false
};
