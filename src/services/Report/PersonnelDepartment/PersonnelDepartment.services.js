import ApiServices from "../../api.services";


const baseUrl = "PersonnelDepartment/";

const PersonnelDepartmentServices = {

    // get List
    getList(params) {
        return ApiServices.get(`${baseUrl}GetList`, params);
    },

    printList(params) {
        return ApiServices.get(`${baseUrl}Print`, { params: params, responseType: "blob" });
    },


};

export default PersonnelDepartmentServices;