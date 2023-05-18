import ApiServices from "../../../api.services";

const baseUrl = "BasicEducationalPlan/";
// const baseEmpluyeeUrl = "Employee/"
//const baseHelperUrl = "Helper/"

const BasicEducationalPlanServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Number=${filter.Number ? filter.Number : ''}&Search=${filter.Search ? filter.Search : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}&OrgID=${filterFormValues.OrgID ? filterFormValues.OrgID : ''}`
    );
  },


  getPlasticCardTableData(id, pageNumber, pageLimit, sortColumn, orderType, filter = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&Search=${filter.Search ? filter.Search : ''}`
    );
  },

  // getModalList(pageNumber, pageLimit, sortColumn, orderType, filter, filterFormValues, ParentID) {
  //   if (ParentID === 18 || 19) {
  //     return ApiServices.get(`${baseEmpluyeeUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&FullName=${filter.FullName ? filter.FullName : ''}`);
  //   } else if (ParentID === 63) {
  //     return ApiServices.get(
  //       `${baseEmpluyeeUrl}GetList?ID=${filterFormValues.ID}&PersonnelNumber=${filterFormValues.PersonnelNumber}&FullName=${filterFormValues.FullName}&INN=${filterFormValues.INN}&DateOfBirth=${filterFormValues.DateOfBirth}&EmployeeTypeID=${filterFormValues.EmpType}&SortColumn=${sortColumn}&OrderType=${orderType}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&INPSCode=${filterFormValues.INPSCode ? filterFormValues.INPSCode : ''}&PlasticCardNumber=${filterFormValues.PlasticCardNumber ? filterFormValues.PlasticCardNumber : ''}`
  //     );
  //   }
  // },

  getAll(StartYear, id) {
    return ApiServices.get(`${baseUrl}GetAll?StartYear=${StartYear}&BLHGTypeID=${id}&TeachingAtHome=false`);
    //return ApiServices.get(`${baseUrl}GetAll?StartYear=2021&BLHGTypeID=1&TeachingAtHome=false`);
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  deleteTableData(id) {
    return ApiServices.delete(`${baseUrl}DeleteTimeSheetTableRow?id=${id}`);
  },

  deleteTableRow(ids) {
    let idText = '';
    ids.forEach(item => {
      idText = idText + 'ids=' + item + '&';
    })

    return ApiServices.delete(`${baseUrl}DeleteRows?${idText}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
};

export default BasicEducationalPlanServices;
