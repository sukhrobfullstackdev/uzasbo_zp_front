import ApiServices from "../../../api.services";

const baseUrl = "TPSubCalculationKind/";

const TPSubCalculationKindServices = {
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

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  fillSubCalculationKindTable(data) {
    return ApiServices.post(`${baseUrl}FillSubCalculationKindTable`, data);
  },
  
};

export default TPSubCalculationKindServices;
