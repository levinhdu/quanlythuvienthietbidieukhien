import {all} from "redux-saga/effects";
import authSagas from "./Auth";
import commonSagas from './Common';
import menuSagas from './Menu';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    commonSagas(),
    menuSagas()
  ]);
}
