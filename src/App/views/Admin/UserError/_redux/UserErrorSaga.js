import { takeLatest, put, call, all } from "redux-saga/effects";

import ApiServices from '../../../../../services/api.services';
import { Notification } from "../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield ApiServices.get("UserError/GetList", {
      params: payload
    });
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

export function* UserErrorSagas() {
  yield all([call(getListStart)]);
}
