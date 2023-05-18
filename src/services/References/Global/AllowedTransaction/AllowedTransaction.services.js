import ApiServices from "../../../api.services";

const baseUrl = "AllowedTransaction/";

const AllowedTransactionServices = {
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

  postEdits(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  GetList() {
    return ApiServices.get(`${baseUrl}GetList`);
  },

};

export default AllowedTransactionServices;
