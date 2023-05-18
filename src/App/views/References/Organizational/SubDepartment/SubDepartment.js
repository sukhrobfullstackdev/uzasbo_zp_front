import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Form, Button, Select } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import Card from "../../../../components/MainCard";
// import { Notification } from '../../../../../helpers/notifications';

const { Option } = Select;

const Department = ({ match }) => {
    // const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    const { t } = useTranslation();
    const location = useLocation();
    const [filterForm] = Form.useForm();
    const dispatch = useDispatch();

    const tableList = useSelector((state) => state.SubDepartmentList);

    let tableData = tableList.listSuccessData?.rows;
    let total = tableList.listSuccessData?.total;
    let pagination = tableList?.paginationData;
    let filter = tableList?.filterData;

    const [filterType, setFilterType] = useState(tableList?.filterType);

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
        <Card title={t("SubDepartment")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        ...filter,
                        filterType: filterType,
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        <Form.Item
                            name="filterType"
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
                            name="Search"
                        >
                            <Input.Search
                                placeholder={t("search")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary">
                                <Link to={`${location.pathname}/add`}>
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
                    tableList={tableList} 
                    // adminViewRole={adminViewRole}
                />
            </Fade>
        </Card >
    )
}

export default React.memo(Department);