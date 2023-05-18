import ApiServices from "../../../api.services";

const baseUrl = "TPListOfPositionCategory/";

const TPListOfPositionCategoryServices = {
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

  GetAllTPListOfPositionCategory(id) {
    return ApiServices.get(`${baseUrl}GetAllTPListOfPositionCategory?organizationtypeid=${id}`);
  },
};

export default TPListOfPositionCategoryServices;
