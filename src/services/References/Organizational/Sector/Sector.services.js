import ApiServices from "../../../api.services";

const baseUrl = "Sector/";

const SectorServices = {
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },
  
  getAll(subDepartmentId) {
    return ApiServices.get(`${baseUrl}GetAll?SubDepartmentID=${subDepartmentId}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default SectorServices;
