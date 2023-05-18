import ApiServices from "../../../api.services";

const baseUrl = "SickList/";

const SickListServices = {
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

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  printRow(id) {
    return ApiServices.get(`${baseUrl}GetSickListPrint?DocumentID=${id}`,
      { responseType: "blob" }
    );
  },

  calculate(data) {
    return ApiServices.post(`${baseUrl}FillSickListTable`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },

  InsertSickListFromHR(PNFL) {
    return ApiServices.get(`${baseUrl}InsertSickListFromHR?PNFL=${PNFL}`);
  },
};

export default SickListServices;
