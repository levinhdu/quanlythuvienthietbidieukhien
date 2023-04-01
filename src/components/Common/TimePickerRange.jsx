import React from 'react';
import { TimePicker } from 'antd';
import PropTypes from 'prop-types';

const { RangePicker } = TimePicker;

function TimePickerRange(props) {
  return(
    <RangePicker
      {...props}
      allowClear
      bordered
      style={{ width: '100%' }}
    />
  )
}

TimePickerRange.defaultProps = {
  format: 'HH:mm'
}

TimePickerRange.propTypes = {
  onChange: PropTypes.func,
}

export default TimePickerRange;
