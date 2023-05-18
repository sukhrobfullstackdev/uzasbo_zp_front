import ApiServices from "../../../api.services";

const baseUrl = "QualificationCategory/";

const QualificationCategoryServices = {
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

  // getByInn(inn) {
  //   return ApiServices.get(`${baseUrl}Get?id=0&inn=${inn}`);
  // },
  

  // formFilter(values) {
  //   return ApiServices.get(
  //     `${baseUrl}GetList?ID=${values.ID}&PersonnelNumber=${values.PersonnelNumber}&FullName=${values.FullName}&INN=${values.INN}&DateOfBirth=${values.DateOfBirth}&EmpType=${values.EmpType}&Gender=${values.Gender}&Offset=${values.Offset}&Limit=${values.Limit}`
  //   );
  // },

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

export default QualificationCategoryServices;
