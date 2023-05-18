import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import TPListOfPositionCategoryServices from "./../../../../../../services/References/Template/TPListOfPositionCategory/TPListOfPositionCategory.services";

export function* getList({ payload }) {
  try {
    const response = yield TPListOfPositionCategoryServices.getList(payload);
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

export function* TPListOfPosCategorySagas() {
  yield all([call(getListStart)]);
}
