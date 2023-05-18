import ApiServices from "../../../api.services";

const baseUrl = "AllPositions/";

const AllPositionsServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getAll() {
    return ApiServices.get(`${baseUrl}GetAll`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default AllPositionsServices;
