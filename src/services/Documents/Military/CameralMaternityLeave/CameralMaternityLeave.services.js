import ApiServices from "../../../api.services";

const baseUrl = "CameralSalaryCalculation/";

const CameralMaternityLeaveServices = {
  getList(filterFormValues) {
    // console.log(filterFormValues.Year);
    return ApiServices.get(
      `${baseUrl}GetCameralMaternityLeave?Year=${ filterFormValues.Year ? filterFormValues.Year:""}&OblastID=${filterFormValues.OblastID ? filterFormValues.OblastID : ""}&RegionID=${filterFormValues.RegionID ? filterFormValues.RegionID : ""}`
    );
  },

  print(filterFormValues) {
    // console.log(filterFormValues)
    return ApiServices.get(
      `${baseUrl}PrintCameralMaternityLeav?Year=${filterFormValues.Year}&OblastID=${filterFormValues.OblastID}&RegionID=${filterFormValues.RegionID}`,
      {responseType: "blob"}
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  calculate(data) {
    return ApiServices.post(`${baseUrl}Calculate`, data);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
};

export default CameralMaternityLeaveServices;
