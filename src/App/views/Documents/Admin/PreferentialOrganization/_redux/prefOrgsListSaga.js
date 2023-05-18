import {takeLatest, put, call, all} from "redux-saga/effects";
import { Notification } from "../../../../../../helpers/notifications";
import ApiServices from "../../../../../../services/api.services";
import {getListSuccess, getListFail, getListStartAction} from "./prefOrgsSlice";

// worker saga
export function* getPrefOrgsList({payload}) {
    try {
        const response = yield ApiServices.get("PreferentialOrganization/GetList", {
            params: payload
        });
        yield put(getListSuccess(response.data));
    } catch (error) {
        Notification('error', error);
        yield put(getListFail(error.response));
    }
}

// watcher saga
export function* getPrefOrgsListStart() {
    yield takeLatest(getListStartAction, getPrefOrgsList);
}

export function* prefOrgsListSagas() {
    yield all([call(getPrefOrgsListStart)]);
}
