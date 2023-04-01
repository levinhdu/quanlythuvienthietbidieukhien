import { get as getLodash, isEmpty } from "lodash";
import moment from 'moment';
import { Notification } from "src/components/Common";
import { messages } from "src/constants/Messages";
import { variables } from 'src/constants/variables';

export default class Helpers {
  /**
   * Alert an success message
   * @param {string} message the success message
   * @returns {void}
   * @static
   * @memberof Helpers
   */
  static alertSuccessMessage = (message = "") => {
    Notification({
      type: "success",
      className: "notifi-success",
      message: messages.THONG_BAO,
      description: message
    });
  };

  /**
   * Alert an error message
   * @param {string} error the error message
   * @returns {void}
   * @static
   * @memberof Helpers
   */
  static alertError = (error = "") => {
    Notification({
      type: "error",
      className: "notifi-error",
      message: messages.THONG_BAO,
      description: error
    });
  };
  /**
   *
   *
   * @static
   * @param {string} [message=""]
   * @memberof Helpers
   */
  static alertWarning = (message = "") => {
    Notification({
      type: "warning",
      className: "notifi-warning",
      message: messages.THONG_BAO,
      description: message
    });
  };

  /**
   * Get value of a property in an object by a path, example: "post.user.name"
   * @param {object} obj The object to query.
   * @param {string} path The path of the property to get., like "post.user.name" or "name"
   * @param {*} defaultValue the default value
   * @returns {*} the value
   * @static
   * @memberof Helpers
   */
  static get = (obj = {}, path = '', defaultValue) => getLodash(obj, path, defaultValue)


  /**
   *Set a date and return it
   * @param {*} originValue the origin value
   * @param {*} targetValue the target value
   * @param {object} format the formats
   * @param {string} format.originValue the format of the originValue
   * @param {string} format.targetValue the format of the targetValue
   * @param {array} attributes the attributes which are set for a new value
   * @param {object} add an object data which defines input for "moment.add()" method
   * @param {object} subtract an object data which defines input for "moment.subtract()" method
   * @returns {moment} the moment instace
   * @static
   * @memberof Helpers
   */
   static setDate = ({
    originValue = null,
    targetValue = null,
    format = {
      originValue: undefined,
      targetValue: undefined
    },
    attributes = ['year', 'month', 'date'],
    add = {},
    subtract = {},
    isUTC = false
  }) => {
    if (!originValue && (!targetValue || isEmpty(add) || isEmpty(subtract))) {
      return undefined;
    }
    const formatOrigin = Helpers.get(format, 'originValue');
    const formatTarget = Helpers.get(format, 'targetValue');
    let result = formatOrigin ? moment(originValue, formatOrigin) : moment(originValue);
    if (isUTC) {
      result = result.utcOffset(0);
    }
    if (targetValue) {
      const options = {};
      attributes.forEach((attr) => {
        options[attr] = formatTarget ? moment(targetValue, formatTarget).get(attr) : moment(targetValue).get(attr);
      });
      result = result.set(options);
    }
    if (!isEmpty(add)) {
      const keys = Object.keys(add);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        result = moment(result).add(add[key], `${key}`);
      }
    }
    if (!isEmpty(subtract)) {
      const keys = Object.keys(subtract);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        result = moment(result).subtract(subtract[key], `${key}`);
      }
    }
    return result;
  }

  /**
   * Get all members of a datetime: year, month, date, hour, minute, second, millisecond
   * @param {*} value the datetime value
   * @returns {object} result
   * @static
   * @memberof Helpers
   */
  static getSeparateDateTime = value => ({
    year: moment(value).isValid() ? moment(value).get('year') : null,
    month: moment(value).isValid() ? moment(value).get('month') : null,
    date: moment(value).isValid() ? moment(value).get('date') : null,
    hour: moment(value).isValid() ? moment(value).get('hour') : null,
    minute: moment(value).isValid() ? moment(value).get('minute') : null,
    second: moment(value).isValid() ? moment(value).get('second') : null,
    millisecond: moment(value).isValid() ? moment(value).get('millisecond') : null
  })

  /**
   * Check a value is a valid datetime
   * @param {*} value
   * @param {object} options a options which defines conditions to check the valu
   * @param {string} options.format the format of the date value
   * @param {moment} options.before the before datetime
   * @param {moment} options.after the after datetime
   * @returns {boolean} isValid
   * @static
   * @memberof Helpers
   */
  static isValidDateTime = (value, options = {}) => {
    if (value === undefined) {
      return false;
    }
    const defaultFormat = variables.DATE_FORMAT.DATE;
    const format = Helpers.get(options, 'format');
    let isValid = format ? moment(value, format).isValid() : moment(value).isValid();
    const {
      same = {
        value: null,
        format: defaultFormat
      },
      before = {
        value: null,
        format: defaultFormat
      },
      after = {
        value: null,
        format: defaultFormat
      }
    } = options;
    if (same && same.value) {
      const format = same.format || defaultFormat;
      const sameDate = moment(same.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isSame(moment(sameDate, format))) {
        isValid = false;
      }
    }
    if (before && before.value) {
      const format = before.format || defaultFormat;
      const beforeDate = moment(before.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isBefore(moment(beforeDate, format))) {
        isValid = false;
      }
    }
    if (after && after.value) {
      const format = after.format || defaultFormat;
      const afterDate = moment(after.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isAfter(moment(afterDate, format))) {
        isValid = false;
      }
    }
    return isValid;
  }

  /**
   * Create a range from the start value to the end value
   * @param {number} start the start value
   * @param {number} end the end value
   * @returns {array} the range
   * @static
   * @memberof Helpers
   */
   static range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i += 1) {
      result.push(i);
    }
    return result;
  }

  /**
   * Return an object data which will be used to disabled time in DatePickerRange
   * @param {array} obj.hours the hours will be disabled
   * @param {array} obj.minutes the minutes will be disabled
   * @param {array} obj.seconds the seconds will be disabled
   * @param {moment} obj.beforeTime the before time
   * @param {moment} obj.afterTime the after time
   * @returns {object} data
   * @static
   * @memberof Helpers
   */
   static disableTimeData = ({
    hours = [],
    minutes = [],
    seconds = [],
    beforeDate = null,
    afterDate = null,
    current = null
  }) => {
    let rangeHours = hours;
    let rangeMinutes = minutes;
    const rangeSeconds = seconds;
    if (beforeDate && current) {
      const objectBeforeDate = Helpers.getSeparateDateTime(beforeDate);
      rangeHours = [...rangeHours, ...Helpers.range(variables.DEFAULT_VALUE.START_HOUR, objectBeforeDate.hour - 1)];
      if (moment(current).get('hour') === objectBeforeDate.hour) {
        rangeMinutes = [
          ...rangeMinutes,
          ...Helpers.range(variables.DEFAULT_VALUE.START_MINUTE, objectBeforeDate.minute - 1)
        ];
      }
    }
    if (afterDate && current) {
      const objectAfterDate = Helpers.getSeparateDateTime(afterDate);
      rangeHours = [...rangeHours, ...Helpers.range(objectAfterDate.hour + 1, variables.DEFAULT_VALUE.END_HOUR)];
      if (moment(current).get('hour') === objectAfterDate.hour) {
        rangeMinutes = [
          ...rangeMinutes,
          ...Helpers.range(objectAfterDate.minute + 1, variables.DEFAULT_VALUE.END_MINUTE)
        ];
      }
    }
    return {
      disabledHours: () => rangeHours,
      disabledMinutes: () => rangeMinutes,
      disabledSeconds: () => rangeSeconds
    };
  }
}
/**
 * Bỏ dấu tiếng việt
 *
 * @param {*} str
 * @returns
 */
export const removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g," ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  return str;
}