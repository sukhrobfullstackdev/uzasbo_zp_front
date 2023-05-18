import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import StaffListServices from "../../../../../../../services/Documents/Personnel_accounting/StaffingTable/StaffList/StaffList.services";

export function* getList({ payload }) {
  try {
    const response = yield StaffListServices.getListOblast(payload);
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

export function* indexByOblastSagas() {
  yield all([call(getListStart)]);
}
