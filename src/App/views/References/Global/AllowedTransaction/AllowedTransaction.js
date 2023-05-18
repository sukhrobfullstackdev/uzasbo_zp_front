import React, { useEffect } from 'react'
import {Form, Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';

// import { Notification } from '../../../../../helpers/notifications';
import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const AllowedTransaction = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    // const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const reduxList = useSelector((state) => state.allowedTransactionList);

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
        <Card title={t("Allowed Transaction")}>
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
                                    placeholder={`${t("Search")}`}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Link to={`${match.path}/add`}>
                                    <Button type="primary" disabled>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Button>
                                </Link>
                            </Form.Item>


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

export default React.memo(AllowedTransaction);