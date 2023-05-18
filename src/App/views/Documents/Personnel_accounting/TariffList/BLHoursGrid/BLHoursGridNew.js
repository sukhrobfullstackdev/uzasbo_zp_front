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
import BLHoursGridServices from '../../../../../../services/Documents/Personnel_accounting/TariffList/BLHoursGrid/BLHoursGrid.services';

const { Option } = Select;

const BLHoursGridNew = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const location = useLocation();

    const reduxList = useSelector((state) => state.bLHoursGridList);

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
    const [ClassLangNameList, setClassLangNameList] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        const getFilterParamData = async () => {
            const [ClassNumberList, ClassLangNameList] = await Promise.all([
                HelperServices.getClassNumberList(),
                HelperServices.getClassLanguageList(),

            ]);
            setClassNumberList(ClassNumberList.data);
            setClassLangNameList(ClassLangNameList.data);
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

    const handlePrint = () => {
        setConfirmLoading(true);
        filterForm.validateFields()
            .then(values => {
                values.StartYear = values.StartYear.format("YYYY");
                BLHoursGridServices.printByDivide(values.StartYear )
                    .then((res) => {
                        if (res.status === 200) {
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "BLHoursGridForClass.xlsx");
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
        <Card title={t("BLHoursGrid")}>
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

                        <Button
                            type="primary"
                            loading={confirmLoading}
                            onClick={handlePrint}
                            className="main-table-filter-element"
                        >
                            <i className="feather icon-printer" />
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

export default React.memo(BLHoursGridNew)