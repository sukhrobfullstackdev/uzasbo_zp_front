import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import AllPositionsServices from "../../../../../../services/References/Global/AllPositions/AllPositions.services";

export function* getList({ payload }) {
  try {
    const response = yield AllPositionsServices.getList(payload);
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

export function* allPositionsSagas() {
  yield all([call(getListStart)]);
}
