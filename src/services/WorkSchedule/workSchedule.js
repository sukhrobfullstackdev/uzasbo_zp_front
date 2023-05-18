import ApiServices from '../api.services';

const baseUrl = 'WorkSchedule/';

const WorkScheduleApis = {
  getDate(payload) {
    return ApiServices.get(`${baseUrl}Get`, {
      params: payload
    })
  },
  getWorkScheduleList() {
    return ApiServices.get(`${baseUrl}GetAll`)
  }
}

export default WorkScheduleApis;