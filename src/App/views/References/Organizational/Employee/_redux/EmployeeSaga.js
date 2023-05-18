import { takeLatest, put, call, all } from "redux-saga/effects";
import { Notification } from "../../../../../../helpers/notifications";

import ApiServices from '../../../../../../services/api.services';
import { getListSuccess, getListFail, getListStartAction } from "./EmployeeSlice";

export function* getEmployeeList({ payload }) {
  try {
    const response = yield ApiServices.get("Employee/GetList", {
      params: payload
    });
    yield put(getListSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getListFail(error.response));
  }
}

// watcher saga
export function* getEmployeeListStart() {
  yield takeLatest(getListStartAction, getEmployeeList);
}

export function* employeeListSagas() {
  yield all([call(getEmployeeListStart)]);
}
