import { createSlice } from "@reduxjs/toolkit";
import { initialMainTableDate, initialMainTablePagination } from "../../../../../../helpers/helpers";

const initialState = {
  listBegin: true,
  listSuccess: false,
  listSuccessData: {},
  listFailData: {},
  listFail: false,
  mainLoader: false,
  paginationData: {
    ...initialMainTablePagination,
    OrderType: null,
    SortColumn: null,
    ...initialMainTableDate
  },
  filterType: null,
  filterData: {
    ...initialMainTableDate
  },
};

const getListSlice = createSlice({
  name: "PayrollOfPlasticCardSheetGetList",
  initialState,
  reducers: {
    getListStartAction: () => {},
    getListSuccess: (state, action) => {
      state.listBegin = false;
      state.listSuccess = true;
      state.listSuccessData = action.payload;
      state.listFail = false;
    },
    setListPagination: (state, action) => {
      state.paginationData = {
        ...state.paginationData,
        PageNumber: action.payload?.PageNumber ? action.payload.PageNumber : initialState.paginationData.PageNumber,
        PageLimit: action.payload?.PageLimit ? action.payload.PageLimit : initialState.paginationData.PageLimit,
        OrderType: action.payload?.OrderType,
        SortColumn: action.payload?.SortColumn,
      }
      state.listBegin = true;
    },
    setListFilter: (state, action) => {
      state.filterData = action.payload
      state.paginationData = initialMainTablePagination
      state.listBegin = true;
    },
    setListFilterType: (state, action) => {
      state.filterType = action.payload.filterType
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload
    },
    getListFail: (state, action) => {
      state.listBegin = false;
      state.listSuccess = false;
      state.listSuccessData = [];
      state.listFailData = action.payload;
      state.listFail = true;
    },
    setMainLoader: (state) => {
      state.mainLoader = !state.mainLoader;
    }
  }
});

// Actions
export const {
  getListStartAction, getListSuccess, getListFail,
  setListPagination, setListFilterType, setFilterData, setListFilter, setMainLoader
} = getListSlice.actions;

// Reducer
const payrollOfPlasticCardSheetReducer = getListSlice.reducer;
export default payrollOfPlasticCardSheetReducer;