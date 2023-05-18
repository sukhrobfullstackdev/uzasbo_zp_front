import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import TPListOfPositionServices from "../../../../../../services/References/Template/TPListOfPosition/TPListOfPosition.services";

export function* getList({ payload }) {
  try {
    const response = yield TPListOfPositionServices.getList(payload);
    yield put(getListSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getListFail(error.response));
  }
}

// watcher saga
export function* getListStart() {
  yield takeLatest(getListStartAction, getList);
}

export function* TPListOfPosSagas() {
  yield all([call(getListStart)]);
}
