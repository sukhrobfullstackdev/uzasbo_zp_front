import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import MemorialOrder5Services from "../../../../../services/Report/MemorialOrder5/MemorialOrder5.services";

export function* getList({ payload }) {
  try {
    const response = yield MemorialOrder5Services.getList(payload);
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

export function* memorialOrder5Sagas() {
  yield all([call(getListStart)]);
}
