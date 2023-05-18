import React, { useEffect, useState } from 'react'
import { Fade } from "react-awesome-reveal";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, DatePicker, Form, Input, Select, Tooltip } from 'antd';
import moment from "moment";

import HelperServices from "../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../helpers/notifications";
import Card from "../../../../components/MainCard";
import { Link } from 'react-router-dom';
import TableTimeSheet from './components/TableTimeSheet';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/TimeSheetSlice';
import TimeSheetServices from '../../../../../services/Documents/Personnel_accounting/TimeSheet/TimeSheet.services';

const { Option } = Select;

const NewTimeSheet = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const timeSheetList = useSelector((state) => state.timeSheetList);

    let tableData = timeSheetList.listSuccessData?.rows;
    let total = timeSheetList.listSuccessData?.total;
    let pagination = timeSheetList?.paginationData;
    let filter = timeSheetList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const [filterType, setFilterType] = useState(timeSheetList.filterType);

    const [orgSettleAccList, setOrgSettleAccList] = React.useState([]);
    const [statusList, setStatusList] = React.useState([]);
    const [departmentList, setDepartmentList] = React.useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const orgSettleAcc = await HelperServices.getOrganizationsSettlementAccountList();
            const stsList = await HelperServices.getStatusList();
            const dpList = await HelperServices.getAllDepartmentList();
            setOrgSettleAccList(orgSettleAcc.data);
            setStatusList(stsList.data);
            setDepartmentList(dpList.data);
        };
        fetchData().catch(err => {
            Notification('error', err);
        });
    }, []);

    const getList = (values) => {
        dispatch(setListFilter({
            SettleCode: values?.SettleCode,
            Status: values?.Status,
            DprName: values?.DprName,
            [values?.filterType]: values?.Search?.trim(),
            StartDate: values?.StartDate,
            EndDate: values?.EndDate,
        }));
    };

    const filterTypeHandler = (value) => {
        filterForm.setFieldsValue({ Search: null });
        setFilterType(value);
    };

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                values.StartDate = values.StartDate.format("DD.MM.YYYY");
                values.EndDate = values.EndDate.format("DD.MM.YYYY");
                dispatch(setListFilterType({
                    filterType: filterType,
                }));
                getList(values);
            });
    };

    const onFinish = (values) => {
        values.StartDate = values.StartDate.format("DD.MM.YYYY");
        values.EndDate = values.EndDate.format("DD.MM.YYYY");
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    const handlePrint = () => {
        filterForm.validateFields()
            .then(values => {
                setConfirmLoading(true);
                values.StartDate = values.StartDate.format("DD.MM.YYYY");
                values.EndDate = values.EndDate.format("DD.MM.YYYY");
                TimeSheetServices.printTimeSheetByDate({
                    StartDate: values.StartDate,
                    EndDate: values.EndDate,
                })
                    .then((res) => {
                        if (res.status === 200) {
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "TimeSheetByDate.xlsx");
                            document.body.appendChild(link);
                            link.click();

                            setConfirmLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setConfirmLoading(false);
                    })
            })
    }

    return (
        <Card title={t("TimeSheet")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        filterType: filterType,
                        Search: filter[`${filterType}`],
                        SettleCode: filter.SettleCode,
                        Status: filter.Status,
                        DprName: filter.DprName,
                        StartDate: moment(filter.StartDate, 'DD.MM.YYYY'),
                        EndDate: moment(filter.EndDate, 'DD.MM.YYYY'),
                    }}
                >
                    <div className='main-table-filter-wrapper'>
                        <Form.Item
                            name="filterType"
                            label={t("filterType")}
                        >
                            <Select
                                allowClear
                                style={{ width: 120 }}
                                placeholder={t("Filter Type")}
                                onChange={filterTypeHandler}
                            >
                                <Option value="ID">{t('id')}</Option>
                                <Option value="Number">{t('number')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t("search")}
                            name="Search"
                        >
                            <Input.Search
                                enterButton
                                style={{ width: 150 }}
                                placeholder={t("search")}
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        <Form.Item
                            name="StartDate"
                            label={t("startDate")}
                        >
                            <DatePicker format="DD.MM.YYYY" className='datepicker' />
                        </Form.Item>

                        <Form.Item
                            name="EndDate"
                            label={t("endDate")}
                        >
                            <DatePicker format="DD.MM.YYYY" className='datepicker' />
                        </Form.Item>

                        <Form.Item
                            name="SettleCode"
                            label={t("SettleCode")}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("SettleCode")}
                                className='settle-code-w'
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {orgSettleAccList.map(item => <Option key={item.ID}
                                    value={item.ID}>{item.Code}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="Status"
                            label={t("Status")}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("Status")}
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {statusList.map(item => <Option key={item.ID}
                                    value={item.ID}>{item.DisplayName}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="DprName"
                            label={t("DprName")}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("DprName")}
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {departmentList.map(item => <Option key={item.ID}
                                    value={item.ID}>{item.ShortName}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Tooltip title={t("add-new")}>
                                <Button type="primary">
                                    <Link to={`${match.path}/add`}>
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </Tooltip>

                        </Form.Item>

                        <Tooltip title={t("printByDate")}>
                            <Button
                                type="primary"
                                loading={confirmLoading}
                                onClick={handlePrint}
                                className="main-table-filter-element"
                            >
                                <i className="feather icon-printer" />
                            </Button>
                        </Tooltip>
                    </div>
                </Form>
            </Fade>

            <Fade>
                <TableTimeSheet tableData={tableData} startDate={filterForm.getFieldValue('StartDate')} total={total} match={match} />
            </Fade>
        </Card>
    )
}

export default React.memo(NewTimeSheet);