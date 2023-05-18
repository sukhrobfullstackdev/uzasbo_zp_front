import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listBegin: false,
    listSuccess: false,
    listSuccessData: {},
    listFailData: {},
    paginationData: {
        PageNumber: 1,
        PageLimit: 10,
        OrderType: null,
        SortColumn: null,
    },
    filterType: null,
    filterData: {
        EmployeeTypeID: null,
    },
    listFail: false,
};

const reportsOfStudentsSlice = createSlice({
    name: "ReportsOfStudents",
    initialState,
    reducers: {
        getListStartAction: (state, action) => {
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
                EmployeeTypeID: action.payload.EmployeeTypeID ? action.payload.EmployeeTypeID : state.paginationData.EmployeeTypeID,
                ...action.payload
            }
            state.paginationData = {
                PageNumber: 1,
                PageLimit: 10,
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
} = reportsOfStudentsSlice.actions;

// Reducer
const reportsOfStudentsListReducer = reportsOfStudentsSlice.reducer;
export default reportsOfStudentsListReducer;