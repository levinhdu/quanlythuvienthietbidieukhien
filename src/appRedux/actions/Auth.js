import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_USER,
  SIGNIN_USER_SUCCESS,
  USER_TOKEN_SET,
  USER_DATA,
  GET_LIST_VAI_TRO,
  REFRESH_TOKEN
} from "constants/ActionTypes";

export const userSignIn = (user) => {
  return {
    type: SIGNIN_USER,
    payload: user
  };
};

export const userSignInSuccess = (authUser) => {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload: authUser
  }
};

export const showAuthMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};



export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const showAuthLoader = () => {
  return {
    type: ON_SHOW_LOADER,
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};
export const hideAuthLoader = () => {
  return {
    type: ON_HIDE_LOADER,
  };
};

export const setToken = (accessToken) => {
  return {
    type: USER_TOKEN_SET,
    payload: accessToken
  }
};

export const getUserInfo = () => {
  return {
    type: USER_DATA
  }
}

export const getListVaiTro = () => {
  return {
    type: GET_LIST_VAI_TRO
  }
}

export const refreshToken = () => {
  return {
    type: REFRESH_TOKEN
  }
}
