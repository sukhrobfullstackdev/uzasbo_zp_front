import ApiServices from "../../../api.services";

const baseUrl = "ListOfPositionCategory/";

const ListPositionCategoryServices = {
  // getList(pageNumber, pageLimit, sortColumn, orderType, values) {
  //   if (orderType === "ascend") {
  //     orderType = "asc";
  //   } else if (orderType === "descend") {
  //     orderType = "desc";
  //   }

  //   return ApiServices.get(
  //     `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ''}&OrderType=${orderType ? orderType : ''}&PageNumber=${pageNumber ? pageNumber : ''}&PageLimit=${pageLimit ? pageLimit : ''}&Search=${values.Search ? values.Search : ''}&ID=${values.ID ? values.ID : ''}&Code=${values.Code ? values.Code : ''}&Name=${values.Name ? values.Name : ''}`
  //   );
  // },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default ListPositionCategoryServices;
