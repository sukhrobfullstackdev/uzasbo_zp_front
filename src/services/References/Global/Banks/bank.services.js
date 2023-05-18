import ApiServices from "../../../api.services";

const baseUrl = "Bank/";

const BankServices = { 
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },
  
  printById(id) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${id}`,
      {responseType: "blob"}
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postEdits(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default BankServices;
