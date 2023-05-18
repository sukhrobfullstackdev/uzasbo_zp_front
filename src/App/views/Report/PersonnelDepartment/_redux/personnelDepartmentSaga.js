import { takeLatest, put, call, all } from "redux-saga/effects";
import { Notification } from "../../../../../helpers/notifications";
import PersonnelDepartmentServices from "../../../../../services/Report/PersonnelDepartment/PersonnelDepartment.services";
import { getListSuccess, getListFail, getListStartAction } from "./personnelDepartmentSlice";

export function* getPersonnelDepartmentList({ payload }) {
    try {
        const response = yield PersonnelDepartmentServices.getList({ params: payload });
        yield put(getListSuccess(response.data));
    } catch (error) {
        Notification('error', error);
        yield put(getListFail(error.response));
    }
}

// watcher saga
export function* getPersonnelDepartmentListStart() {
    yield takeLatest(getListStartAction, getPersonnelDepartmentList);
}

export function* personnelDepartmentListSagas() {
    yield all([call(getPersonnelDepartmentListStart)]);
}
