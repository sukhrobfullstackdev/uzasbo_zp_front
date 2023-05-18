import ApiServices from "../../../api.services";

const baseUrl = "SubDepartment/";

const SubDepartmentServices = {
  // getList(offset, limit, sort, order, values) {
  //   if (sort && order) {
  //     if (order === "ascend") {
  //       order = "asc";
  //     } else if (order === "descend") {
  //       order = "desc";
  //     }
  //     return ApiServices.get(
  //       `${baseUrl}GetList?SortColumn=${sort}&OrderType=${order}&PageNumber=${offset}&PageLimit=${limit}&Search=${values.Search ? values.Search : ''}&ID=${values.ID ? values.ID : ''}&Code=${values.Code ? values.Code : ''}&Name=${values.Name ? values.Name : ''}`
  //     );
  //   }
  //   return ApiServices.get(
  //     `${baseUrl}GetList?PageNumber=${offset}&PageLimit=${limit}&Search=${values.Search ? values.Search : ''}&ID=${values.ID ? values.ID : ''}&Code=${values.Code ? values.Code : ''}&Name=${values.Name ? values.Name : ''}`
  //   );
  // },
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },
  
  getAll(departmentId) {
    return ApiServices.get(`${baseUrl}GetAll?DepartmentID=${departmentId}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default SubDepartmentServices;
