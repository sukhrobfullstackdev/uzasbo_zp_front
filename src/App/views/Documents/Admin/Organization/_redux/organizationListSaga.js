import {takeLatest, put, call, all} from "redux-saga/effects";
import { Notification } from "../../../../../../helpers/notifications";
import ApiServices from "../../../../../../services/api.services";
import {getListSuccess, getListFail, getListStartAction} from "./organizationsSlice";

// worker saga
export function* getOrganizationList({payload}) {
    try {
        const response = yield ApiServices.get("Organization/GetList", {
            params: payload
        });
        yield put(getListSuccess(response.data));
    } catch (error) {
        Notification('error', error);
        yield put(getListFail(error.response));
    }
}

// watcher saga
export function* getOrganizationListStart() {
    yield takeLatest(getListStartAction, getOrganizationList);
}

export function* organizationListSagas() {
    yield all([call(getOrganizationListStart)]);
}
