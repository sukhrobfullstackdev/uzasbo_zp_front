import { takeLatest, put, call, all } from "redux-saga/effects";
import { Notification } from "../../../../../helpers/notifications";

import EmployeeServices from "../../../../../services/References/Organizational/Employee/employee.services";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield EmployeeServices.getEmployeeExpressInfo(payload)
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

export function* employeeCardListSagas() {
  yield all([call(getListStart)]);
}
