import ApiServices from "../../../api.services";

const baseUrl = "Department/";

const DepartmentServices = {
  getList(offset, limit, sort, order, values, TypeID) {
    if (sort && order) {
      if (order === "ascend") {
        order = "asc";
      } else if (order === "descend") {
        order = "desc";
      }
      return ApiServices.get(
        `${baseUrl}GetList?SortColumn=${sort}&OrderType=${order}&PageNumber=${offset}&PageLimit=${limit}&=${values.Search ? values.Search : ''}
        &ID=${values.ID ? values.ID : ''}&Code=${values.Code ? values.Code : ''}&Name=${values.Name ? values.Name : ''}`
      );
    }
    // if (TypeID === 1) {
      return ApiServices.get(
        `${baseUrl}GetList?PageNumber=${offset}&PageLimit=${limit}&Search=${values.Search ? values.Search : ''}&TypeID=${values.TypeID}&ID=${values.ID ? values.ID : ''}&Code=${values.Code ? values.Code : ''}&Name=${values.Name ? values.Name : ''}`
      );
    // }
    
  },
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getAll(orgId = 0) {
    return ApiServices.get(`${baseUrl}GetAll?OrganizationID=${orgId}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default DepartmentServices;
