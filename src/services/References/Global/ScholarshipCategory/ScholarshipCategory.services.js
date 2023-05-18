import ApiServices from "../../../api.services";

const baseUrl = "ScholarshipCategory/";

const ScholarshipCategoryServices = {

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default ScholarshipCategoryServices;
