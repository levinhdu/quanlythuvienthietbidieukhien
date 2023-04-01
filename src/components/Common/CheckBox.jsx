import React, { PureComponent } from 'react';
import { Checkbox as CheckboxAnt } from 'antd';
import PropTypes from 'prop-types';

const CheckboxGroup = CheckboxAnt.Group;
export default class CheckBox extends PureComponent {
  render() {
    if (this.props.category === 'group') {
      return (
        <CheckboxGroup size="large" {...this.props}>
          {this.props.children}
        </CheckboxGroup>
      );
    }
    return (
      <CheckboxAnt size="large" {...this.props}>
        {this.props.children}
      </CheckboxAnt>
    );
  }
}

CheckBox.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element
  ]),
  category: PropTypes.string
};

CheckBox.defaultProps = {
  className: undefined,
  onChange: null,
  children: undefined,
  category: ''
};
