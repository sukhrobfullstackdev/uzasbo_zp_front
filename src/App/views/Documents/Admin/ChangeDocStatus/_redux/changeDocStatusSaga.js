import {takeLatest, put, call, all} from "redux-saga/effects";
import {getListSuccess, getListFail, getListStartAction} from "./changeDocStatusSlice";
import ChangeDocStatusServices from "../../../../../../services/Documents/Admin/ChangeDocStatus/ChangeDocStatus.services";
import { Notification } from "../../../../../../helpers/notifications";

// worker saga
export function* getChangeDocStatus({payload}) {
    try {
        const response = yield ChangeDocStatusServices.getList({params: payload})
        yield put(getListSuccess(response.data));
    } catch (error) {
        Notification('error', error);
        yield put(getListFail(error.response));
    }
}

// watcher saga
export function* getChangeDocStatusStart() {
    yield takeLatest(getListStartAction, getChangeDocStatus);
}

// multiple sagas with order
export function* changeDocStatusSagas() {
    yield all([call(getChangeDocStatusStart)]);
}
