import { takeLatest, put, call, all } from "redux-saga/effects";
import { Notification } from "../../../../../../helpers/notifications";

import ApiServices from '../../../../../../services/api.services';
import { getListSuccess, getListFail, getListStartAction } from "./TimeSheetSlice";

export function* getTimeSheetList({ payload }) {
  try {
    const response = yield ApiServices.get("TimeSheet/GetList", {
      params: payload
    });
    yield put(getListSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getListFail(error.response));
  }
}

// watcher saga
export function* getTimeSheetListStart() {
  yield takeLatest(getListStartAction, getTimeSheetList);
}

export function* timeSheetListSagas() {
  yield all([call(getTimeSheetListStart)]);
}
