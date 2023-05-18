import { Button, DatePicker, Form, Input, Checkbox } from "antd";
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { CSSTransition } from 'react-transition-group';
import moment from "moment";

import { Notification } from '../../../../helpers/notifications';
import Card from "../../../components/MainCard";
import OrganizationIDModal from './components/OrganizationIDModal';
import TableData from './components/TableData';
import { getListStartAction, setListFilter } from './_redux/getListSlice';
import MemorialOrder5Services from '../../../../services/Report/MemorialOrder5/MemorialOrder5.services';
import OrgSettleAccModal from './components/OrgSettleAccModal';

const MemorialOrder5 = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const reduxList = useSelector((state) => state.memorialOrder5List);

    let tableData = reduxList.listSuccessData?.rows;
    let total = reduxList.listSuccessData?.total;
    let pagination = reduxList?.paginationData;
    let filter = reduxList?.filterData;

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
                ...pagination,
                ...values,
            })
        );
    };

    const [orgIDModal, setOrgIDModal] = useState(false);
    const [orgIDParams, setOrgIDParams] = useState(null);
    const [settAccModal, setSettAccModal] = useState(false);
    const [settAccParams, setSettAccParams] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [dateInterval, setDateInterval] = useState(false);
    const [OrganizationID, setOrganizationID] = useState(null);

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                if (dateInterval) {
                    values.StartDate = values.StartDate.format("DD.MM.YYYY");
                    values.EndDate = values.EndDate.format("DD.MM.YYYY");
                } else {
                    values.StartDate = values.StartDate.format("01.MM.YYYY");
                    values.EndDate = values.EndDate.format("01.MM.YYYY");
                }
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
        if (data.id === 'OrganizationID') {
            setOrganizationID(data.ID);
        }
    };

    const onClear = (data) => {
        filterForm.setFieldsValue({
            [`${data.Name}`]: null,
            [`${data.ID}`]: null
        });
    };

    const openOrgIDModal = (values) => {
        setOrgIDParams(values);
        setOrgIDModal(true);
    };

    const openSettAccModal = (values) => {
        setSettAccParams(values);
        setSettAccModal(true);
    };

    const handleRefresh = () => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    };


    const handlePrint = () => {
        setConfirmLoading(true);
        filterForm.validateFields()
            .then(values => {
                if (dateInterval) {
                    values.StartDate = values.StartDate.format("DD.MM.YYYY");
                    values.EndDate = values.EndDate.format("DD.MM.YYYY");
                } else {
                    values.StartDate = values.StartDate.format("01.MM.YYYY");
                    values.EndDate = values.EndDate.format("01.MM.YYYY");
                }
                MemorialOrder5Services.printList({
                    ...pagination,
                    ...values,
                })
                    .then((res) => {
                        if (res.status === 200) {
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "MemorialOrder5.xlsx");
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

    const onChangeDate = (e) => {
        setDateInterval(e.target.checked)
    };

    return (
        <Card title={t("MemorialOrder5")}>
            <Fade>
                <Form
                    className='table-filter-form'
                    form={filterForm}
                    onFinish={onFinish}
                    initialValues={{
                        ...filter,
                        EndDate: moment().add(30, "days"),
                        StartDate: moment().subtract(330, "days"),
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        <Form.Item
                            // label="&zwnj;"
                            name="IsPrePayment"
                            valuePropName="checked"
                        >
                            <Checkbox onChange={onChangeDate}>
                                {t("dateInterval")}
                            </Checkbox>
                        </Form.Item>

                        {adminViewRole && (
                            <>
                                <Form.Item
                                    // label={t("OrgName")}
                                    name="OrganizationName"
                                    style={{ width: 300 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <Input
                                        readOnly
                                        placeholder={t("OrgName")}
                                        className={'addonInput'}
                                        addonAfter={
                                            <div style={{ display: 'flex', pading: '0' }}>
                                                <div
                                                    onClick={() => openOrgIDModal({
                                                        Name: 'OrganizationName',
                                                        ID: 'OrganizationID'
                                                    })}
                                                >
                                                    <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        onClear({
                                                            Name: 'OrganizationName',
                                                            ID: 'OrganizationID'
                                                        });
                                                        setOrganizationID(null);
                                                    }}
                                                >
                                                    <i className="feather icon-x" style={{ color: 'white', margin: '0 6px' }} />
                                                </div>
                                            </div>
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("OrganizationID")}
                                    name="OrganizationID"
                                    hidden={true}
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item
                            // label={t("OrgName")}
                            name="SettlementAccount"
                            style={{ width: 300 }}
                            rules={[
                                {
                                    required: true,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input
                                readOnly
                                placeholder={t("SettlementAccount")}
                                className={'addonInput'}
                                addonAfter={
                                    <div style={{ display: 'flex', pading: '0' }}>
                                        <div
                                            onClick={() => openSettAccModal({
                                                Name: 'SettlementAccount',
                                                ID: 'OrganizationsSettlementAccountID',
                                                params: { OrganizationID: OrganizationID }
                                            })}
                                        >
                                            <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                        </div>
                                        <div
                                            onClick={() => onClear({
                                                Name: 'SettlementAccount',
                                                ID: 'OrganizationsSettlementAccountID'
                                            })}
                                        >
                                            <i className="feather icon-x" style={{ color: 'white', margin: '0 6px' }} />
                                        </div>
                                    </div>
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label={t("OrganizationsSettlementAccountID")}
                            name="OrganizationsSettlementAccountID"
                            hidden={true}
                        >
                            <Input />
                        </Form.Item>

                        {/* <Form.Item name="Search">
                            <Input.Search
                                placeholder={t("name")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item> */}

                        {dateInterval ? (
                            <>
                                <Form.Item
                                    name="StartDate"
                                // label={t("StartDate")}
                                >
                                    <DatePicker
                                        format="DD.MM.YYYY"
                                        className='datepicker'
                                        placeholder={t("StartDate")}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="EndDate"
                                // label={t("EndDate")}
                                >
                                    <DatePicker
                                        format="DD.MM.YYYY"
                                        className='datepicker'
                                        placeholder={t("EndDate")}
                                    />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item
                                    name="StartDate"
                                // label={t("StartDate")}
                                >
                                    <DatePicker
                                        format="MM.YYYY" picker="month"
                                        className='datepicker'
                                        placeholder={t("StartDate")}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="EndDate"
                                // label={t("EndDate")}
                                >
                                    <DatePicker
                                        format="MM.YYYY" picker="month"
                                        className='datepicker'
                                        placeholder={t("EndDate")}
                                    />
                                </Form.Item></>
                        )}

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
                <TableData tableData={tableData} total={total} match={match} reduxList={reduxList} />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={orgIDModal}
                timeout={300}
            >
                <OrganizationIDModal
                    visible={orgIDModal}
                    params={orgIDParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setOrgIDModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={settAccModal}
                timeout={300}
            >
                <OrgSettleAccModal
                    visible={settAccModal}
                    params={settAccParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setSettAccModal(false);
                    }}
                />
            </CSSTransition>

        </Card >
    )
}

export default React.memo(MemorialOrder5);