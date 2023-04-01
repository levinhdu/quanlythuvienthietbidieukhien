import { DatePicker } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { variables } from 'src/constants/variables';
import Helpers from 'src/helpers';

export default class DatePickerRange extends Component {
  /**
   * Specify the start date that cannot be selected
   * @param {moment} startDate the start date
   * @returns {boolean} isDisabled
   * @memberof DatePickerRange
   */
  disabledStartDate = (startDate) => {
    if (this.props.disabledStartDate) {
      return this.props.disabledStartDate(startDate);
    }
    const endDate = this.props.value[this.props.fieldName.endDate];
    if (!startDate || !endDate) {
      return false;
    }
    let afterDate = endDate;
    const endHour = Helpers.getSeparateDateTime(endDate).hour;
    if (endHour === variables.DEFAULT_VALUE.START_HOUR) {
      afterDate = Helpers.setDate({
        originValue: afterDate,
        subtract: { days: 1 }
      });
    }
    const isDisabled = Helpers.isValidDateTime(startDate, {
      after: { value: afterDate }
    });

    return isDisabled;
  }

  /**
   * Specify the end date that cannot be selected
   * @param {moment} endDate the end date
   * @returns {boolean} isDisabled
   * @memberof DatePickerRange
   */
  disabledEndDate = (endDate) => {
    if (this.props.disabledEndDate) {
      return this.props.disabledEndDate(endDate);
    }
    const startDate = this.props.value[this.props.fieldName.startDate];
    if (!endDate || !startDate) {
      return false;
    }
    let beforeDate = startDate;
    const startHour = Helpers.getSeparateDateTime(startDate).hour;
    if (startHour === variables.DEFAULT_VALUE.END_HOUR) {
      beforeDate = Helpers.setDate({
        originValue: beforeDate,
        add: { days: 1 }
      });
    }
    const isDisabled = Helpers.isValidDateTime(endDate, {
      before: { value: beforeDate }
    });
    return isDisabled;
  }

  /**
   * Specify the start time that cannot be selected
   * @param {moment} startDate the start date
   * @returns {object} define disabled time data
   * @memberof DatePickerRange
   */
  disabledStartTime = (startDate) => {
    if (this.props.disabledStartTime) {
      return this.props.disabledStartTime(startDate);
    }
    const endDate = this.props.value[this.props.fieldName.endDate];
    const isSameDate = Helpers.isValidDateTime(startDate, {
      same: { value: endDate }
    });
    if (isSameDate) {
      return Helpers.disableTimeData({ afterDate: endDate, current: startDate });
    }
    return false;
  }

  /**
   * Specify the end time that cannot be selected
   * @param {moment} endDate the end date
   * @returns {object} define disabled time data
   * @memberof DatePickerRange
   */
  disabledEndTime = (endDate) => {
    if (this.props.disabledEndTime) {
      return this.props.disabledEndTime(endDate);
    }
    const startDate = this.props.value[this.props.fieldName.startDate];
    const isSameDate = Helpers.isValidDateTime(endDate, {
      same: { value: startDate }
    });
    if (isSameDate) {
      return Helpers.disableTimeData({ beforeDate: startDate, current: endDate });
    }
    return false;
  }

  /**
   * A callback function, can be executed when the selected start date is changing
   * @param {moment} startDate the start date
   * @returns {void}
   * @memberof DatePickerRange
   */
  onStartChange = (startDate) => {
    this.onChange(startDate, this.props.fieldName.startDate, this.props.fieldName.endDate);
  }

  /**
   * A callback function, can be executed when the selected end date is changing
   * @param {moment} endDate the end date
   * @returns {void}
   * @memberof DatePickerRange
   */
  onEndChange = (endDate) => {
    this.onChange(endDate, this.props.fieldName.endDate, this.props.fieldName.startDate);
  }

  /**
   * A callback function, can be executed when the selected date is changing
   * @param {moment} value the date
   * @param {string} originName the name of the date which is changing
   * @param {string} targetName the name of the date which is the rest of 2 dates
   * @returns {void} call the props.onChange to change the date
   * @memberof DatePickerRange
   */
  onChange = (value, originName, targetName) => {
    let newValue = value;
    const changedValue = {};
    const targetValue = this.props.value[targetName];
    if (newValue && targetValue) {
      const isSameDate = Helpers.isValidDateTime(newValue, {
        same: { value: targetValue }
      });
      const isDefaultTime = Helpers.isValidDateTime(newValue, {
        same: {
          value: moment(variables.DEFAULT_VALUE.START_TIME, variables.DATE_FORMAT.TIME),
          format: variables.DATE_FORMAT.TIME
        }
      });
      const setDateData = {
        targetValue,
        originValue: value,
        attributes: ['hour', 'minute', 'second']
      };
      if (isSameDate && isDefaultTime) {
        newValue = Helpers.setDate(setDateData);
      }
    }
    changedValue[originName] = newValue || undefined;
    this.props.onChange(changedValue);
  }

  render() {
    return (
      <React.Fragment>
        <DatePicker
          className={this.props.className}
          disabledDate={this.disabledStartDate}
          disabledTime={this.disabledStartTime}
          format={this.props.format}
          onChange={this.onStartChange}
          placeholder={this.props.placeholder.startDate}
          showTime={this.props.showTime}
          showToday={false}
          style={{ width: '49%', minWidth: 'auto' }}
          suffixIcon={<span className="icon-calendar-fill" />}
          value={this.props.value[this.props.fieldName.startDate]}
          disabled={this.props.disabled}
        />
        <DatePicker
          className={`${this.props.className} last-child-date`}
          disabledDate={this.disabledEndDate}
          disabledTime={this.disabledEndTime}
          format={this.props.format}
          onChange={this.onEndChange}
          placeholder={this.props.placeholder.endDate}
          showTime={this.props.showTime}
          showToday={false}
          style={{ width: '49%', minWidth: 'auto', paddingLeft: '10px', marginLeft: '2%' }}
          suffixIcon={<span className="icon-calendar-fill" />}
          value={this.props.value[this.props.fieldName.endDate]}
          disabled={this.props.disabled}
        />
      </React.Fragment>
    );
  }
}

DatePickerRange.propTypes = {
  fieldName: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }),
  value: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  format: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }),
  showTime: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      defaultValue: PropTypes.any,
      format: PropTypes.string
    })
  ]),
  disabledStartDate: PropTypes.func,
  disabledEndDate: PropTypes.func,
  disabledStartTime: PropTypes.func,
  disabledEndTime: PropTypes.func
};

DatePickerRange.defaultProps = {
  fieldName: {
    startDate: 'tuNgay',
    endDate: 'denNgay'
  },
  value: {},
  className: '',
  format: variables.DATE_FORMAT.DATETIME,
  placeholder: {
    startDate: 'Từ ngày',
    endDate: 'Đến ngày'
  },
  showTime: {
    defaultValue: moment(variables.DEFAULT_VALUE.START_TIME, variables.DATE_FORMAT.TIME),
    format: variables.DATE_FORMAT.TIME
  },
  disabledStartDate: null,
  disabledEndDate: null,
  disabledStartTime: null,
  disabledEndTime: null
};
