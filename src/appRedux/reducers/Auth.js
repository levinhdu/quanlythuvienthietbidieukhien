import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_FAIL,
  REFRESH_TOKEN_SUCCESS
} from "constants/ActionTypes";

import { setCookieValue, removeCookieValue } from 'src/util/Common';

const INIT_STATE = {
  loader: false,
  alertMessage: '',
  showMessage: false,
  initURL: '',
  authUser: localStorage.getItem('user_id'),
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SIGNIN_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload,
        showMessage: false,
      }
    }
    case SIGNIN_USER_FAIL: {
      return {
        ...state,
        loader: false,
        authUser: {},
        showMessage: true
      }
    }
    case INIT_URL: {
      return {
        ...state,
        initURL: action.payload
      }
    }

    case REFRESH_TOKEN_SUCCESS: {
      // Remove old tokenInfo
      removeCookieValue('tokenInfo');
      // Set new token
      const maxAge = new Date(action.data.expires);
      setCookieValue('tokenInfo', action.data, { path: '/', maxAge: maxAge.getTime() });
      return {
        ...state,
        loader: false,
        authUser: action.data
      }
    }

    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: false
      }
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        showMessage: false,
        loader: false
      }
    }
    case ON_SHOW_LOADER: {
      return {
        ...state,
        loader: true
      }
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        loader: false
      }
    }
    default:
      return state;
  }
}
