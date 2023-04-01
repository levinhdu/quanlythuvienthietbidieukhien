import React, { PureComponent } from 'react';
import { Switch } from 'antd';
import PropTypes from 'prop-types';

export default class switchs extends PureComponent {
  render() {
    return (<Switch {...this.props} />);
  }
}

switchs.propTypes = {
  defaultChecked: PropTypes.bool,
  className: PropTypes.string,
  checkedChildren: PropTypes.string,
  unCheckedChildren: PropTypes.string
};

switchs.defaultProps = {
  defaultChecked: false,
  className: '',
  checkedChildren: '',
  unCheckedChildren: ''
};
