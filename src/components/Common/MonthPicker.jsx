import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const AntMonthPicker = DatePicker.MonthPicker;

class MonthPicker extends React.Component {
  render() {
    return (
      <AntMonthPicker
        allowClear={false}
        {...this.props}
      />
    )
  }
}

MonthPicker.defaultProps = {
  className: '',
  format: 'MM/YYYY',
  name: '',
  onBlur: null,
  onChange: null
}

DatePicker.propTypes = {
  className: PropTypes.string,
  format: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.string
  ])
};

export default MonthPicker;


