import React, {useState, useEffect} from 'react'
import { Dropdown, Space, Table, Tag, Menu, Modal, Form, Select, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import MaternityLeaveRequestServices from '../../../../../../services/Documents/Payroll/MaternityLeaveRequest/MaternityLeaveRequest.services';
import { Notification } from '../../../../../../helpers/notifications';
import TableRightClick from '../TableRightClick';
import { setListPagination } from '../_redux/getListSlice';

const { Option } = Select;

const TableData = ({ tableData, total, match, reduxList, refresh }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    // const [sendForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    // const [organizationList, setOrglist] = useState([]);

    // let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [tablePopup, setTablePopup] = React.useState({
        visible: false,
        x: 0,
        y: 0
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const [orgList] = await Promise.all([
    //             MaternityLeaveRequestServices.getById(),
    //         ]);
    //        setOrglist(orgList)
            

    //     }
    //     fetchData().catch(err => {
    //         Notification('error', err);
    //     });
    // }, []);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            align: "center",
            width: 100
            // render: (_, record) => {
            //     if (record.StatusID === 2) {
            //         return record.ID;
            //     } else {
            //         return <span style={{ color: 'red' }}>{record.ID}</span>
            //     }
            // }
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            key: "Number",
            align: "center",
            sorter: true,
            width: 80
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            align: "center",
            sorter: true,
        },
        {
            title: t("Year"),
            dataIndex: "Year",
            key: "Year",
            align: "center",
            sorter: true,
        },
        {
            title: t("Month"),
            dataIndex: "Month",
            key: "Month",
            align: "center",
            sorter: true,
        },
        {
            title: t("FullName"),
            dataIndex: "Employees",
            key: "Employees",
            align: "center",
            sorter: true,
        },
        {
            title: t("numberOfEmployee"),
            dataIndex: "TotalEmployee",
            key: "TotalEmployee",
            sorter: true,
            align: "center",
            width: 150
        },
        // {
        //     title: t("stir"),
        //     dataIndex: "INN",
        //     key: "INN",
        //     sorter: true,
        //     // width: 80
        // },
        // {
        //     title: t("OrgName"),
        //     dataIndex: "OrganizationName",
        //     key: "OrganizationName",
        //     sorter: true,
        //     // width: 80
        // },
        // {
        //     title: t("economy"),
        //     dataIndex: "FinancSum",
        //     key: "FinancSum",
        //     sorter: true,
        //     // width: 110
        // },
        {
            title: t("TotalSickSum"),
            dataIndex: "TotalSickSum",
            key: "TotalSickSum",
            sorter: true,
            width: 150,
            align: "right",
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("ExistSum"),
            dataIndex: "ExistSum",
            key: "ExistSum",
            sorter: true,
            width: 150,
            align: "right",
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("RequestSum"),
            dataIndex: "RequestSum",
            key: "RequestSum",
            sorter: true,
            width: 150,
            align: "right",
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            align: "center",
            render: (_, record) => {
                if (record.Status === 'Создан') {
                    return (
                        <Tag color='#f50'>
                            {record.Status}
                        </Tag>
                        // #87d068
                    );
                }
                return (
                    <Tag color='#87d068'>
                        {record.Status}
                    </Tag>
                );
            }
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
                        <Tooltip title={t("Edit")}>
                            <Link to={`${match.path}/edit/${record.ID}`}>
                                <i className="feather icon-edit action-icon" />
                            </Link>
                        </Tooltip>

                        <Dropdown
                            placement='bottom'
                            overlay={<Menu items={[
                                {
                                    key: 'send',
                                    label: (
                                        <span onClick={() => sendModal()}>
                                            <i className="far fa-paper-plane action-icon" />&nbsp;
                                            {t("send")}
                                        </span>
                                    ),
                                },
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
                                {
                                    key: 'delete',
                                    label: (
                                        <span onClick={() => deleteRowHandler(record.ID)}>
                                            <i className="far fa-check-circle action-icon" />&nbsp;
                                            {t("Delete")}
                                        </span>
                                    ),
                                },
                            ]} />}
                        >
                            <i className='feather icon-list action-icon' aria-hidden="true" />
                        </Dropdown>
                       
                    </Space>
                );
            },
        },
    ];

    function handleTableChange(pagination, _, sorter) {
        const { field, order } = sorter;

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );
    };

    // const openCheckDocModal = (id, paymentOrderId) => {
    //     setRowId(id);
    //     setCheckDocModalVisible(true);
    // }

    // const send = (id) => {
    //     this.setState({ loading: true });
    //     const { pagination, filterForm } = this.state;
    //     MaternityLeaveRequestServices.NotAccept(id)
    //       .then((res) => {
    //         if (res.status === 200) {
    //           Notification('success', this.props.t('send'));
    //           this.fetch({ pagination }, null, filterForm);
    //         }
    //       })
    //       .catch((err) => {
    //         // console.log(err)
    //         Notification('error', err)
    //         this.setState({ loading: false });
    //       });
    //   };

    const sendModal = () => {
        // setLoading(false);
        setModalVisible(true);
    };

    const closeModalHandler = () => {
        setModalVisible(false);
    }

    const acceptHandler = (id) => {
        setConfirmLoading(true);
        MaternityLeaveRequestServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('saved'))
                }
            })
            .catch((err) => {
                setConfirmLoading(false);
                Notification('error', err);
            });
    };
    const declineHandler = (id) => {
        setConfirmLoading(true);
        MaternityLeaveRequestServices.NotAccept(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('saved'))
                }
            })
            .catch((err) => {
                setConfirmLoading(false);
                Notification('error', err);
            });
    };
    // const declineHandler = (id) => {
    //     console.log(id);
    //     setConfirmLoading(true);
    //     const { pagination, filterForm } = this.state;
    //     MaternityLeaveRequestServices.NotAccept(id)
    //       .then((res) => {
    //         if (res.status === 200) {
    //           Notification('success', this.props.t('notAccepted'));
    //           this.fetch({ pagination }, null, filterForm);
    //         }
    //       })
    //       .catch((err) => {
    //         // console.log(err)
    //         Notification('error', err)
    //         this.setState({ loading: false });
    //       });
    //   };

    const deleteRowHandler = (id) => {
        setConfirmLoading(true);
        MaternityLeaveRequestServices.delete(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('deleted'))
                }
            })
            .catch((err) => {
                Notification('error', err)
                setConfirmLoading(false)
            });
    };

    const onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                history.push(`${match.path}/edit/${record.ID}`);
            },
            onContextMenu: event => {
                event.preventDefault()
                if (!tablePopup.visible) {
                    document.addEventListener(`click`, function onClickOutside() {
                        setTablePopup({ visible: false })
                        document.removeEventListener(`click`, onClickOutside);
                    });

                    document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
                        setTablePopup({ visible: false })
                        document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
                    })
                }
                setTablePopup({
                    record,
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                })
            }
        };
    }

    return (
        <>
            <Table
                bordered
                size="middle"
                columns={columns}
                dataSource={tableData}
                loading={loading || confirmLoading}
                showSorterTooltip={false}
                onChange={handleTableChange}
                rowKey={(record) => record.ID}
                rowClassName="table-row"
                className='main-table'
                onRow={(record) => onTableRow(record)}
                scroll={{
                    x: 'max-content',
                    y: '50vh'
                }}
                pagination={{
                    ...pagination,
                    total: total,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />
            <TableRightClick
                {...tablePopup}
                // deleteRow={deleteRowHandler}
                accept={acceptHandler}
                notAccept={declineHandler}
            />
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={modalVisible}
                timeout={300}
            >
                <Modal
                    title={t("send")}
                    visible={modalVisible}
                    // onOk={eimzoModalOkHandler}
                    onCancel={closeModalHandler}
                >
                    <Form
                        // form={sendForm}
                        layout='vertical'
                    >
                        {/* <Form.Item
                                label={t("razDep")}
                                name="FunctionalItemID"

                            >
                                <Select
                                    // placeholder={t("OrganizationFunctionalItem")}
                                    style={{ width: 150 }}
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {organizationList.map(item =>
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Code}
                                        </Option>)}
                                </Select>
                            </Form.Item> */}
                        
                    </Form>
                </Modal>
            </CSSTransition>
        </>
    )
}

export default TableData