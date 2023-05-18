import { takeLatest, put, call, all } from "redux-saga/effects";

import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import AppointQualCategoryServices from "../../../../../../services/References/Organizational/AppointQualCategory/AppointQualCategory.services";
import { Notification } from "../../../../../../helpers/notifications";

export function* getList({ payload }) {
  try {
    const response = yield AppointQualCategoryServices.getList(payload);
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

export function* appointQualCategorySagas() {
  yield all([call(getListStart)]);
}
