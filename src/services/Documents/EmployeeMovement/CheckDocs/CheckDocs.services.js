import ApiServices from "../../../api.services";

const baseUrl = "CheckSalaryDocuments/";

const CheckDocsServices = {
  getDocs(month, year, inUzbek) {
    return ApiServices.get(`${baseUrl}CheckSalaryDocuments?Month=${month}&Year=${year}&InUzbek=${inUzbek}`);
  },
};

export default CheckDocsServices;
