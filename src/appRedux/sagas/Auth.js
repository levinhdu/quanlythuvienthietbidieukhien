import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import apiCallPublic from 'src/util/apiCallerPublic';
import apiCall from 'src/util/apiCaller';
import {
  SIGNIN_USER,
  REFRESH_TOKEN,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL,
} from "constants/ActionTypes";
import {setCookieValue, getTokenInfo} from 'src/util/Common';
import { showAuthMessage, userSignInSuccess } from "../actions/Auth";

const signInUserWithEmailPasswordRequest = async (username, password, domain) =>
  await apiCallPublic('', 'token', 'POST', { username, password, domain })

function* signInUserWithEmailPassword({ payload }) {
  const { username, password, domain } = payload;
  try {
    const signInUser = yield call(signInUserWithEmailPasswordRequest, username, password, domain);
    if (signInUser && signInUser.data.token) {
      const maxAge = new Date(signInUser.data.expires);
      setCookieValue('tokenInfo', signInUser.data, { path: '/', maxAge: maxAge.getTime() });
      yield put(userSignInSuccess(signInUser.data));
    } else {
      const message = loginMessage(signInUser.data);
      yield put(showAuthMessage(message));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function loginMessage(message) {
  return message;
}


function* refreshToken() {
  try {
    const userInfo = getTokenInfo();
    const infoData = {
      id: userInfo.id,
      email: userInfo.email,
      fullName: userInfo.fullName
    }
    const receivedData = yield apiCall('token/Refresh', 'POST', infoData, 'refresh');
    const userInfoData = {
      token: receivedData.data.token,
      fullName: receivedData.data.fullName,
      email: receivedData.data.email,
      id: receivedData.data.id,
      expires: receivedData.data.expires,
    }
    yield put({
      type: REFRESH_TOKEN_SUCCESS,
      data: userInfoData,
    });
  } catch (error) {
    yield put({
      type: REFRESH_TOKEN_FAIL,
      error
    });
  }
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* refreshTokenInfo() {
  yield takeEvery(REFRESH_TOKEN, refreshToken);
}

export default function* rootSaga() {
  yield all([
    fork(signInUser),
    fork(refreshTokenInfo)
  ]);
}
