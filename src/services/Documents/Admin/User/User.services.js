import ApiServices from "../../../api.services";

const baseUrl = "User/";

const UserServices = {

  // get role
  getRole(id) {
    return ApiServices.get(`${baseUrl}GetRole?id=${id}`);
  },
  getUserInfo() {
    return ApiServices.get(`${baseUrl}GetUserInfo`)
  },
  // update role
  updateRole(data) {
    return ApiServices.post(`${baseUrl}UpdateRole`, data);
  },

  // update role 1
  updateRole1(data) {
    return ApiServices.post(`${baseUrl}UpdateRole1`, data);
  },

  // Change EDS Command
  ChangeEDS(id) {
    return ApiServices.get(`${baseUrl}ChangeEDSCommand?SelectedUserID=${id}`);
  },

  // Create Templates Command
  CreateTemplates(id) {
    return ApiServices.get(`${baseUrl}CreateTemplatesCommand?SelectedUserID=${id}`);
  },
};

export default UserServices;
