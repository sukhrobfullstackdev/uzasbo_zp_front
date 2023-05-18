import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import IncomeCardServices from "./../../../../../../services/Report/AccountingSalary/IncomeCard/IncomeCard.services";

export function* getList({ payload }) {
  try {
    const response = yield IncomeCardServices.getList(payload);
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

export function* incomeCardSagas() {
  yield all([call(getListStart)]);
}
