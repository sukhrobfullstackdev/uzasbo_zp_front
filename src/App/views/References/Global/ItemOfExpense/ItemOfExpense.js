
import {Form, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
// import { Link } from 'react-router-dom';

// import { Notification } from '../../../../../helpers/notifications';
import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const ItemOfExpense = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    // const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const reduxList = useSelector((state) => state.itemOfExpenseList);

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
    }, [pagination, filter, dispatch]);

    const getList = (values) => {
        dispatch(setListFilter({
            Search: values?.Search,
        }));
    };



    const onSearch = (Search) => {
        filterForm.validateFields()
            .then(values => {
                getList(values);
            });
    };

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    return (
        <Card title={t("ItemOfExpense")}>
            <Fade>
                <div className="table-top">
                    <Form
                        className='table-filter-form'
                        form={filterForm}
                        onFinish={onFinish}
                        initialValues={{
                            ID: filter?.ID,
                            Search: filter?.Search,
                        }}
                    >
                        <div className="form-elements">

                            <Form.Item name="Search">
                                <Input.Search
                                    placeholder={`${t("Code3")}, ${t("name")}`}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>

                            {/* {adminViewRole && (
                                <Button type="primary">
                                    <Link to={`${match.path}/add`}>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Link>
                                </Button>
                            )} */}

                        </div>
                    </Form>
                </div>
            </Fade>

            <Fade>
                <TableData tableData={tableData} reduxList={reduxList} total={total} match={match} />
            </Fade>
        </Card>
    )
}

export default React.memo(ItemOfExpense);