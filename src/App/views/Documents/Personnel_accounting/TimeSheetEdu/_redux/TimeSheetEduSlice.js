import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const defaultDate = {
  StartDate: moment().subtract(30, "days").format("DD.MM.YYYY"),
  EndDate: moment().add(30, "days").format("DD.MM.YYYY"),
}

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
    ...defaultDate
  },
  filterType: "ID",
  filterData: {
    EmployeeTypeID: null,
    ...defaultDate
  },
  listFail: false,
};

const timeSheetEduSlice = createSlice({
  name: "timeSheetEdu",
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
      state.filterData = action.payload
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
} = timeSheetEduSlice.actions;

// Reducer
const timeSheetEduListReducer = timeSheetEduSlice.reducer;
export default timeSheetEduListReducer;