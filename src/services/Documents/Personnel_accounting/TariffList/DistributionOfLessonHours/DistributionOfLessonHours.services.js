import ApiServices from "../../../../api.services";
const baseUrl = "DistributionOfLessonHours/";

const DistributionOfLessonHoursServices = {

  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getExpandedRow(id) {
    return ApiServices.get(`${baseUrl}GetDistributionOfLessonHoursTable?OwnerID=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}Cancel?id=${id}`);
  },

  printById(id) {
    return ApiServices.get(
      `${baseUrl}Print?id=${id}`,
      { responseType: "blob" }
    );
  },

  getDistributionOfLessonHoursDataControl(payload) {
    return ApiServices.get(`${baseUrl}GetDistributionOfLessonHoursDataControl`, { params: payload });
  },
};

export default DistributionOfLessonHoursServices;
