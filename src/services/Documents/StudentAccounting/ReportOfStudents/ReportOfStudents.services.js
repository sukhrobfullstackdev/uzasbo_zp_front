import ApiServices from "../../../api.services";

const baseUrl = "OrderOfScholarship/";

const ReportsOfStudentsServices = {

  GetList(payload) {
    console.log(payload);
    return ApiServices.get(`${baseUrl}GetVerificationStudent`, {
      params: payload
    })
  },

  print(values) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${values.ID}&PersonnelNumber=${values.PersonnelNumber}&FullName=${values.FullName}&INN=${values.INN}&DateOfBirth=${values.DateOfBirth}&EmpType=${values.EmpType}`,
      { responseType: 'blob' }
    );
  },

  // print List
  printList(values) {
    return ApiServices.get(`${baseUrl}PrintVerificationStudent`, { params: values, responseType: 'blob' });
  },

  getEmployeeCardPrint(values) {
    return ApiServices.get(`${baseUrl}GetEmployeeCardPrint`, { params: values, responseType: 'blob' });
  },
};

export default ReportsOfStudentsServices;
