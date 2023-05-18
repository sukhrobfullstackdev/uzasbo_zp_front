import ApiServices from "../api.services";

const baseUrl = "AccountBookByEmployee/";

const AccountBookByEmployeeServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, values) {
    if (sortColumn && orderType) {
      if (orderType === "ascend") {
        orderType = "asc";
      } else if (orderType === "descend") {
        orderType = "desc";
      }
      return ApiServices.get(
        `${baseUrl}GetList?ID=${values.ID}&PersonnelNumber=${values.PersonnelNumber}&FullName=${values.FullName}&INN=${values.INN}&DateOfBirth=${values.DateOfBirth}&EmpType=${values.EmpType}&SortColumn=${sortColumn}&OrderType=${orderType}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&INPSCode=${values.INPSCode ? values.INPSCode : ''}&PlasticCardNumber=${values.PlasticCardNumber ? values.PlasticCardNumber : ''}`
      );
    }
    return ApiServices.get(
      `${baseUrl}GetList?ID=${values.ID}&PersonnelNumber=${values.PersonnelNumber}&FullName=${values.FullName}&INN=${values.INN}&DateOfBirth=${values.DateOfBirth}&EmpType=${values.EmpType}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&INPSCode=${values.INPSCode ? values.INPSCode : ''}&PlasticCardNumber=${values.PlasticCardNumber ? values.PlasticCardNumber : ''}`
    );
  },

  //   print(values) {
  //     return ApiServices.get(
  //       `${baseUrl}Print?ID=${values.ID}&PersonnelNumber=${values.PersonnelNumber}&FullName=${values.FullName}&INN=${values.INN}&DateOfBirth=${values.DateOfBirth}&EmpType=${values.EmpType}`,
  // {responseType: "blob"}
  //     );
  //   },

  printById(id) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${id}`,
      { responseType: "blob" }
    );
  },

  getByInn(inn) {
    return ApiServices.get(`${baseUrl}Get?id=0&inn=${inn}`);
  },

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

export default AccountBookByEmployeeServices;

