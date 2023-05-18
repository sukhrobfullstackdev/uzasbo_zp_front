import React from 'react'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, DatePicker, Form, Input } from "antd";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import Card from "../../../../../components/MainCard";
import { getListStartAction, setListFilter } from './_redux/getListSlice';
import TableData from './components/TableData';

const IndexByOblast = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const reduxList = useSelector((state) => state.indexByOblastReducerList);

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

    const getList = (values) => {
        dispatch(setListFilter({
            ...values
        }));
    };

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                values.Year = values.Year.format("YYYY");
                getList(values);
            });
    };

    const onFinish = (values) => {
        values.Year = values.Year.format("YYYY");
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
        <Card title={t("IndexByOblast")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        Year: moment().add({ year: 1 })
                    }}
                >
                    <div className='main-table-filter-elements'>

                        <Form.Item
                            name="Year"
                        // label={t("StartYear")}
                        >
                            <DatePicker format="YYYY" picker="year" />
                        </Form.Item>

                        <Form.Item name="ID">
                            <Input
                                // style={{ width: '100%' }}
                                placeholder={t("id")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="Search">
                            <Input
                                // style={{ width: '100%' }}
                                placeholder={t("name")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="INN">
                            <Input
                                // style={{ width: '100%' }}    
                                placeholder={t("INN")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="main-table-filter-element">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>

                        {/* <Button type="primary" className="main-table-filter-element">
                            <Link to={`${match.path}/add`}>
                                {t("add-new")}&nbsp;
                                <i className="feather icon-plus" aria-hidden="true" />
                            </Link>
                        </Button> */}
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

export default React.memo(IndexByOblast)