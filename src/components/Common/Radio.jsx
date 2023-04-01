import React from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default function radio(props) {
  if (props.type === 'radioGroup') {
    return (
      <RadioGroup {...props}>
        {props.data.map(item => (
          <Radio
            key={item.value}
            value={item.value}
          >
            {item.name}
          </Radio>
        ))}
      </RadioGroup>
    );
  }
  if (props.type === 'buttonRadioGroup') {
    return (
      <RadioGroup {...props}>
        {props.data.map(item => (
          <RadioButton
            key={item.value}
            value={item.value}
          >
            {item.name}
          </RadioButton>
        ))}
      </RadioGroup>
    );
  }
  return (
    <Radio {...props}>{props.children}</Radio>
  );
}

radio.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element
  ]),
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  type: PropTypes.string
};

radio.defaultProps = {
  children: null,
  value: undefined,
  checked: false,
  className: '',
  data: [],
  type: ''
};

radio.displayName = 'Radio';
