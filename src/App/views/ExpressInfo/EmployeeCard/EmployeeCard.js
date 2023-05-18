import { Button, DatePicker, Form, Input, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { CSSTransition } from 'react-transition-group';
import moment from "moment";

import { Notification } from '../../../../helpers/notifications';
import Card from "../../../components/MainCard";
import EmployeeIDModal from './components/EmployeeIDModal';
import { getListStartAction, setListFilter } from './_redux/getListSlice';
import MemorialOrder5Services from '../../../../services/Report/MemorialOrder5/MemorialOrder5.services';
// import OrgSettleAccModal from './components/OrgSettleAccModal';
import EmployeeServices from "./../../../../services/References/Organizational/Employee/employee.services";
import DocumentBody from './components/DocumentBody';
import { Empty } from "antd";

const EmployeeCard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    const superAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).UserID === 22412;

    const reduxList = useSelector((state) => state.employeeCardList);
    let tableData = reduxList?.listSuccessData;
    console.log(tableData);
    let filter = reduxList?.filterData;
    let loading = reduxList?.listBegin;

    // useEffect(() => {
    //     dispatch(
    //         getListStartAction({
    //             ...pagination,
    //             ...filter,
    //         })
    //     );
    // }, [pagination, filter, dispatch]);

    const getList = (values) => {
        dispatch(setListFilter({
            ...values,
        }));
        dispatch(
            getListStartAction({
                ...values,
            })
        );
    };

    const [employeeIDModal, setEmployeeIDModal] = useState(false);
    const [employeeIDParams, setEmployeeIDParams] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                // console.log(values);
                values.StartDate = values.StartDate.format("MM.DD.YYYY");
                values.EndDate = values.EndDate.format("MM.DD.YYYY");
                getList(values);
            });
    };

    const onFinish = (values) => {
        getList(values);
    };

    const onSelect = (data) => {
        // console.log(data);
        filterForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID
        });
    };

    const onClear = (data) => {
        filterForm.setFieldsValue({
            [`${data.Name}`]: null,
            [`${data.ID}`]: null
        });
    };

    const openEmployeeIDModal = (values) => {
        setEmployeeIDParams(values);
        setEmployeeIDModal(true);
    };

    // const handleRefresh = () => {
    //     dispatch(
    //         getListStartAction({
    //             ...filter,
    //         })
    //     );
    // };


    const handlePrint = () => {
        filterForm.validateFields()
            .then(values => {
                setConfirmLoading(true);
                values.OnDate = values.StartDate.format("DD.MM.YYYY");
                values.StartDate = null;
                values.EndDate = null;
                if (superAdminViewRole) {
                    EmployeeServices.getEmployeeCardPrintForAdmin({
                        ...values,
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute("download", "ExpressInfo.xlsx");
                                document.body.appendChild(link);
                                link.click();

                                setConfirmLoading(false);
                            }
                        }).catch((err) => {
                            Notification('error', err);
                            setConfirmLoading(false);
                        })
                } else {
                    EmployeeServices.getEmployeeCardPrint({
                        ...values,
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute("download", "ExpressInfo.xlsx");
                                document.body.appendChild(link);
                                link.click();

                                setConfirmLoading(false);
                            }
                        }).catch((err) => {
                            Notification('error', err);
                            setConfirmLoading(false);
                        })
                }

            })
    }

    return (
        <Card title={t("EmployeeCard")}>
            <Fade>
                <Form
                    className='table-filter-form'
                    form={filterForm}
                    onFinish={onFinish}
                    initialValues={{
                        ...filter,
                        StartDate: moment(`01.01.${new Date().getFullYear()}`),
                        EndDate: moment(`01.01.${new Date().getFullYear()}`),
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        {superAdminViewRole ? (
                            <>
                                <Form.Item name="OrganizationINN">
                                    <Input
                                        placeholder={t("OrganizationINN")}
                                        enterButton
                                        onSearch={onSearch}
                                    />
                                </Form.Item>

                                <Form.Item name="PNFL">
                                    <Input
                                        placeholder={t("PNFL")}
                                        enterButton
                                        onSearch={onSearch}
                                    />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item
                                    // label={t("OrgName")}
                                    name="EmployeeName"
                                    style={{ width: 300 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <Input
                                        readOnly
                                        placeholder={t("EmployeeName")}
                                        className={'addonInput'}
                                        addonAfter={
                                            <div style={{ display: 'flex', pading: '0' }}>
                                                <div
                                                    onClick={() => openEmployeeIDModal({
                                                        Name: 'EmployeeName',
                                                        ID: 'EmployeeID'
                                                    })}
                                                >
                                                    <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                                </div>
                                                <div
                                                    onClick={() => onClear({
                                                        Name: 'EmployeeName',
                                                        ID: 'EmployeeID'
                                                    })}
                                                >
                                                    <i className="feather icon-x" style={{ color: 'white', margin: '0 6px' }} />
                                                </div>
                                            </div>
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("EmployeeID")}
                                    name="EmployeeID"
                                    hidden={true}
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        )}
                        <Form.Item
                            name="StartDate"
                            // label={t("startDate")}
                            rules={[{ required: true, message: t("pleaseSelect") }]}
                        >
                            <DatePicker
                                format="MM.DD.YYYY"
                                className='datepicker'
                                placeholder={t("StartDate")}
                            />
                        </Form.Item>

                        <Form.Item
                            name="EndDate"
                            // label={t("startDate")}
                            rules={[{ required: true, message: t("pleaseSelect") }]}
                        >
                            <DatePicker
                                format="MM.DD.YYYY"
                                className='datepicker'
                                placeholder={t("EndDate")}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" onClick={onSearch}>
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>

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
            </Fade >

            <Fade>
                <Spin spinning={loading} size='large'>
                    {Object.keys(tableData).length > 0 ? (
                        <DocumentBody data={tableData} />
                    ) : (
                        <Empty />
                    )}
                </Spin>
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={employeeIDModal}
                timeout={300}
            >
                <EmployeeIDModal
                    visible={employeeIDModal}
                    params={employeeIDParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setEmployeeIDModal(false);
                    }}
                />
            </CSSTransition>

        </Card >
    )
}

export default React.memo(EmployeeCard);