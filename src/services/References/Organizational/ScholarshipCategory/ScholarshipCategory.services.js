import ApiServices from "../../../api.services";

const baseUrl = "ScholarshipCategory/";

const ScholarshipCategoryServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

};

export default ScholarshipCategoryServices;