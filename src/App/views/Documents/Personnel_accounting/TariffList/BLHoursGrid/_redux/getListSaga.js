import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import BLHoursGridServices from "./../../../../../../../services/Documents/Personnel_accounting/TariffList/BLHoursGrid/BLHoursGrid.services";

export function* getList({ payload }) {
  try {
    const response = yield BLHoursGridServices.getList(payload);
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

export function* bLHoursGridSagas() {
  yield all([call(getListStart)]);
}
