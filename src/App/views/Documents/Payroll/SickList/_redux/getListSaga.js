import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import SickListServices from "../../../../../../services/Documents/Payroll/SickList/SickList.services";

export function* getList({ payload }) {
  try {
    const response = yield SickListServices.getList(payload);
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

export function* sickListSagas() {
  yield all([call(getListStart)]);
}
