import { createSlice } from "@reduxjs/toolkit";

const defaultData = {
    PageNumber: 1,
    PageLimit: 300,
}

const initialState = {
    listBegin: false,
    listSuccess: false,
    listSuccessData: {},
    listFailData: {},
    paginationData: {
        ...defaultData,
        OrderType: null,
        SortColumn: null,
    },
    filterType: null,
    filterData: {
        showWorking: null,
        showWithoutPhoneNumber: null,
        isChecked: null,
        showall: true,
    },
    listFail: false,
};

const personnelDepartmentSlice = createSlice({
    name: "personnelDepartment",
    initialState,
    reducers: {
        getListStartAction: (state) => {
            state.listBegin = true;
        },
        getListSuccess: (state, action) => {
            state.listBegin = false;
            state.listSuccess = true;
            state.listSuccessData = action.payload;
            state.listFail = false;
        },
        setListPagination: (state, action) => {
            state.paginationData = {
                PageNumber: action.payload.PageNumber ? action.payload.PageNumber : state.paginationData.PageNumber,
                PageLimit: action.payload.PageLimit ? action.payload.PageLimit : state.paginationData.PageLimit,
                OrderType: action.payload.OrderType,
                SortColumn: action.payload.SortColumn,
            }
        },
        setListFilterType: (state, action) => {
            state.filterType = action.payload.filterType
        },
        setListFilter: (state, action) => {
            state.filterData = {
                showWorking: action.payload.showWorking,
                showWithoutPhoneNumber: action.payload.showWithoutPhoneNumber,
                isChecked: action.payload.isChecked,
                DivisionID: action.payload.DivisionID,
                DepartmentID: action.payload.DepartmentID,
                ...action.payload,
            };
            state.paginationData = {
                ...defaultData,
            }
        },
        getListFail: (state, action) => {
            state.listBegin = false;
            state.listSuccess = false;
            state.listSuccessData = [];
            state.listFailData = action.payload;
            state.listFail = true;
        }
    }
});

// Actions
export const {
    getListStartAction, getListSuccess, getListFail,
    setListPagination, setListFilterType, setListFilter
} = personnelDepartmentSlice.actions;

// Reducer
const personnelDepartmentListReducer = personnelDepartmentSlice.reducer;
export default personnelDepartmentListReducer;