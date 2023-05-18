import React from 'react'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, DatePicker, Form, Input, InputNumber, Radio } from "antd";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import Card from "../../../../../components/MainCard";
import { getListStartAction, setListFilter, setListPagination } from './_redux/getListSlice';
import TableData from './components/TableData';
import classes from "./ClassTitle.module.css";

const ClassTitleNew = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const reduxList = useSelector((state) => state.classTitle);

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
                values.StartYear = values.StartYear.format("YYYY");
                getList(values);
            });
    };

    const onFinish = (values) => {
        values.StartYear = values.StartYear.format("YYYY");
        getList(values);
    };

    const onChangeStatus = (e) => {
        filterForm.validateFields()
            .then(values => {
                values.StartYear = values.StartYear.format("YYYY");
                values.Status = e.target.value;
                getList(values);
            });
    }

    const refresh = () => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }

    return (
        <Card title={t("ClassTitle")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-for'
                    initialValues={{
                        StartYear: moment(filter.StartYear, 'YYYY')
                    }}
                >
                    <div className={classes.FilterWrapper}>
                        <Form.Item
                            name="StartYear"
                        // label={t("StartYear")}
                        >
                            <DatePicker format="YYYY" picker="year" />
                        </Form.Item>
                        <Form.Item name="OrgName">
                            <Input
                                // style={{ width: '100%' }}
                                placeholder={t("OrgName")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="INN">
                            <InputNumber
                                // style={{ width: '100%' }}
                                placeholder={t("inn")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Button type="primary" htmlType="submit">
                            <i className="feather icon-search" />
                        </Button>
                    </div>
                    <Form.Item name="Status">
                        <Radio.Group onChange={onChangeStatus}>
                            <Radio.Button value="0">{t('Все')}</Radio.Button>
                            <Radio.Button value="9">{t('Доставленные')}</Radio.Button>
                            <Radio.Button value="13">{t('Принятие отчеты')}</Radio.Button>
                            <Radio.Button value="10">{t('Не принятые отчеты')}</Radio.Button>
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

export default React.memo(ClassTitleNew)