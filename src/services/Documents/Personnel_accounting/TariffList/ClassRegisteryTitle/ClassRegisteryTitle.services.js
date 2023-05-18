import ApiServices from "../../../../api.services";

const baseUrl = "ClassRegisteryTitle/";

const ClassRegisteryTitleServices = {
    getList(payload) {
        return ApiServices.get(`${baseUrl}GetList`, {
            params: payload
        })
    },

    getById(id) {
        return ApiServices.get(`${baseUrl}Get?id=${id}`);
    },

    postData(data) {
        return ApiServices.post(`${baseUrl}Update`, data);
    },

    delete(id) {
        return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
    },

    Accept(id) {
        return ApiServices.post(`${baseUrl}Accept?id=${id}`);
    },

    Cancel(id) {
        return ApiServices.post(`${baseUrl}Cancel?id=${id}`);
    },

    PrintById(id) {
        return ApiServices.get(`${baseUrl}Print?id=${id}`, { responseType: "blob" });
    },

};

export default ClassRegisteryTitleServices;
