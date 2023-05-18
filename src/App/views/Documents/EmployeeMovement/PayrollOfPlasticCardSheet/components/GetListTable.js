import React, { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Space, Tooltip, Form, Modal, Select, Menu, Dropdown } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";
import { Buffer } from 'buffer';
import { CSSTransition } from 'react-transition-group';

import { setListPagination, getListStartAction, setMainLoader } from '../_redux/getListSlice';
import PayrollOfPlasticCardSheetServices from "../../../../../../services/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/PayrollOfPlasticCardSheet.services";
import { Notification } from '../../../../../../helpers/notifications';
import '../../../../../../helpers/prototypeFunctions'
import { fillCertKeys, fillPfxs, apiKey } from '../../../../../../helpers/eimzo';
import ChangeDateModal from "../../../../../components/ChangeDateModal";
import ProtocolModal from "../../../../../components/ProtocolModal";
import ChangeMonthModal from "../../../../../components/ChangeMonthModal";
import ChangeStatusModal from "../components/Modals/ChangeStatusModal";
import ChangeSubAccModal from '../components/Modals/ChangeSubAccModal';
import CheckDocModal from './Modals/CheckDocModal';
import DocumentChangeLogModal from '../../../../../components/DocumentChangeLogModal';
// import classes from "../PlasticCardSheetForMilitary.module.css";

const { Option } = Select;
let keys = [];

const GetListTable = () => {
    // const superAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).UserID === 22412;
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    const updateDocFioAndNumRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('UpdateDocumentFIOAndNumber');
    const docOperationRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');
    const docSendRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('PayrollOfPlasticCardSheetSend');

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [eimzoForm] = Form.useForm();
    const tableList = useSelector((state) => state.payrollOfPlasticCardSheetList);
    const filterData = tableList?.filterData;
    const paginationData = tableList?.paginationData;
    const storeLoading = tableList.listBegin;
    const tableData = tableList.listSuccessData?.rows;
    const total = tableList.listSuccessData?.total;

    const [loading, setLoading] = useState(false);
    const [hash, setHash] = useState('');
    const [eimzoModalVisible, setEimzoModalVisible] = useState(false);
    const [changeStatusModalVisible, setChangeStatusModalVisible] = useState(false);
    const [changeDateModalVisible, setChangeDateModalVisible] = useState(false);
    const [changeMonthModalVisible, setChangeMonthModalVisible] = useState(false);
    const [protocolModalVisible, setProtocolModalVisible] = useState(false);
    const [changeSubAccModalVisible, setChangeSubAccModalVisible] = useState(false);
    const [checkDocModalVisible, setCheckDocModalVisible] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);
    const [historyParams, setHistoryParams] = useState(null);
    const [subName, setSubName] = useState('');
    const [rowId, setRowId] = useState(null);
    const [paymentOrderId, setPaymentOrderId] = useState(null);
    const [statusId, setStatusId] = useState(null);

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...paginationData,
                ...filterData,
            })
        );
    }, [dispatch, paginationData, filterData]);

    // const deleteRowHandler = id => {
    //   setLoading(true);
    //   PayrollOfPlasticCardSheetServices.delete(id)
    //     .then(res => {
    //       if (res.status === 200) {
    //         dispatch(getListStartAction({
    //           ...filterData,
    //           ...paginationData,
    //         }));
    //         setLoading(false);
    //       }
    //     })
    //     .catch(err => {
    //       setLoading(false);
    //       Notification('error', err);
    //     })
    // }

    const acceptHandler = (id) => {
        setLoading(true);
        PayrollOfPlasticCardSheetServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('accepted'));
                    dispatch(getListStartAction({
                        ...filterData,
                        ...paginationData,
                    }));
                    setLoading(false);
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoading(false);
            });
    };

    const declineHandler = (id) => {
        setLoading(true);
        PayrollOfPlasticCardSheetServices.NotAccept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('accepted'));
                    dispatch(getListStartAction({
                        ...filterData,
                        ...paginationData,
                    }));
                    setLoading(false);
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoading(false);
            });
    };

    // E-imzo
    const loadKeys = useCallback(() => {
        var items = [];
        fillCertKeys(items, () => {
            fillPfxs(items, () => {
                for (var itm in items) {
                    var vo = items[itm]
                    // var opt = document.createElement('option');
                    var date = new Date(vo.validTo);

                    var dd = String(date.getDate()).padStart(2, '0');
                    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = date.getFullYear();

                    date = dd + '.' + mm + '.' + yyyy;
                    // opt.innerHTML = vo.TIN + " - " + vo.O + " - " + vo.CN + " - Срок до:" + date;
                    // opt.value = JSON.stringify(vo);

                    keys.push({ tin: vo.TIN, org: vo.O, name: vo.CN, date: date, validTo: vo.validTo, value: JSON.stringify(vo) });
                }
            });
        });
    }, [])

    useEffect(() => {
        window.CAPIWS.apikey(apiKey, (event, data) => {
            if (data.success) {
                loadKeys();
            } else {
                alert(data.reason);
            }
        }, (e) => {
            alert(e);
        })
    }, [loadKeys])

    function postLoadKey(id, vo, reload) {
        let buff = new Buffer(hash);
        window.CAPIWS.callFunction({
            plugin: "pkcs7",
            name: "create_pkcs7",
            arguments: [buff.toString('base64'), id, 'no']
        }, (event, data) => {
            // console.log(event, data);
            if (data.success) {
                //   document.eimzoForm.pkcs7.value = data.pkcs7_64;
                let signData = {
                    ID: rowId,
                    DataHash: hash,
                    SignedData: data.pkcs7_64
                }
                PayrollOfPlasticCardSheetServices.postSignedData(signData)
                    .then(res => {
                        if (res.status === 200) {
                            dispatch(setMainLoader(false));
                            setEimzoModalVisible(false);
                            // this.setState({ mainLoader: false, isEimzoModalVisible: false });
                            // this.eImzoForm.current.resetFields();

                            dispatch(getListStartAction({
                                ...filterData,
                                ...paginationData,
                            }));
                        }
                    })
                    .catch(err => {
                        Notification('error', err);
                        dispatch(setMainLoader(false));
                        setMainLoader(false)
                        setLoading(false);
                    })
            } else {
                dispatch(setMainLoader(false));
                setEimzoModalVisible(false);
                // this.setState({ mainLoader: false, isEimzoModalVisible: false });
                // this.eImzoForm.current.resetFields();
                if (reload && (data.reason === "Ключ по идентификатору не найден")) {
                    reload();
                } else {
                    alert(data.reason);
                }
            }
        }, (e) => {
            alert(e);
        });
    };

    function loadPfxKey(vo) {
        window.CAPIWS.callFunction({
            plugin: "pfx",
            name: "load_key",
            arguments: [vo.disk, vo.path, vo.name, vo.alias]
        }, (event, data) => {
            if (data.success) {
                var id = data.keyId;
                window.sessionStorage.setItem(vo.serialNumber, id);
                postLoadKey(id, vo);
            } else {
                alert(data.reason);
            }
        }, (e) => {
            alert(e);
        });
    };

    function sign(hash) {
        // hashData = hash;
        // var itm = document.eimzoForm.key.value;
        var itm = eimzoForm.getFieldValue('eImzoKey');
        if (itm) {
            var vo = JSON.parse(itm);
            // console.log(vo);

            if (vo.type === "certkey") {
                window.CAPIWS.callFunction({
                    plugin: "certkey",
                    name: "load_key",
                    arguments: [vo.disk, vo.path, vo.name, vo.serialNumber]
                }, (event, data) => {
                    if (data.success) {
                        var id = data.keyId;
                        postLoadKey(id, vo);
                    } else {
                        alert(data.reason);
                    }
                }, (e) => {
                    alert(e);
                });
            } else if (vo.type === "pfx") {
                var id = window.sessionStorage.getItem(vo.serialNumber);
                if (id) {
                    postLoadKey(id, vo, function () {
                        loadPfxKey(vo);
                    });
                } else {
                    loadPfxKey(vo);
                }
            }
        }
    };

    const eimzoModalOkHandler = () => {
        eimzoForm.validateFields()
            .then(values => {
                sign(hash);
                setEimzoModalVisible(false);
                dispatch(setMainLoader(true));
                setLoading(false);
            })
            .catch(err => err);
        setLoading(false);
        setMainLoader(false)
    };

    const eimzoModalCancelHandler = () => {
        setLoading(false);
        setEimzoModalVisible(false);
    };

    // E-imzo end

    // change status modal
    const openChangeStatusModalHandler = (values) => {
        setChangeStatusModalVisible(true);
        setRowId(values.id);
        setStatusId(values.status);
    }

    const closeChangeStatusModalOkHandler = (values) => {
        setChangeStatusModalVisible(true);
        dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
        }));
    }
    // change status modal

    const openChangeDateModalHandler = (id) => {
        setChangeDateModalVisible(true);
        setRowId(id);
    }

    const closeChangeDateModalHandler = (values) => {
        values.ID = rowId;
        setChangeDateModalVisible(false);
        if (values.Date) {
            PayrollOfPlasticCardSheetServices.changeDate(values)
                .then(res => {
                    Notification('success', t('edited'));
                    dispatch(getListStartAction({
                        ...filterData,
                        ...paginationData,
                    }));
                })
                .catch((err) => {
                    Notification('error', err);
                    setLoading(false);
                });
        }
    }

    // change month modal
    const openChangeMonthModalHandler = (id) => {
        setChangeMonthModalVisible(true);
        setRowId(id);
    }

    const closeChangeMonthModalHandler = (values) => {
        values.ID = rowId;
        setChangeMonthModalVisible(false);
        if (values.Date) {
            PayrollOfPlasticCardSheetServices.changeMonth(values)
                .then(res => {
                    if (res.status === 200) {
                        Notification('success', t('edited'));
                        dispatch(getListStartAction({
                            ...filterData,
                            ...paginationData,
                        }));
                    }
                })
                .catch((err) => {
                    Notification('error', err);
                    setLoading(false);
                });
        }
    }
    // change month modal

    const changeFioAndNumber = (id) => {
        setLoading(true);
        PayrollOfPlasticCardSheetServices.UpdateDocumentFIOAndNumber(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('edited'));
                    dispatch(getListStartAction({
                        ...filterData,
                        ...paginationData,
                    }));
                }
            })
            .catch((err) => {
                Notification('error', err)
                setLoading(false);
            });
    };

    const openProtocolModalHandler = (id) => {
        setProtocolModalVisible(true);
        setRowId(id);
    }

    const subbAccCreateHandler = (values) => {
        setChangeSubAccModalVisible(false);
        setLoading(true);
        PayrollOfPlasticCardSheetServices.ChangeSubAcc(values)
            .then(res => {
                dispatch(getListStartAction({
                    ...filterData,
                    ...paginationData,
                }));
            })
            .catch(err => {
                Notification('error', err);
                setLoading(false);
            })
    }

    const changeSubAccModalHandler = (id, subName) => {
        setChangeSubAccModalVisible(true);
        setRowId(id);
        setSubName(subName);
    };

    const openCheckDocModal = (id, paymentOrderId) => {
        setRowId(id);
        setPaymentOrderId(paymentOrderId);
        setCheckDocModalVisible(true);
    }

    const checkDocFinishHandler = useCallback((paymentOrderId) => {
        setCheckDocModalVisible(false);
        setLoading(true);
        PayrollOfPlasticCardSheetServices.getHash(rowId, paymentOrderId)
            .then(res => {
                setLoading(false);
                setEimzoModalVisible(true);
                setHash(res.data);
            })
            .catch(err => {
                Notification('error', err);
                setLoading(false);
            })
    }, [rowId]);

    const openHistoryModal = (params) => {
        setHistoryParams(params);
        setHistoryModal(true);
    };

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            render: (_, record) => {
                if (record.StatusID === 2 || record.StatusID === 11) {
                    return record.ID;
                } else {
                    return <span style={{ color: 'red' }}>{record.ID}</span>
                }
            }
        },
        {
            title: t("PaymentOrderID"),
            dataIndex: "PaymentOrderID",
            key: "PaymentOrderID",
            sorter: true,
            width: 130
        },
        {
            title: t("InpaymentID"),
            dataIndex: "InpaymentID",
            key: "InpaymentID",
            sorter: true,
            width: 110
        },
        {
            title: t("personnelNumber"),
            dataIndex: "Number",
            key: "Number",
            sorter: true,
            width: 100
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
        },
        {
            title: t("Month"),
            dataIndex: "Month",
            key: "Month",
            sorter: true,
            width: 120
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            sorter: true,
            width: 120,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            render: (_, record) => {
                if (record.StatusID === 2 || record.StatusID === 11) {
                    return (
                        <Tag color='#87d068'>
                            {record.Status}
                        </Tag>
                    );
                }
                return (
                    <Tag color='#f50'>
                        {record.Status}
                    </Tag>
                );
            }
        },
        {
            title: t("MFO"),
            dataIndex: "MFO",
            key: "MFO",
            sorter: true,
        },
        {
            title: t("DivName"),
            dataIndex: "DivName",
            key: "DivName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("DprName"),
            dataIndex: "DprName",
            key: "DprName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("SubcName"),
            dataIndex: "SubcName",
            key: "SubcName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("SubName"),
            dataIndex: "SubName",
            key: "SubName",
            sorter: true,
            width: 150
        },
        {
            title: t("SettleCode"),
            dataIndex: "SettleCode",
            key: "SettleCode",
            sorter: true,
            width: 150
        },
        {
            title: t("Comment"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("OrgName"),
            dataIndex: "OrgName",
            key: "OrgName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 80,
            render: (record) => {
                return (
                    <Space size="middle">
                        {adminViewRole &&
                            <Tooltip title={t('changeStatus')}>
                                <span onClick={() => openChangeStatusModalHandler({
                                    id: record.ID,
                                    status: record.StatusID,
                                })}>
                                    <i className="feather icon-check-square action-icon"></i>
                                </span>
                            </Tooltip>
                        }
                        {adminViewRole &&
                            <>
                                <Tooltip title={t('changeDate')}>
                                    <span onClick={() => openChangeDateModalHandler(record.ID)}>
                                        <i className="far fa-clock action-icon"></i>
                                    </span>
                                </Tooltip>

                                <Tooltip title={t('changeMonth')}>
                                    <span onClick={() => openChangeMonthModalHandler(record.ID)}>
                                        <i className="far fa-calendar action-icon"></i>
                                    </span>
                                </Tooltip>
                            </>
                        }

                        <Dropdown
                            placement="bottom"
                            overlay={<Menu items={[
                                {
                                    key: 'edit',
                                    label: (
                                        <Link to={`${location.pathname}/edit/${record.ID}`}>
                                            <i className='feather icon-edit action-icon' aria-hidden="true" />&nbsp;
                                            {t('Edit')}
                                        </Link>
                                    ),
                                },
                                ...docOperationRole ? [
                                    {
                                        key: 'accept',
                                        label: (
                                            <span onClick={() => acceptHandler(record.ID)}>
                                                <i className="far fa-check-circle action-icon" />&nbsp;
                                                {t("Accept")}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: 'notAccept',
                                        label: (
                                            <span onClick={() => declineHandler(record.ID)}>
                                                <i className="far fa-check-circle action-icon" />&nbsp;
                                                {t("NotAccept")}
                                            </span>
                                        ),
                                    },
                                ] : [],
                                {
                                    key: 'changeSubAcc',
                                    label: (
                                        <span onClick={() => changeSubAccModalHandler(record.ID, record.SubName)}>
                                            <i className="feather icon-repeat action-icon" />&nbsp;
                                            {t("ChangeSubaccount")}
                                        </span>
                                    ),
                                },
                                ...docSendRole ? [ 
                                    {
                                        key: 'send',
                                        label: (
                                            <span onClick={() => openCheckDocModal(record.ID, record.PaymentOrderID)}>
                                                <i className="far fa-paper-plane action-icon" />&nbsp;
                                                {t("send")}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: 'protocol',
                                        label: (
                                            <span onClick={() => openProtocolModalHandler(record.ID)}>
                                                <i className="far fa-comment action-icon" />&nbsp;
                                                {t("protocol")}
                                            </span>
                                        ),
                                    },
                                ] : [],
                                ...updateDocFioAndNumRole ? [
                                    {
                                        key: 'changeFioAndNumber',
                                        label: (
                                            <span onClick={() => changeFioAndNumber(record.ID)}>
                                                <i className="feather icon-repeat action-icon" />&nbsp;
                                                {t('changeFioAndNumber')}
                                            </span>
                                        ),
                                    },
                                ] : [],
                                {
                                    key: 'sendUzasbo',
                                    label: (
                                        <span onClick={() => PostUZASBO2(record.ID)}>
                                            <i className="far fa-paper-plane action-icon" />&nbsp;
                                            {t("send")} (Uzasbo 2)
                                        </span>
                                    ),
                                },
                                {
                                    key: 'DocumentChangeLog',
                                    label: (
                                        <span onClick={() => openHistoryModal({
                                            id: record.ID,
                                            TableID: 205,
                                        })}>
                                            <i className="feather icon-file-text action-icon" />&nbsp;
                                            {t("DocumentChangeLog")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'Print',
                                    label: (
                                        <span onClick={() => printHandler(record.ID)}>
                                            <i className="feather icon-printer action-icon" />&nbsp;
                                            {t("Print")}
                                        </span>
                                    ),
                                },
                            ]} />}
                        >
                            <i className='feather icon-list action-icon' aria-hidden="true" />
                        </Dropdown>

                        {/* <Tooltip title={t('delete')}>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.deleteRowHandler(record.ID)}
                okText={t("yes")}
                cancelText={t("cancel")}
              >
                <span>
                  <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                </span>
              </Popconfirm>
            </Tooltip> */}
                    </Space>
                );
            },
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        const { field, order } = sorter;
        dispatch(setListPagination({
            ...paginationData,
            OrderType: order?.slice(0, -3),
            SortColumn: field,
            PageNumber: pagination.current,
            PageLimit: pagination.pageSize,
        }));
    }

    const onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                history.push(`${location.pathname}/edit/${record.ID}`);
            },
        };
    }

    const printHandler = (id) => {
        setLoading(true);
        PayrollOfPlasticCardSheetServices.printById(id)
            .then(res => {
                if (res.status === 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Платежнаяведомость.xlsx");
                    document.body.appendChild(link);
                    link.click();
                    setLoading(false);
                }
            })
            .catch(err => {
                Notification('error', err);
                setLoading(false);
            })
    }

    const PostUZASBO2 = (id) => {
        setLoading(true);
        PayrollOfPlasticCardSheetServices.PostUZASBO2(id)
            .then(res => {
                if (res.status === 200) {
                    Notification('success', t("sendToSuccess"));
                    setLoading(false);
                }
            })
            .catch(err => {
                Notification('error', err);
                setLoading(false);
            })
    }

    return (
        <>
            <Table
                bordered
                size="middle"
                rowClassName="table-row"
                className="main-table"
                columns={columns}
                dataSource={tableData}
                loading={storeLoading || loading}
                onChange={handleTableChange}
                rowKey={(record) => record.ID}
                showSorterTooltip={false}
                onRow={(record) => onTableRow(record)}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={{
                    pageSize: Math.ceil(tableData?.length / 10) * 10,
                    total: total,
                    current: paginationData.PageNumber,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={eimzoModalVisible}
                timeout={300}
            >
                <Modal
                    title={t("send")}
                    visible={eimzoModalVisible}
                    onOk={eimzoModalOkHandler}
                    onCancel={eimzoModalCancelHandler}
                >
                    <Form
                        form={eimzoForm}
                        layout='vertical'
                    >
                        <Form.Item
                            label={t('eImzoKey')}
                            name="eImzoKey"
                            rules={[
                                {
                                    required: true,
                                    message: t('Please input your eImzoKey!'),
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t('eImzoKey')}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children[0].props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {keys.map((item, index) => {
                                    return (
                                        <Option key={+item.tin + index} value={item.value} className='e-imzo-keys'>
                                            <span>{item.tin}&nbsp;-&nbsp;</span>
                                            <span>{item.org}&nbsp;-&nbsp;</span>
                                            <span>{item.name}&nbsp;-&nbsp;</span>
                                            {new Date().getTime() < new Date(item.validTo).getTime() ?
                                                <span>{item.date}</span> :
                                                <span style={{ color: 'red' }}>{item.date}</span>
                                            }
                                        </Option>
                                    )
                                }
                                )}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </CSSTransition>

            {/* change status modal */}
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={changeStatusModalVisible}
                timeout={300}
            >
                <ChangeStatusModal
                    visible={changeStatusModalVisible}
                    id={rowId}
                    statusID={statusId}
                    onCancel={() => setChangeStatusModalVisible(false)}
                    onOk={closeChangeStatusModalOkHandler}
                />
            </CSSTransition>
            {/* change status modal end */}

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={changeDateModalVisible}
                timeout={300}
            >
                <ChangeDateModal
                    visible={changeDateModalVisible}
                    id={rowId}
                    onCancel={closeChangeDateModalHandler}
                />
            </CSSTransition>

            {/* change month modal */}
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={changeMonthModalVisible}
                timeout={300}
            >
                <ChangeMonthModal
                    visible={changeMonthModalVisible}
                    id={rowId}
                    onCancel={closeChangeMonthModalHandler}
                />
            </CSSTransition>
            {/* change month modal end*/}

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={protocolModalVisible}
                timeout={300}
            >
                <ProtocolModal
                    visible={protocolModalVisible}
                    id={rowId}
                    tableId={205}
                    onCancel={() => setProtocolModalVisible(false)}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={changeSubAccModalVisible}
                timeout={300}
            >
                <ChangeSubAccModal
                    visible={changeSubAccModalVisible}
                    id={rowId}
                    subName={subName}
                    onCancel={() => setChangeSubAccModalVisible(false)}
                    onCreate={subbAccCreateHandler}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={checkDocModalVisible}
                timeout={300}
            >
                <CheckDocModal
                    visible={checkDocModalVisible}
                    id={rowId}
                    paymentOrderId={paymentOrderId}
                    onCancel={() => setCheckDocModalVisible(false)}
                    onOk={checkDocFinishHandler}
                />
            </CSSTransition>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={historyModal}
                timeout={300}
            >
                <DocumentChangeLogModal
                    visible={historyModal}
                    params={historyParams}
                    onCancel={() => {
                        setHistoryModal(false);
                    }}
                />
            </CSSTransition>
        </>
    )
}

export default React.memo(GetListTable);