import ApiServices from "../../../api.services";

const baseUrl = "MaternityLeaveRequest/";

const MaternityLeaveRequestServices = {
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

  postDataFillTableData(data) {
    return ApiServices.get(`${baseUrl}FillMaternityLeaveRequest?Month=${data.Month}&Year=${data.Year}&FunctionalItemID=${data.FunctionalItemID}&ChapterID=${data.ChapterID}`)
  },

  postData(data) {
    console.log(data);
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },
  NotAccept(id) {
    console.log(id);
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
  send(id) {
    return ApiServices.post(`${baseUrl}Send?id=${id}`);
  },
};

export default MaternityLeaveRequestServices;
