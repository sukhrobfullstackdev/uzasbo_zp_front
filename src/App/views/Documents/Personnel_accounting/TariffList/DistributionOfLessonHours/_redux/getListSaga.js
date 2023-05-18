import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import DistributionOfLessonHoursServices from "../../../../../../../services/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/DistributionOfLessonHours.services";

export function* getList({ payload }) {
  try {
    const response = yield DistributionOfLessonHoursServices.getList(payload);
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

export function* distributionOfLessonHoursSagas() {
  yield all([call(getListStart)]);
}
