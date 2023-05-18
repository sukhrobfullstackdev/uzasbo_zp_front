import React from 'react'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button, DatePicker, Form, Input, Select } from "antd";
import { useState } from 'react';
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import Card from "../../../../components/MainCard";
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';
import TableData from './components/TableData';

const { Option } = Select;

const SickListNew = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const location = useLocation();

    const reduxList = useSelector((state) => state.sickList);

    let tableData = reduxList.listSuccessData?.rows;
    let total = reduxList.listSuccessData?.total;
    let pagination = reduxList?.paginationData;
    let filter = reduxList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const [orgSettleAcc, setOrgSettleAcc] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [positionList, setPositionList] = useState([]);

    useEffect(() => {
        const getFilterParamData = async () => {
            const [orgSettleAcc, statusList, departmentList, positionList] = await Promise.all([
                HelperServices.getOrganizationsSettlementAccountList(),
                HelperServices.getStatusList(),
                HelperServices.getAllDepartmentList(),
                HelperServices.GetListOfPositionList(),

            ]);
            setOrgSettleAcc(orgSettleAcc.data);
            setStatusList(statusList.data);
            setDepartmentList(departmentList.data);
            setPositionList(positionList.data);
        }
        getFilterParamData().catch(err => Notification('error', err))
    }, []);

    const getList = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        dispatch(setListFilter({
            PageNumber: values?.PageNumber,
            PageLimit: values?.PageLimit,
            [values?.filterType]: values?.Search,
            StartDate: values?.StartDate,
            EndDate: values?.EndDate,
            SettleCode: values?.SettleCode,
            Status: values?.Status,
            DprName: values?.DprName,
        }));
    };

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                values.StartDate = values.StartDate.format("01.01.YYYY");
                values.EndDate = values.EndDate.format("DD.MM.YYYY");
                getList(values);
            });
    };

    const onFinish = (values) => {
        values.StartDate = values.StartDate.format("01.01.YYYY");
        values.EndDate = values.EndDate.format("DD.MM.YYYY");
        getList(values);
    };

    const refresh = () => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }

    return (
        <Card title={t("SickList")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        EndDate: moment().add(30, "days"),
                        StartDate: moment().subtract(30, "days"),
                        filterType: 'Search',
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        <Form.Item
                            name="filterType"
                            label={t("Filter Type")}
                        >
                            <Select
                                allowClear
                                style={{ width: 160 }}
                                placeholder={t("Filter Type")}
                            >
                                <Option value="ID">{t('id')}</Option>
                                <Option value="PersonnelNumber">{t('personnelNumber')}</Option>
                                <Option selected value="Search">{t('FullName')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            lable={t("search")}
                            name="Search"
                        >
                            <Input.Search
                                placeholder={t("search")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        <Form.Item
                            name="StartDate"
                            label={t("startDate")}>
                            <DatePicker format="01.01.YYYY" className='datepicker' />
                        </Form.Item>

                        <Form.Item
                            name="EndDate"
                            label={t("endDate")}>
                            <DatePicker format="DD.MM.YYYY" className='datepicker' />
                        </Form.Item>

                        <Form.Item
                            name="SettleCode"
                            label={t("SettleCode")}
                        >
                            <Select
                                allowClear
                                placeholder={t("SettleCode")}
                                style={{ width: 250 }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {orgSettleAcc.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="Status"
                            label={t("Status")}
                        >
                            <Select
                                allowClear
                                placeholder={t("Status")}
                                style={{ width: 200 }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="DprName"
                            label={t("DprName")}
                        >
                            <Select
                                allowClear
                                placeholder={t("DprName")}
                                style={{ width: 200 }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                            </Select>
                        </Form.Item>

                        {/* <Form.Item
                            name="psList"
                            label={t("psList")}
                        >
                            <Select
                            allowClear
                            placeholder={t("psList")}
                            style={{ width: 200 }}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            >
                            {positionList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                            </Select>
                        </Form.Item> */}
                        <Button type="primary" htmlType="submit" className="main-table-filter-element">
                            <i className="feather icon-refresh-ccw" />
                        </Button>

                        <Button type="primary" className="main-table-filter-element">
                            <Link to={`${match.path}/add`}>
                                <i className="fa fa-plus" aria-hidden="true" />
                            </Link>
                        </Button>
                        
                    </div>
                </Form>
            </Fade>
            <Fade>
                <TableData
                    tableData={tableData} total={total} match={match}
                    reduxList={reduxList} refresh={refresh}
                />
            </Fade>
        </Card>
    )
}

export default React.memo(SickListNew)