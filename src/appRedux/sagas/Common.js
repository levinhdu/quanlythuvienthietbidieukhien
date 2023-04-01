import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  FETCH_START
} from 'src/constants/ActionTypes';

// Saga effects
import { put, takeEvery, all, fork } from 'redux-saga/effects';
import fetchData from './others/Api';

// Load API
const fetchDataAPI = function* fetchDataAPI(data) {
  try {
    const receivedData = yield fetchData(data.urlData, data.method, data.value);
    if(data.resolve) data.resolve(receivedData);
    yield put({
      type: FETCH_SUCCESS,
      data: receivedData.data,
      status: receivedData.status,
      apiType: data.apiType,
      getName: data.getName ? data.getName : ''
    });
  } catch (error) {
    if(data.reject) data.reject(error);
    yield put({
      type: FETCH_ERROR,
      error,
      apiType: data.apiType
    });
  }
};

export const watchFetchDataAPI = function* watchFetchDataAPI() {
  yield takeEvery(FETCH_START, fetchDataAPI);
};

export default function* rootSaga() {
  yield all([
    fork(watchFetchDataAPI),
  ]);
}
