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
import ClassTitleServices from '../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitle.services';

const { Option } = Select;

const DistributionOfLessonHoursNew = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const location = useLocation();

    const reduxList = useSelector((state) => state.distributionOfLessonHoursList);

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

    const [ClassNumberList, setClassNumberList] = useState([]);

    useEffect(() => {
        const getFilterParamData = async () => {
            const [ClassNumberList] = await Promise.all([
                ClassTitleServices.getAll(moment().format("YYYY")),

            ]);
            setClassNumberList(ClassNumberList.data);
        }
        getFilterParamData().catch(err => Notification('error', err))
    }, []);

    const getList = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        dispatch(setListFilter({
            [values?.filterType]: values?.Search,
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
        <Card title={t("DistributionOfLessonHours")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        StartYear: moment(filter.StartYear, 'YYYY')
                    }}
                >
                    <div className='main-table-filter-elements'>

                        <Form.Item
                            name="StartYear"
                        // label={t("StartYear")}
                        >
                            <DatePicker format="YYYY" picker="year" />
                        </Form.Item>
                        <Form.Item
                            lable={t("search")}
                            name="Search"
                        >
                            <Input.Search
                                placeholder={t("fio")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>
                        <Form.Item
                            name="ClassTitleTableID"
                        // label={t("number")}
                        >
                            <Select
                                allowClear
                                placeholder={t("number")}
                                style={{ width: 150 }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>

                                {ClassNumberList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="main-table-filter-element">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>


                        <Button type="primary" className="main-table-filter-element">
                            <Link to={`${match.path}/add`}>
                                {t("add-new")}&nbsp;
                                <i className="feather icon-plus" aria-hidden="true" />
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

export default React.memo(DistributionOfLessonHoursNew)