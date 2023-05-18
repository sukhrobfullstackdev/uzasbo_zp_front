import { createSlice } from "@reduxjs/toolkit";
import { initialMainTablePagination } from "../../../../../../helpers/helpers";

const initialState = {
  listBegin: false,
  dataBegin: false,
  listSuccess: false,
  dataSuccess: false,
  listSuccessData: {},
  listSuccessById: {},
  listFailData: {},
  listFailById: {},
  listFail: false,
  dataFail: false,
  paginationData: {
    ...initialMainTablePagination,
    OrderType: null,
    SortColumn: null,
  },
  filterType: null,
};

const getListSlice = createSlice({
  name: "LimitBySubCalculationKind",
  initialState,
  reducers: {
    getListStartAction: (state) => {
      state.listBegin = true;
    },
    getDataStart: (state) => {
      state.dataBegin = true;
    },
    getDataSuccess: (state, action) => {
      state.dataBegin = false;
      state.dataSuccess = true;
      state.listSuccessById = action.payload;
      state.dataFail = false;
    },
    getListSuccess: (state, action) => {
      state.listBegin = false;
      state.listSuccess = true;
      state.listSuccessData = action.payload;
      state.listFail = false;
    },
    setListPagination: (state, action) => {
      state.paginationData = {
        ...state.paginationData,
        PageNumber: action.payload?.PageNumber
          ? action.payload.PageNumber
          : initialState.paginationData.PageNumber,
        PageLimit: action.payload?.PageLimit
          ? action.payload.PageLimit
          : initialState.paginationData.PageLimit,
        OrderType: action.payload?.OrderType,
        SortColumn: action.payload?.SortColumn,
      };
    },
    setListFilter: (state, action) => {
      state.filterData = action.payload;
      state.paginationData = initialMainTablePagination;
    },
    setListFilterType: (state, action) => {
      state.filterType = action.payload.filterType;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
    getListFail: (state, action) => {
      state.listBegin = false;
      state.listSuccess = false;
      state.listSuccessData = [];
      state.listFailData = action.payload;
      state.listFail = true;
    },
    getDataFail: (state, action) => {
      state.dataBegin = false;
      state.dataSuccess = false;
      state.dataFail = true;
      state.listSuccessById = [];
      state.listFailById = action.payload;
    },
  },
});

// Actions
export const {
  getListStartAction,
  getListSuccess,
  getListFail,
  setListPagination,
  setListFilterType,
  setListFilter,
  getDataStart,
  getDataSuccess,
  getDataFail,
} = getListSlice.actions;

// Reducer
const LimitBySubCalcReducer = getListSlice.reducer;
export default LimitBySubCalcReducer;
