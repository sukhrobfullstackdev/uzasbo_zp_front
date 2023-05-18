import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import TPTaxesAndChargesServices from "./../../../../../../services/References/Template/TPTaxesAndCharges/TPTaxesAndCharges.services";

export function* getList({ payload }) {
  try {
    const response = yield TPTaxesAndChargesServices.getList(payload);
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

export function* TPTaxesAndChargesSagas() {
  yield all([call(getListStart)]);
}
