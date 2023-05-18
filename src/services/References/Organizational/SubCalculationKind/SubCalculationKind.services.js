import ApiServices from "../../../api.services";

const baseUrl = "SubCalculationKind/";

const SubCalculationKindServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  getListByOrgID(payload) {
    return ApiServices.get(`${baseUrl}GetList`, { params: payload});
  },
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getAll() {
    return ApiServices.get(`${baseUrl}GetAll`);
  },

  refreshSub() {
    return ApiServices.get(`${baseUrl}RefreshSub`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
  fillSubCalculationKindTable(data) {
    return ApiServices.post(`${baseUrl}FillSubCalculationKindTable`, data);
  },

  getOrganizationIDbyINN(inn) {
    return ApiServices.get(`${baseUrl}GetOrganizationIDbyINN?inn=${inn}`);
  },

  GetFromTPSubCalculationKind() {
    return ApiServices.get(`${baseUrl}GetFromTPSubCalculationKind`);
  },

  GetLoadLeavePayData(payload) {
    return ApiServices.get(`${baseUrl}GetLoadLeavePayData`, {params: payload});
  },

  UpdateSaveLeavePayData(data) {
    return ApiServices.post(`${baseUrl}UpdateSaveLeavePayData`, data);
  },

  SyncSubCalculationKind(payload) {
    return ApiServices.get(`${baseUrl}SyncSubCalculationKind`, {params: payload});
  },
};

export default SubCalculationKindServices;