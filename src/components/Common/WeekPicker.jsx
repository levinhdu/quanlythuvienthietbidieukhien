import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';

function WeekPicker(props) {
  return(
    <DatePicker
      {...props}
      format={`W-YYYY`}
      onChange={props.onChange}
      picker="week"
    />
  )
}

WeekPicker.defaultProps = {
  onChange: PropTypes.func
}

export default WeekPicker;
