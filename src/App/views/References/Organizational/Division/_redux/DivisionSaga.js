import { takeLatest, put, call, all } from "redux-saga/effects";
import { Notification } from "../../../../../../helpers/notifications";

import ApiServices from '../../../../../../services/api.services';
import { getListSuccess, getListFail, getListStartAction } from "./DivisionSlice";

export function* getDivisionList({ payload }) {
  try {
    const response = yield ApiServices.get("Division/GetList", {
      params: payload
    });
    yield put(getListSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getListFail(error.response));
  }
}

// watcher saga
export function* getDivisionListStart() {
  yield takeLatest(getListStartAction, getDivisionList);
}

export function* DivisionListSagas() {
  yield all([call(getDivisionListStart)]);
}
