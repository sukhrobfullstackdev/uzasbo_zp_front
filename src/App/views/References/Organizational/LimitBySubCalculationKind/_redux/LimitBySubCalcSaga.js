import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import ApiServices from '../../../../../../services/api.services';
import { getListSuccess, getListFail, getListStartAction, getDataSuccess, getDataFail, getDataStart } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield ApiServices.get("LimitBySubCalculationKind/GetList", {
      params: payload
    });
    yield put(getListSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getListFail(error.response));
  }
}

export function* get({ payload }) {
  try {
    const response = yield ApiServices.get("LimitBySubCalculationKind/Get", {
      params: payload
    });
    yield put(getDataSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getDataFail(error.response));
  }
}


// watcher saga
export function* getListStart() {
  yield takeLatest(getListStartAction, getList);
}

export function* getByIdStart() {
  yield takeLatest(getDataStart, get);
}

export function* LimitBySubCalcSagas() {
  yield all([call(getListStart, getByIdStart)]);
}
