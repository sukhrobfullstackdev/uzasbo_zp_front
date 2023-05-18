import {takeLatest, put, call, all} from "redux-saga/effects";
import { Notification } from "../../../../../../helpers/notifications";
import ApiServices from "../../../../../../services/api.services";
import {getListSuccess, getListFail, getListStartAction} from "./rolesSlice";
// import {ShowNotification} from "../../../containers/ShowNotification";

// worker saga
export function* getRolesList({payload}) {
    try {
        const response = yield ApiServices.get("Role/GetList", {
            params: payload
        });
        yield put(getListSuccess(response.data));
    } catch (error) {
        Notification('error', error);
        yield put(getListFail(error.response));
    }
}

// watcher saga
export function* getRolesListStart() {
    yield takeLatest(getListStartAction, getRolesList);
}

// multiple sagas with order
export function* rolesListSagas() {
    yield all([call(getRolesListStart)]);
}
