import ApiServices from "../../api.services";


const baseUrl = "MemorialOrder5/";

const MemorialOrder5Services = {

    getList(payload) {
        return ApiServices.get(`${baseUrl}GetList`, { params: payload });
    },

    printList(params) {
        return ApiServices.get(`${baseUrl}Print`, { params: params, responseType: "blob" });
    },

};

export default MemorialOrder5Services;