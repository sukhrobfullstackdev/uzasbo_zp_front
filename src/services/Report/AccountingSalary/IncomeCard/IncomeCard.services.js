import ApiServices from "../../../api.services";


const baseUrl = "IncomeCard/";

const IncomeCardServices = {

    getList(payload) {
        return ApiServices.get(`${baseUrl}GetIncomeCard`, { params: payload });
    },

    printList(params) {
        return ApiServices.get(`${baseUrl}GetIncomeCardPrint`, { params: params, responseType: "blob" });
    },

};

export default IncomeCardServices;