import ApiServices from "../../../api.services";

const baseUrl = "TariffScale/";

const TariffScaleServices = {
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

  getAll(tariffScaleTypeId = 0) {
    return ApiServices.get(`${baseUrl}GetAll?tariffScaleTypeId=${tariffScaleTypeId}`);
  },

  GetList() {
    return ApiServices.get(`${baseUrl}GetList`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default TariffScaleServices;
