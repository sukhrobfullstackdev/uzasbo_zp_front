import { takeLatest, put, call, all } from "redux-saga/effects";
import { Notification } from "../../../../../../helpers/notifications";

import ApiServices from '../../../../../../services/api.services';
import { getListSuccess, getListFail, getListStartAction } from "./TimeSheetEduSlice";

export function* getTimeSheetEduList({ payload }) {
  try {
    const response = yield ApiServices.get("TimeSheetEdu/GetList", {
      params: payload
    });
    yield put(getListSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getListFail(error.response)); 
  }
}

// watcher saga
export function* getTimeSheetEduListStart() {
  yield takeLatest(getListStartAction, getTimeSheetEduList);
}

export function* timeSheetEduListSagas() {
  yield all([call(getTimeSheetEduListStart)]);
}
