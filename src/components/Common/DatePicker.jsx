import React, { PureComponent } from 'react';
import { DatePicker as DatePickAnt } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helpers from 'src/helpers';
import { isFunction, isEmpty } from 'lodash';
import variables from 'src/constants/variables';

export default class DatePicker extends PureComponent {
  /**
   * Specify the date that cannot be selected
   * @param {moment} date the date
   * @returns {boolean} isDisabled
   * @memberof DatePicker
   */
  disabledDate = (date) => {
    const {
      disabledDate,
      disabledDateData
    } = this.props;
    if (isFunction(disabledDate)) {
      return disabledDate(date);
    }
    let isAfter = false;
    let isBefore = false;
    // disabled all times which are > disabledDateData.after
    const afterDate = Helpers.get(disabledDateData, 'after');
    if (Helpers.isValidDateTime(afterDate)) {
      const afterParam = {
        after: {
          value: afterDate,
          format: variables.DATE_FORMAT.DATE
        }
      };
      isAfter = Helpers.isValidDateTime(date, afterParam);
    }
    const beforeDate = Helpers.get(disabledDateData, 'before');
    // disabled all times which are < disabledDateData.before
    if (Helpers.isValidDateTime(beforeDate)) {
      const beforeParam = {
        before: {
          value: beforeDate,
          format: variables.DATE_FORMAT.DATE
        }
      };
      isBefore = Helpers.isValidDateTime(date, beforeParam);
    }
    return isAfter || isBefore;
  };

  /**
   * Specify the time that cannot be selected
   * @param {moment} date the date
   * @returns {object} define disabled time data
   * @memberof DatePicker
   */
  disabledTime = (date) => {
    const {
      disabledTime,
      disabledDateData
    } = this.props;
    if (isFunction(disabledTime)) {
      return disabledTime(date);
    }
    // disabled all times which are > disabledDateData.after
    const afterDate = Helpers.get(disabledDateData, 'after');
    if (Helpers.isValidDateTime(afterDate)) {
      const isSameDate = Helpers.isValidDateTime(date, {
        same: { value: afterDate }
      });
      if (isSameDate) {
        return Helpers.disableTimeData({ afterDate, current: date });
      }
    }
    const beforeDate = Helpers.get(disabledDateData, 'before');
    // disabled all times which are < disabledDateData.before
    if (Helpers.isValidDateTime(beforeDate)) {
      const isSameDate = Helpers.isValidDateTime(date, {
        same: { value: beforeDate }
      });
      if (isSameDate) {
        return Helpers.disableTimeData({ beforeDate, current: date });
      }
    }
    // default: enable all times
    return false;
  };

  /**
   * A callback function, can be executed when the selected date is changing
   * @param {moment} value the date
   * @returns {void} call the props.onChange to change the date
   * @memberof DatePicker
   */
  onChange = (value) => {
    if (!isFunction(this.props.onChange)) {
      return false;
    }
    let newValue = value;
    const afterDate = Helpers.get(this.props.disabledDateData, 'after');
    const beforeDate = Helpers.get(this.props.disabledDateData, 'before');
    if (!isEmpty(newValue) && !isEmpty(afterDate)) {
      // kiểm tra value trùng ngày với afterDate
      const isSameDate = Helpers.isValidDateTime(newValue, {
        same: { value: afterDate }
      });
      // kiểm tra giờ của value lớn hơn giờ của afterDate
      const isGreaterThanAfterTime = Helpers.isValidDateTime(newValue, {
        after: { value: afterDate, format: variables.DATE_FORMAT.TIME }
      });
      if (isSameDate && isGreaterThanAfterTime) {
        newValue = Helpers.getDateTime({ value: afterDate, isString: false }) || undefined;
      }
      return this.props.onChange(newValue);
    }
    if (!isEmpty(newValue) && !isEmpty(beforeDate)) {
      // kiểm tra value trùng ngày với beforeDate
      const isSameDate = Helpers.isValidDateTime(newValue, {
        same: { value: beforeDate }
      });
      // kiểm tra giờ của value nhỏ hơn giờ của beforeDate
      const isSmallerThanBeforeTime = Helpers.isValidDateTime(newValue, {
        before: { value: beforeDate, format: variables.DATE_FORMAT.TIME }
      });
      if (isSameDate && isSmallerThanBeforeTime) {
        newValue = Helpers.getDateTime({ value: beforeDate, isString: false }) || undefined;
      }
    }
    return this.props.onChange(newValue);
  }

  render() {
    return (
      <DatePickAnt
        allowClear={this.props.allowClear}
        className={this.props.className}
        disabledDate={this.disabledDate}
        disabledTime={this.disabledTime}
        format={this.props.format}
        name={this.props.name}
        onBlur={this.props.onBlur}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
        showTime={this.props.showTime}
        showToday={this.props.showToday}
        style={{ width: '100%' }}
        suffixIcon={<span className="icon-calendar-fill" />}
        value={this.props.value}
        picker={this.props.picker}
        disabled={this.props.disabled}
        open={this.props.open}
      />
    );
  }
}

DatePicker.propTypes = {
  picker: PropTypes.oneOf(['week', 'month', 'quarter', 'year']),
  className: PropTypes.string,
  disabledDate: PropTypes.func,
  disabledTime: PropTypes.func,
  format: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  showTime: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  showToday: PropTypes.bool,
  disabledDateData: PropTypes.shape({
    before: PropTypes.oneOfType([
      PropTypes.instanceOf(moment),
      PropTypes.string
    ]),
    after: PropTypes.oneOfType([
      PropTypes.instanceOf(moment),
      PropTypes.string
    ])
  }),
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.string
  ]),
};

DatePicker.defaultProps = {
  className: '',
  disabledDate: null,
  disabledTime: null,
  disabled: false,
  format: 'HH:mm DD/MM/YYYY',
  name: '',
  onBlur: null,
  onChange: null,
  placeholder: '',
  showTime: {
    defaultValue: moment('00:00', 'HH:mm'),
    format: 'HH:mm'
  },
  showToday: false,
  disabledDateData: {
    before: null,
    after: null
  }
};
