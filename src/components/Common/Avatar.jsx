import React from 'react';
import PropTypes from 'prop-types';
import { Avatar as AvatarAnt } from 'antd';

export default function Avatar(props) {
  return (
    <AvatarAnt {...props} />
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string.isRequired,
  src: PropTypes.string,
  size: PropTypes.number.isRequired
};

Avatar.defaultProps = {
  className: '',
  src: ''
};
