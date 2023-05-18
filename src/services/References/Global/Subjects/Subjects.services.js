import ApiServices from "../../../api.services";

const baseUrl = "Subjects/";

const SubjectsServices = {
  getList(offset, limit, sort, order, search) {
    if (sort && order) {
      if (order === "ascend") {
        order = "asc";
      } else if (order === "descend") {
        order = "desc";
      }
      return ApiServices.get(
        `${baseUrl}GetList?SortColumn=${sort}&OrderType=${order}&PageNumber=${offset}&PageLimit=${limit}&ID=${search}`
      );
    }
    return ApiServices.get(
      `${baseUrl}GetList?PageNumber=${offset}&PageLimit=${limit}&ID=${search}`
    );
  },

  getAll() {
    return ApiServices.get(`${baseUrl}GetAll`); 
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`); 
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

  // delete(id) {
  //   return ApiServices.delete(`${baseUrl}Delete?id=${id}`, id);
  // },

  // getById(id) {
  //   return ApiServices.get(`${baseUrl}Get?id=${id}`);
  // },

  // postEdits(data) {
  //   return ApiServices.post(`${baseUrl}Update`, data);
  // },
};

export default SubjectsServices;
