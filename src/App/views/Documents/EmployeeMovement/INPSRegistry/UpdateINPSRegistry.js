import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input, Tabs, Table, InputNumber, Spin, Empty, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import MainCard from "../../../../components/MainCard";
import classes from "./INPSRegistry.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import INPSRegistryServices from "../../../../../services/Documents/EmployeeMovement/INPSRegistry/INPSRegistry.services";
import AddTableModal from './INPSModals/AddTableModal.js';
import EditableCell from "./EditableCell";
import months from "../../../../../helpers/months";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
let tableRowChanged = false;
const { TabPane } = Tabs;

const UpdateINPSRegistary = (props) => {
    const [rowId, setRowId] = useState(null);
    const [orgSettleAccList, setOrgSettleAccList] = useState([]);
    const [employeeStateModal, setEmployeeState] = useState(false);
    const [employeeId] = useState(null);
    const [inpsRegistaryList, setInpsRegistaryList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [inpsDocsTables, setINPSRegistaryTable] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tablePagination, setTablePagination] = useState({
        pagination: {
            current: 1,
            pageSize: 5
        }
    });
    const [editingKey, setEditingKey] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0);
    const docId = props.match.params.id ? props.match.params.id : 0;
    const [disabledActions, setDisabledActions] = useState(true);
    const RequestReceivingCashTableEditRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('RequestReceivingCashTableEdit');

    const { t } = useTranslation();
    const history = useHistory();
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Option } = Select;
    const [tableForm] = Form.useForm();
    const docTitle = docId === 0 ? t('INPSRegistry') : t('INPSRegistry');

    const Tablecolumns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            align: 'center',
            // width: 120
        },
        {
            title: t("employee"),
            dataIndex: "EmployeeFullName",
            key: "EmployeeFullName",
            sorter: true,
            // width: 180,
            align: 'center'
        },
        {
            title: t("InSum"),
            dataIndex: "InSum",
            key: "InSum",
            sorter: true,
            align: 'center',
            // width: 160
        },
        {
            title: t("INPSSum"),
            dataIndex: "INPSSum",
            key: "INPSSum",
            sorter: true,
            align: 'right',
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
            width: 150
        },
        {
            title: t("VoluntarySum"),
            dataIndex: "VoluntarySum",
            key: "VoluntarySum",
            sorter: true,
            editable: true,
            align: 'center',
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
            width: 180
        },
        {
            title: t("TotalSum"),
            dataIndex: "TotalSum",
            key: "TotalSum",
            sorter: true,
            align: 'center',
        },
        {
            title: t("INPSCode"),
            dataIndex: "INPSCode",
            key: "INPSCode",
            sorter: true,
            align: 'center'
        },

    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const inpsSht = await INPSRegistryServices.getById(docId);
                const orgSettleAccLs = await HelperServices.getOrganizationsSettlementAccountList();
                const inpsDocsTables = await INPSRegistryServices.getInpsTableData(docId, 1, 50);
                setInpsRegistaryList(inpsSht.data);
                setOrgSettleAccList(orgSettleAccLs.data);
                setINPSRegistaryTable(inpsSht.data.rows);
                setINPSRegistaryTable(inpsDocsTables.data.rows);
                if (inpsSht.data.StatusID === 1 || inpsSht.data.StatusID === 3 || inpsSht.data.StatusID === 4 || inpsSht.data.StatusID === 10) {
                    setDisabledActions(false);
                }else if (inpsSht.data.PaymentOrderID ===0|| inpsSht.data.PaymentOrderID === null){
                    setDisabledActions(false);
                }
                setLoader(false);
                form.setFieldsValue({
                    ...inpsSht.data,
                    Date: moment(inpsSht.data.Date, 'DD.MM.YYYY'),
                    docYear: moment().year(),
                    DocMonth: inpsSht.data.DocMonth,
                    //OrganizationsSettlementAccountID: inpsSht.data.ID = 0 ? inpsSht.OrganizationsSettlementAccountID : null,

                });
            } catch (err) {
                // console.log(err);
                Notification('error', err);
            }
        }
        fetchData();
    }, [docId, form]);

    const createTableDataHandler = useCallback((values) => {
        setINPSRegistaryTable((inpsDocsTables) => [...inpsDocsTables, values])
        setEmployeeState(false)
    }, []);

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
    };

    const getModalData = async (data) => {
        const empTableData = {
            EmployeeID: data.ID,
            OwnerID: currentDocId,
            InSum: data.Sum,
        }

        try {
            setLoader(true);
            await INPSRegistryServices.getPlasticTable(empTableData);
            setLoader(true);
            const { pagination } = tablePagination;
            await fetchTableData({ pagination });
            setLoader(false);
        } catch (error) {
            // console.log(error);
            Notification('error', error)
            setLoader(false);
        }
    }

    const AddBtn = async () => {
        const values = await form.validateFields();
        try {
            setLoader(true);
            values.ID = currentDocId;
            values.Date = values.Date.format("DD.MM.YYYY");
            const dataForTableDocs = await INPSRegistryServices.addEmployeeTable(values);
            setCurrentDocId(dataForTableDocs.data);
            setLoader(false);
            setEmployeeState(true);
        } catch (error) {
            // console.log(error);
            Notification('error', error)
            setLoader(false);
        }
    }


    const isEditing = (record) => record.ID === editingKey;

    const edit = (record) => {
        tableForm.setFieldsValue({
            ...record
        });
        setEditingKey(record.ID);
    };

    const save = async (key) => {
        try {

            const row = await tableForm.validateFields();
            const newData = [...inpsDocsTables];
            // console.log(inpsDocsTables)           
            const index = newData.findIndex((item) => key === item.ID);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                if (tableRowChanged) {
                    setTableLoading(true);

                    const tableRow = await INPSRegistryServices.saveTableRow({ ...item, ...row });
                    if (tableRow.status === 200) {
                        const { pagination } = tablePagination;
                        fetchTableData({ pagination }, {});
                        tableRowChanged = false;
                    }
                }
                setINPSRegistaryTable(newData);
                setEditingKey("");
            } else {
                newData.push(row);
                setINPSRegistaryTable(newData);
                setEditingKey("");
            }
        } catch (errInfo) {
            // console.log("Validate Failed:", errInfo);
            Notification('errInfo', errInfo)
            setEditingKey("");
            setTableLoading(false);
            tableRowChanged = false;
        }
    };

    const mergedColumns = Tablecolumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: "number",
                dataIndex: col.dataIndex,
                title: col.title,
                // insummax: record.InSum,
                editing: isEditing(record),
                onEnter: () => save(record.ID),
                tableform: tableForm,
            })
        };
    });

    const saveAllHandler = () => {
        setLoader(true);
        form.validateFields()
            .then(values => {
                values.ID = currentDocId;
                values.Date = values.Date.format('DD.MM.YYYY');
                // values.tablesOrg = [...plasticCardSht];
                INPSRegistryServices.postData(values)
                    .then(res => {
                        if (res.status === 200) {
                            Notification("success", t("saved"));
                            setLoader(false);
                            history.push('/INPSRegistry');
                        }
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification('error', err);
                        setLoader(false);
                    })
            })
            .catch(err => {
                Notification('error', err)
                setLoader(false);
            })
    }

    const deleteRowsHandler = () => {
        setTableLoading(true);
        const selectedIds = selectedRows.map(item => item.ID);
        INPSRegistryServices.deleteTableData(selectedIds)
            .then(res => {
                if (res.status === 200) {
                    setTableLoading(false)
                    const { pagination } = tablePagination;
                    fetchTableData({ pagination });
                }
            })
            .catch(err => Notification('error', err))
    };

    const clearTableHandler = () => {
        setLoader(true);
        setINPSRegistaryTable([]);
        INPSRegistryServices.clearTable(currentDocId)
            .then(res => setLoader(false))
            .catch(err => Notification('error', err))
    };

    const onFinish = async (filterFormValues) => {
        filterFormValues.ID = currentDocId;
        filterFormValues.EmployeeID = employeeId ? employeeId : inpsRegistaryList.EmployeeID;
        filterFormValues.Date = filterFormValues.Date.format("DD.MM.YYYY");
        filterFormValues.Tables = inpsDocsTables.Tables;
        setLoader(true);
        try {
            const mainData = await INPSRegistryServices.FillINPSRegistryTable(currentDocId);
            if (mainData.status === 200) {
                setCurrentDocId(mainData.data);
                const { pagination } = tablePagination;
                fetchTableData({ pagination }, {}, mainData.data);
            }
        } catch (error) {
            setLoader(false);
            // console.log(error);
            Notification('error', error)
        }
    };

    // const onFinishFailed = (errorInfo) => {
    //     // console.log(errorInfo);
    // };

    const fetchTableData = (params = {}, filterValues) => {
        setTableLoading(true);
        let pageNumber = params.pagination.current,
            pageLimit = params.pagination.pageSize,
            sortColumn = params.sortField,
            orderType = params.sortOrder

        INPSRegistryServices.getInpsTableData(currentDocId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
            .then((res) => {
                if (res.status === 200) {
                    setINPSRegistaryTable(res.data.rows);
                    setTableLoading(false);
                    setLoader(false);
                    setTablePagination({
                        pagination: {
                            ...params.pagination,
                            total: res.data.total,
                        },
                    });
                }
            })
            .catch((err) => {
                // console.log(err);
                Notification('error', err);
                setLoader(false);
                setTableLoading(false);
            });
    };

    const setRowClassName = (record) => {
        return record.ID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
    }

    const onMonthChange = (value, data) => {
        const month = data.children;
        const year = form.getFieldValue('docYear');
        let subCalcKind = 'Реестр ИНПС за';

        const comment = `${subCalcKind} ${month} ${year ? year : ''}.`;
        form.setFieldsValue({ Comment: comment });
    }

    const onYearChange = (value) => {
        let subCalcKind = 'Реестр ИНПС за';

        const monthId = form.getFieldValue('DocMonth');
        const month = months.find(item => {
            if (item.id === monthId) {
                return item;
            }
            return 0;
        });

        const year = value;

        const comment = `${subCalcKind} ${t(month.name)} ${year}.`;
        form.setFieldsValue({ Comment: comment });
    }

    const onTableValuesChange = () => {
        tableRowChanged = true;
    }

    const handleTableChange = (pagination, filters, sorter) => {
        fetchTableData({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters,
        });
    };

    const onTableFilterHandler = (filterValues) => {
        const { pagination } = tablePagination;
        fetchTableData({ pagination }, filterValues);
    };

    const onTableFilterFailedHandler = (errorInfo) => {
        // console.log('Failed:', errorInfo);
        Notification('errorInfo',errorInfo);
    };




    const { pagination } = tablePagination;

    return (
        <Fade>
            <MainCard title={docTitle}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        className={classes.FilterForm}
                        form={form}
                        id='form'
                    >
                        <Row gutter={[16, 16]}>
                            <Col xl={4} lg={12}>
                                <Form.Item label={t("PaymentOrderID")}
                                    name="PaymentOrderID"
                                    style={{ width: '100%' }} 
                                    
                                >
                                    <Input disabled={disabledActions}/>
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={12}>
                                <Form.Item label={t("number")}
                                    name="Number"
                                    style={{ width: '100%' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}
                                >
                                    <Input   disabled
                                        style={{ color: 'black' }} />
                                </Form.Item>
                            </Col>

                            <Col xl={4} lg={12}>
                                <Form.Item
                                    label={t("Date")}
                                    name="Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("inputValidData"),
                                        },
                                    ]}
                                >
                                    <DatePicker placeholder={t("date")} format='DD.MM.YYYY'  disabled
                                        style={{ color: 'black', width: '100%'  }}  />
                                </Form.Item>
                            </Col>

                            <Col xl={4} lg={12}>
                                <Form.Item
                                    label={t("SelectMonth")}
                                    name="DocMonth"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}>
                                    <Select placeholder={t("SelectMonth")} disabled
                                        style={{ color: 'black' }}  onSelect={onMonthChange}>
                                        {months.map(item => <Option key={item.id} value={item.id}>{t(item.name)}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xl={2} lg={12}>
                                <Form.Item
                                    label={t("Year")}
                                    name="docYear"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}
                                >
                                    <InputNumber disabled
                                        style={{ color: 'black' }}  className={classes['year-input']} onChange={onYearChange} />
                                </Form.Item>
                            </Col>

                            <Col xl={6} lg={12}>
                                <Form.Item
                                    label={t("OrganizationsSettlementAccount")}
                                    name="OrganizationsSettlementAccountID"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData"),
                                    //     },
                                    // ]}
                                >
                                    <Select
                                        placeholder={t("OrganizationsSettlementAccount")}
                                        disabled
                                        style={{ width: '100%', color: 'black'}}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {orgSettleAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xl={24} lg={24}>
                                <Form.Item
                                    label={t("Comment")}
                                    name="Comment"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}
                                >
                                    <TextArea rows={2}  disabled style={{ width: '100%', color: 'black'}}/>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>

                    {/* Vedmost Table */}
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={t("Bill")} key="1">
                            <Form
                                form={tableForm}
                                component={false}
                                scrollToFirstError
                                onValuesChange={onTableValuesChange}
                                onFinish={onTableFilterHandler}
                                onFinishFailed={onTableFilterFailedHandler}
                            >
                                {employeeStateModal && (
                                    <AddTableModal
                                        visible={employeeStateModal}
                                        onCancel={() => setEmployeeState(false)}
                                        onCreate={createTableDataHandler}
                                        inpsDocsTables={inpsDocsTables}
                                        getModalData={getModalData}
                                        currentDocId={currentDocId}
                                    />
                                )}

                                <div className={classes.buttons}>
                                    <Button type="primary"
                                        onClick={AddBtn}
                                        disabled={disabledActions}
                                    >{t('add')}
                                    </Button>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        form="form"
                                        disabled={disabledActions}
                                    >
                                        {t("fill")}
                                    </Button>

                                    <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("deleted")}</Button>
                                    <Popconfirm
                                        title={t('delete')}
                                        onConfirm={() => clearTableHandler()}
                                        disabled={disabledActions}
                                        okText={t('yes')}
                                        cancelText={t('cancel')}
                                    >
                                        <Button disabled={disabledActions}>
                                            {t("Tozalash")}
                                        </Button>
                                    </Popconfirm>

                                </div>

                                {inpsDocsTables === 0 ?
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                                    <Table
                                        bordered
                                        rowClassName={setRowClassName}
                                        className="main-table inner-table"
                                        dataSource={inpsDocsTables}
                                        columns={mergedColumns}
                                        loading={tableLoading}
                                        showSorterTooltip={false}
                                        // rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                        rowKey={(record) => record.ID}
                                        onChange={handleTableChange}
                                        pagination={pagination}
                                        components={{
                                            body: {
                                                cell: EditableCell
                                            }
                                        }}
                                        rowSelection={{
                                            onChange: onSelectChange,
                                            selections: [Table.SELECTION_INVERT],
                                        }}
                                        scroll={{
                                            x: "max-content",
                                            y: '90vh'
                                        }}
                                        getModalData={getModalData}
                                        onRow={(record) => {
                                            return {
                                                onDoubleClick: () => {
                                                    if (RequestReceivingCashTableEditRole) {
                                                        edit(record);
                                                        let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                                                        document.addEventListener('click', function clickHandler(event) {
                                                            let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                                                            if (!isClickInsideElement) {
                                                                save(record.ID);
                                                                document.removeEventListener('click', clickHandler);
                                                            }
                                                        });
                                                    }
                                                },
                                                onClick: () => {
                                                    setRowId(record.ID);
                                                },
                                            };
                                        }}
                                    />}

                            </Form>
                        </TabPane>
                    </Tabs >

                    <div className={classes.buttons} style={{ margin: 0 }}>
                        <Button
                            type="danger"
                            onClick={() => {
                                history.goBack();
                                Notification("warning", t("not-saved"));
                            }}
                        >
                            {t("back")}
                        </Button>
                        <Button
                            onClick={saveAllHandler}
                            type="primary"
                        >
                            {t("save")}
                        </Button>

                    </div>
                </Spin>
            </MainCard >
        </Fade >
    );
};
export default UpdateINPSRegistary;