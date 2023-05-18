//import ApiServices from "../../../api.services";
import ApiServices from "../../../../api.services";
const baseUrl = "BLHoursGrid/";

const BLHoursGridServices = {

  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  print(filterFormValues) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${filterFormValues.ID}&Number=${filterFormValues.Number}&Date=${filterFormValues.Date}&StartYear=${filterFormValues.StartYear}&EndYear=${filterFormValues.EndYear}&TotalHours=${filterFormValues.TotalHours}&Comment=${filterFormValues.Comment}`,
      { responseType: "blob" }
    );
  },

  printById(id) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${id}`,
      { responseType: "blob" }
    );
  },
  printByDivide(year) {
    return ApiServices.get(
      `${baseUrl}PrintByDivide?Year=${year}`,
      { responseType: "blob" }
    );
  },

  GetForFillBLHoursGrid(StartYear) {
    return ApiServices.get(`${baseUrl}GetForFillBLHoursGrid?StartYear=${StartYear}`);
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
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

  getBLClassCount(payload) {
    return ApiServices.get(`${baseUrl}GetBLClassCount`, { params: payload });
  },
};

export default BLHoursGridServices;
