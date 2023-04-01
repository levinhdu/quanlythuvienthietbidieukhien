import {
  FETCH_START,
  FETCH_RESET,
  HIDE_MESSAGE,
  SHOW_MESSAGE,
  CHANGE_LOADING_STATE,
  FETCH_RESET_ITEM
} from "src/constants/ActionTypes";

/**
 * fetchStart: Request API
 *
 * @param {*} urlData
 * @param {*} method
 * @param {*} value
 * @param {*} apiType
 * @param {*} getName
 * @returns
 */
export const fetchStart = (urlData, method, value, apiType, getName = '', resolve = null, reject = null) => {
  return {
    type: FETCH_START,
    urlData,
    method,
    value,
    apiType,
    getName,
    resolve,
    reject
  }
};

export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  }
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE
  }
};

/**
 * Reset lại reducer dữ liệu trong common
 *
 * @returns
 */
export const fetchReset = () => {
  return {
    type: FETCH_RESET
  }
};

/**
 * Reset key object trong common reducer
 *
 * @param {*} key
 * @returns
 */
export const fetchResetItem = (key) => {
  return {
    type: FETCH_RESET_ITEM,
    payload: key
  }
}

export const changeLoadingState = (value) => {
  return {
    type: CHANGE_LOADING_STATE,
    payload: { loading: value }
  }
};


