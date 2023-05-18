import ApiServices from "../../../api.services";

const baseUrl = "Employee/";

const EmployeeServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, values, filter) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }
    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&INPSCode=${filter.INPSCode ? filter.INPSCode : ''}&PlasticCardNumber=${filter.PlasticCardNumber ? filter.PlasticCardNumber : ''}&INN=${filter.INN ? filter.INN : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&FullName=${filter.FullName ? filter.FullName : ''}&DateOfBirth=${values.DateOfBirth}&EmployeeTypeID=${values.EmpType}`
    );
  },

  GetList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },
  getPHD(payload) {
    return ApiServices.get(`${baseUrl}GetPHD`, {
      params: payload
    })
  },

  getEmployeeExpressInfo(payload) {
    return ApiServices.get(`${baseUrl}GetEmployeeExpressInfo`, {
      params: payload
    })
  },

  // gettinglist EmployeeEnrolment and Student 
  getListList(pageNumber, pageLimit, sortColumn, orderType, values) {
    if (sortColumn && orderType) {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }
    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}ID=${values.ID}&PersonnelNumber=${values.PersonnelNumber}&FullName=${values.FullName}&INN=${values.INN}&DateOfBirth=${values.DateOfBirth}&EmployeeTypeID=${values.EmpType}&INPSCode=${values.INPSCode ? values.INPSCode : ''}&PlasticCardNumber=${values.PlasticCardNumber ? values.PlasticCardNumber : ''}`
    );
  },

  //EmpployeeModal uchun
  GetWorkingEmployeesList(pageNumber, pageLimit, sortColumn, orderType, divisionId = '', departmentId = '', filterType, filterValue) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(`${baseUrl}GetWorkingEmployeesList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&DivisionID=${divisionId}&DepartmentID=${departmentId}${filterType ? '&' + filterType + '=' + filterValue : '&FullName=' + filterValue}`);
  },
  GetWorkingEmployeesNoParameterList(pageNumber, pageLimit, sortColumn, orderType, divisionId = '', departmentId = '', filterType, filterValue) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(`${baseUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&DivisionID=${divisionId}&DepartmentID=${departmentId}${filterType ? '&' + filterType + '=' + filterValue : ''}`);
  },


  print(values) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${values.ID}&PersonnelNumber=${values.PersonnelNumber}&FullName=${values.FullName}&INN=${values.INN}&DateOfBirth=${values.DateOfBirth}&EmpType=${values.EmpType}`,
      { responseType: 'blob' }
    );
  },

  // print List
  printList(values) {
    return ApiServices.get(`${baseUrl}Print`, { params: values, responseType: 'blob' });
  },

  getEmployeeCardPrint(values) {
    return ApiServices.get(`${baseUrl}GetEmployeeCardPrint`, { params: values, responseType: 'blob' });
  },
  getEmployeeCardPrintForAdmin(values) {
    return ApiServices.get(`${baseUrl}GetEmployeeCardPrintForAdmin`, { params: values, responseType: 'blob' });
  },

  printById(id) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${id}`,
      { responseType: "blob" }
    );
  },

  getByInn(inn) {
    return ApiServices.get(`${baseUrl}Get?id=0&inn=${inn}`);
  },

  getAll() {
    return ApiServices.get(`${baseUrl}GetAll`);
  },

  getPerson(values) {
    return ApiServices.get(`${baseUrl}EmployeeInsertFromAPI?Pinfl=${values.INPSCode}&Seria=${values.Series}&Number=${values.Number}`);
  },

  getTableDataHistory(id, tableId, columnName) {
    return ApiServices.get(`${baseUrl}GetTableDataHistory?DataID=${id}&TableID=${tableId}&ColumnName=${columnName}`);
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  // Change Status By Admin
  ChangeStatusByAdmin(id) {
    return ApiServices.get(`${baseUrl}ChangeStatusByAdmin?employeeID=${id}`);
  },

  GetEmployeeStudent(payload) {
    return ApiServices.get(`${baseUrl}GetEmployeeStudent`, { params: payload });
  },
};

export default EmployeeServices;
