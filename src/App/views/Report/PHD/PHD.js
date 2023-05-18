import { Button, Form, Input, InputNumber, Select } from "antd";
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { CSSTransition } from 'react-transition-group';

import HelperServices from "../../../../services/Helper/helper.services";
import Card from "../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const PHD = (match) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();

    const reduxList = useSelector((state) => state.PHDList);
    console.log(reduxList);

    let tableData = reduxList?.listSuccessData;
    let total = reduxList?.listSuccessData?.total;
    let pagination = reduxList?.paginationData;
    let filter = reduxList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter, dispatch]);

    const getList = (values) => {
        dispatch(setListFilter({
            ID: values?.ID,
            OrgTypeID: values?.OrgTypeID,
            Search: values?.Search,
        }));
    };

    const onSearch = (Search) => {
        filterForm.validateFields()
            .then(values => {
                // console.log(values);
                // dispatch(setListFilterType({
                //     filterType: filterType,
                // }));
                getList(values);
            });
    };

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    const handleRefresh = () => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    };

    return (
        <Card title={t("PHD")}>
            <Fade>
                <Form
                    className='table-filter-form'
                    form={filterForm}
                    onFinish={onFinish}
                    initialValues={{
                        ID: filter?.ID,
                        OrgTypeID: filter?.OrgTypeID,
                        Search: filter?.Search,
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        {/* <Form.Item name="filterType">
                                <Select
                                    allowClear
                                    style={{ width: 180 }}
                                    placeholder={t("Filter Type")}
                                    onChange={filterTypeHandler}
                                >
                                    <Option value="Search">{t("name")}</Option>
                                    <Option value="Type">{t("type")}</Option>
                                </Select>
                            </Form.Item> */}

                        <Form.Item name="ID">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder={t("id")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="Search">
                            <Input.Search
                                placeholder={t("name")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        {/* <Button type="primary" htmlType="submit" onClick={handleRefresh}>
                                <i className="feather icon-refresh-ccw" />
                            </Button> */}

                    </div>
                </Form>
            </Fade>

            <Fade>
                <TableData
                    tableData={tableData} total={total} match={match}
                    reduxList={reduxList}
                />
            </Fade>
        </Card>
    )
}

export default React.memo(PHD)