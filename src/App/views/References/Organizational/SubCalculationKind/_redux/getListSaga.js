import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import SubCalculationKindServices from "../../../../../../services/References/Organizational/SubCalculationKind/SubCalculationKind.services";

export function* getList({ payload }) {
  try {
    const response = yield SubCalculationKindServices.getList(payload);
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

export function* subCalcKindSagas() {
  yield all([call(getListStart)]);
}
