import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Form, Button, DatePicker, Select, InputNumber } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import Card from "../../../../components/MainCard";
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from "../../../../../services/Helper/helper.services";

const { Option } = Select;

const BasicEducationalPlan = ({ match }) => {
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    const { t } = useTranslation();
    const location = useLocation();
    const [filterForm] = Form.useForm();
    const dispatch = useDispatch();

    const tableList = useSelector((state) => state.basicEduPlanGetList);

    let tableData = tableList.listSuccessData?.rows;
    let total = tableList.listSuccessData?.total;
    let pagination = tableList?.paginationData;
    let filter = tableList?.filterData;
    // const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

    const [filterType, setFilterType] = useState(tableList?.filterType);
    const [BLHGType, setBLHGType] = useState([]);

    useEffect(() => {
        const getFilterParamData = async () => {
            const [blhgList] = await Promise.all([
                HelperServices.getBLHGTypeList(),
            ]);
            setBLHGType(blhgList.data);
        }
        getFilterParamData().catch(err => Notification('error', err))
    }, []);

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const filterTypeHandler = (value) => {
        setFilterType(value);
    }

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        dispatch(setListFilter({
            Status: values?.Status,
            [values?.filterType]: values?.Search
        }));
    };

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                onFinish(values);
            })
    };

    return (
        <Card title={t("BasicEducationalPlan")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        ...filter,
                        filterType: filterType,
                        // Search: filterSearchVal,
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        <Form.Item
                            // name="filterType"
                            label={t("Filter Type")}
                        >
                            <Select
                                allowClear
                                style={{ width: 180, marginBottom: 0 }}
                                placeholder={t("Filter Type")}
                                onChange={filterTypeHandler}
                            >
                                <Option value="ID">{t('id')}</Option>
                                <Option value="Search">{t('Наименование')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            // label={t("search")}
                            name="Search"
                        >
                            <Input.Search
                                placeholder={t("search")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        <Form.Item
                            // label={t("BLHGType")}
                            name="BLHGTypeID"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("BLHGType")}
                                style={{ width: 200, marginBottom: 0 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {BLHGType.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary">
                                <Link to={`${location.pathname}/add`}>
                                    {t("add-new")}&nbsp;
                                    <i className="fa fa-plus" aria-hidden="true" />
                                </Link>
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Fade>
            <Fade>
                <GetListTable
                    tableData={tableData} total={total} match={match}
                    tableList={tableList} adminViewRole={adminViewRole}
                />
            </Fade>
        </Card >
    )
}

export default React.memo(BasicEducationalPlan);