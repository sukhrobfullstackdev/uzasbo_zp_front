import React from 'react'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import { useState } from 'react';
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import Card from "../../../../../components/MainCard";
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';
import { Notification } from '../../../../../../helpers/notifications';
import TableData from './components/TableData';
import HelperServices from '../../../../../../services/Helper/helper.services';

const { Option } = Select;

const ClassRegisteryTitle = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const location = useLocation();

    const reduxList = useSelector((state) => state.classRegisteryTitleList);

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

    // const [statusList, setStatusList] = useState([]);

    // useEffect(() => {
    //     const getFilterParamData = async () => {
    //         const [statusList] = await Promise.all([
    //             HelperServices.getStatusList(),

    //         ]);
    //         setStatusList(statusList.data);
    //     }
    //     getFilterParamData().catch(err => Notification('error', err))
    // }, []);

    const getList = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        dispatch(setListFilter({
            // PageNumber: values?.PageNumber,
            // PageLimit: values?.PageLimit,
            [values?.filterType]: values?.Search,
            // StartDate: values?.StartDate,
            // EndDate: values?.EndDate,
            // SettleCode: values?.SettleCode,
            // Status: values?.Status,
            // DprName: values?.DprName,
            ...values
        }));
    };

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                values.StartYear = values.StartYear.format("YYYY");
                getList(values);
            });
    };

    const onFinish = (values) => {
        values.StartYear = values.StartYear.format("YYYY");
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
        <Card title={t("ClassRegisteryTitle")}>
            <Fade>
                <Form
                    // layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-for'
                    initialValues={{
                        StartYear: moment(filter.StartYear, 'YYYY'),
                    }}
                >
                    <div style={{display: 'flex',}}>
                        {/* <Form.Item
                            name="filterType"
                            label={t("Filter Type")}
                        >
                            <Select
                                allowClear
                                style={{ width: 180 }}
                                placeholder={t("Filter Type")}
                            >
                                <Option value="Code">{t('id')}</Option>
                                <Option value="Search">{t('name')}</Option>
                            </Select>
                        </Form.Item> */}

                        {/* <Form.Item
                            lable={t("search")}
                            name="Search"
                        >
                            <Input.Search
                                placeholder={t("search")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item> */}

                        <Form.Item
                            name="StartYear"
                            label={t("StartYear")}>
                            <DatePicker format="YYYY" picker="year" />
                        </Form.Item>

                        {/* <Form.Item
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
                        </Form.Item> */}

                        <Button type="primary" htmlType="submit" className="main-table-filter-element">
                            <i className="feather icon-search" />
                        </Button>

                        {/* <Button type="primary" className="main-table-filter-element">
                            <Link to={`${match.path}/add`}>
                                {t("add-new")}&nbsp;
                                <i className="fa fa-plus" aria-hidden="true" />
                            </Link>
                        </Button> */}
                    </div>
                    <Form.Item name="StatusID">
                            <Radio.Group defaultValue="0">
                                <Radio.Button onClick={() => { setTimeout(() => { onSearch() }, 0) }} value="0">{t('Все')}</Radio.Button>
                                <Radio.Button onClick={() => { setTimeout(() => { onSearch() }, 0) }} value="9">{t('Доставленные')}</Radio.Button>
                                <Radio.Button onClick={() => { setTimeout(() => { onSearch() }, 0) }} value="13">{t('Принятие отчоты')}</Radio.Button>
                                <Radio.Button onClick={() => { setTimeout(() => { onSearch() }, 0) }} value="10">{t('Не принятые отчеты')}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
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

export default React.memo(ClassRegisteryTitle)