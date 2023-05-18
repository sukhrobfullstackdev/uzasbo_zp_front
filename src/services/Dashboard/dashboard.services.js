import ApiServices from '../api.services';

// const baseUrl = '/Dashboard';
const baseUrl = '/OrganizationStatistics';

const DashboardServices = {
  // get Verified PersonList
  getVerifiedPersonList() {
    return ApiServices.get(`${baseUrl}/GetUnverifiedPersonList`);
  },

  // get phone number list
  getPhoneNumberList() {
    return ApiServices.get(`${baseUrl}/GetPersonPhoneNumberList`);
  },

  getOrganizationDashboardInfo() {
    return ApiServices.get(`${baseUrl}/GetOrganizationsDashboardInfo`);
  },
  getSalaryDashboardInfo() {
    return ApiServices.get(`${baseUrl}/GetSalaryDashboardInfo`);
  },
  getDashboardMinimalSalary() {
    return ApiServices.get(`${baseUrl}/GetDashboardMinimalSalary`);
  },
  getErrorList() {
    return ApiServices.get(`${baseUrl}/GetUserErrorList`);
  }
}

export default DashboardServices;