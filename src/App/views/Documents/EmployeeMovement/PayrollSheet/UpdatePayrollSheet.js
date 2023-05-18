import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input, Switch, Tabs, Table, InputNumber, Spin, Empty, Card, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import MainCard from "../../../../components/MainCard";
import classes from "./PayrollSheet.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import PayrollSheetServices from "../../../../../services/Documents/EmployeeMovement/PayrollSheet/PayrollSheet.services";
import AddTableModal from './PayrollModals/AddTableModal.js';
import months from "../../../../../helpers/months";
import EditableCell from "./EditableCell";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
let tableRowChanged = false;

const EditPayrollSheet = (props) => {
    const [rowId, setRowId] = useState(null);
    const [roundingType, setRoundingType] = useState(null);
    const [divisionList, setDivisionList] = useState([]);
    const [payrollList, setPayrollList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [subAccList, setSubAccList] = useState([]);
    const [orgSettleAccList, setOrgSettleAccList] = useState([]);
    const [roundingTypeList, setRoundingTypeList] = useState([]);
    const [itemOfExpensesList, setItemOfExpensesList] = useState([]);
    const [employeeStateModal, setEmployeeState] = useState(false);
    const [isFinalCalculation, setIsFinalCalculation] = useState(true);
    const [payrollSheet, setPayrollSheet] = useState([]);
    const [loader, setLoader] = useState(true);
    const [accShow, setAccShow] = useState(false);
    const [payrollDocsTables, setPayrollDocsTables] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tablePagination, setTablePagination] = useState({
        pagination: {
            current: 1,
            pageSize: 50
        }
    });
    const [editingKey, setEditingKey] = useState("");
    const [disabledAddBtn, setDisabledAddBtn] = useState(false);
    const [disabledComment, setDisabledComment] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [parentId, setParentId] = useState(false);
    const [disabledActions, setDisabledActions] = useState(true);
    const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0);
    const docId = props.match.params.id ? props.match.params.id : 0;
    const RequestReceivingCashTableEditRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('RequestReceivingCashTableEdit');

    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [tableForm] = Form.useForm();
    const docTitle = docId === 0 ? t('PayrollSheet') : t('PayrollSheet');

    const billColumn = [
        {
            title: t("personnelNumber"),
            dataIndex: "PersonnelNumber",
            key: "PersonnelNumber",
            sorter: true,
            align: 'center',
            width: 90
        },
        {
            title: t("employee"),
            dataIndex: "EmployeeName",
            key: "EmployeeName",
            sorter: true,
            // width: 180,
            align: 'center'
        },
        {
            title: t("DprName"),
            dataIndex: "DepartmentName",
            key: "DepartmentName",
            sorter: true,
            align: 'center',
            // width: 160
        },
        {
            title: t("PayrollSum"),
            dataIndex: "PayrollSum",
            key: "PayrollSum",
            sorter: true,
            align: 'right',
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
            width: 150
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            // width: 150,
            sorter: (a, b) => a.Sum - b.Sum,
            editable: true,
            align: 'right',
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("IsDeposition"),
            dataIndex: "IsDeposition",
            key: "IsDeposition",
            sorter: true,
            align: 'center',
            render: (e) => (< Switch onChange={tableColumnSwitch} defaultChecked={e} />),
            width: 120
        },
        {
            title: t("id"),
            dataIndex: "EmployeeID",
            key: "EmployeeID",
            sorter: true,
            align: 'center'
        },
    ];

    const payrollCalculation = [
        {
            title: t("id"),
            dataIndex: "id",
            key: "id",
            sorter: true,
            align: 'center'
        },
        {
            title: t("personnelNumber"),
            dataIndex: "PersonnelNumber",
            key: "PersonnelNumber",
            sorter: true,
            align: 'center',
            width: 120
        },
        {
            title: t("Date"),
            dataIndex: "date",
            key: "date",
            sorter: true,
            align: 'center'
        },
        {
            title: t("Division"),
            dataIndex: "Division",
            key: "Division",
            sorter: true,
            align: 'center',
            width: 140
        },
        {
            title: t("SubcName"),
            dataIndex: "SubcName",
            key: "SubcName",
            sorter: true,
            align: 'right',
        },
        {
            title: t("Comment"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            align: 'center',
        },
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const payrollSht = await PayrollSheetServices.getById(docId);
                const divisionLs = await HelperServices.GetDivisionList();
                const payrollLs = await HelperServices.GetPayrollList();
                const departmentLs = await HelperServices.getDepartmentList(payrollSht.data.DivisionID);
                const subAccLs = await HelperServices.getPayrollSubAccList();
                const orgSettleAccLs = await HelperServices.getOrganizationsSettlementAccountList();
                const roundingTypeLs = await HelperServices.getRoundingTypeList();
                const itemOfExpensesLs = await HelperServices.getItemOfExpensesList();
                const payrollDocsTables = await PayrollSheetServices.getPayrollTableData(docId, 1, 50);
                setPayrollSheet(payrollSht.data);
                setDivisionList(divisionLs.data);
                setPayrollList(payrollLs.data);
                setDepartmentList(departmentLs.data);
                setSubAccList(subAccLs.data);
                setOrgSettleAccList(orgSettleAccLs.data);
                setRoundingTypeList(roundingTypeLs.data);
                setItemOfExpensesList(itemOfExpensesLs.data);
                setPayrollDocsTables(payrollDocsTables.data.rows);
                setParentId(payrollSht.data.ParentID);
                setAccShow(payrollSht.data.AccID);
                setRoundingType(payrollSht.data.RoundingTypeID);
                if (payrollSht.data.ParentID === 18 || payrollSht.data.ParentID === 19) {
                    setDisabledAddBtn(true);
                }
                if (payrollSht.data.ParentID === 63) {
                    setDisabledComment(true);
                }
                if (payrollSht.data.StatusID === 1 || payrollSht.data.StatusID === 3 || payrollSht.data.StatusID === 4 || payrollSht.data.StatusID === 10) {
                    setDisabledActions(false);
                  }
                setTablePagination((prevState) => (
                    {
                        pagination: {
                            ...prevState.pagination,
                            total: payrollDocsTables.data.total
                        }
                    }
                ));
                setLoader(false);
                mainForm.setFieldsValue({
                    ...payrollSht.data,
                    Date: moment(payrollSht.data.Date, 'DD.MM.YYYY'),

                    DocMonth: payrollSht.data.DocMonth.toString()
                });
            } catch (err) {
                // console.log(err);
                Notification('error', err);
            }
        }
        fetchData();
    }, [docId, mainForm]);

    const createTableDataHandler = useCallback((values) => {
        setPayrollDocsTables((payrollDocsTables) => [...payrollDocsTables, values])
        setEmployeeState(false)
    }, []);

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
    };

    const tableColumnSwitch = (checked) => {
        // console.log(`${checked}`);
    }
    const getModalData = async (data) => {
        const empTableData = {
            EmployeeID: data.ID,
            OwnerID: currentDocId,
            InSum: data.Sum,
        }

        try {
            setLoader(true);
            await PayrollSheetServices.getPayrollTable(empTableData);
            const { pagination } = tablePagination;
            await fetchTableData({ pagination }, {}, currentDocId);
            setLoader(false);
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

    const onTableFilterHandler = (filterValues, currentDocId) => {
        const { pagination } = tablePagination;
        fetchTableData({ pagination }, filterValues, {}, currentDocId);
    };

    const onTableFilterFailedHandler = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onTableValuesChange = () => {
        tableRowChanged = true;
    }

    const save = async (key) => {
        try {
            const row = await tableForm.validateFields();
            const newData = [...payrollDocsTables];
            const index = newData.findIndex((item) => key === item.ID);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                if (tableRowChanged) {
                    setTableLoading(true);
                    const tableRow = await PayrollSheetServices.saveTableRow({ ...item, ...row });
                    if (tableRow.status === 200) {
                        const { pagination } = tablePagination;
                        fetchTableData({ pagination }, {});
                        tableRowChanged = false;
                    }
                }
                setPayrollDocsTables(newData);
                setEditingKey("");
            } else {
                newData.push(row);
                setPayrollDocsTables(newData);
                setEditingKey("");
            }
        } catch (errInfo) {
            Notification('Validate Failed', errInfo)
            // console.log("Validate Failed:", errInfo);
            // alert(errInfo);
            setEditingKey("");
            setTableLoading(false);
            tableRowChanged = false;
        }
    };

    const divisionChangeHandler = divisionId => {
        HelperServices.getDepartmentList(divisionId)
            .then(res => {
                setDepartmentList(res.data);

            })
            .catch(err => Notification('error', err))
    }

    const SelectChange = (e, option) => {
        if (option['data-parent'] === 18 || option['data-parent'] === 19) {
            setDisabledAddBtn(true);
            setParentId(option['data-parent']);
            setParentId(option['data-parent']);
        } else {
            setDisabledAddBtn(false);
            setParentId(option['data-parent']);
            setParentId(option['data-parent']);
        }
    }

    const AccSelectChange = (e, option) => {
        // console.log(option)
        setAccShow(option['data-acc']);
    }

    const SwitchChange = (value) => {
        setIsFinalCalculation(value);
    }

    const mergedColumns = billColumn.map((col) => {
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
                summax: record.PayrollSum,
                editing: isEditing(record),
                onEnter: () => save(record.ID),
                tableform: tableForm,
                roundingtype: roundingType
            })
        };
    });

    const mergedColumns2 = payrollCalculation.map((col) => {
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
                editing: isEditing(record),
                onEnter: () => save(record.ID),
            })
        };
    });

    const AddBtn = async () => {
        const filterFormValues = await mainForm.validateFields();
        // console.log(filterFormValues);
        try {
            setLoader(true);
            // filterFormValues.ID = currentDocId;
            // console.log(currentDocId);
            filterFormValues.Date = filterFormValues.Date.format("DD.MM.YYYY");
            const dataForTableDocs = await PayrollSheetServices.addEmployeeTable(filterFormValues);
            setCurrentDocId(dataForTableDocs.data);
            setLoader(false);
            setEmployeeState(true);
        } catch (error) {
            // console.log(error);
            Notification('error', error)
            setLoader(false);
        }
    }

    const deleteRowsHandler = () => {
        setTableLoading(true);
        const selectedIds = selectedRows.map(item => item.ID);
        PayrollSheetServices.deleteTableRow(selectedIds)
            .then(res => {
                if (res.status === 200) {
                    setTableLoading(false)
                    const { pagination } = tablePagination;
                    fetchTableData({ pagination });
                }
            })
            .catch(err => Notification('error', err))
    };

    const handleTableChange = (pagination, filters, sorter) => {
        fetchTableData({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters,
        });
    };

    const saveAllHandler = () => {
        setLoader(true);
        mainForm.validateFields()
            .then(filterFormValues => {
                filterFormValues.ID = currentDocId;
                filterFormValues.Date = filterFormValues.Date.format('DD.MM.YYYY');
                filterFormValues.Tables = [...payrollDocsTables];
                PayrollSheetServices.postData(filterFormValues)
                    .then(res => {
                        if (res.status === 200) {
                            Notification("success", t("saved"));
                            setLoader(false);
                            history.push('/PayrollSheet');
                        }
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification('err', err);
                        setLoader(false);
                    })
            })
            .catch(err => {
                // alert('please fill all inputs');
                Notification('error', err);
                setLoader(false);
            })
    }

    const onFinish = async (filterFormValues) => {
        filterFormValues.ID = currentDocId;
        filterFormValues.Date = filterFormValues.Date.format("DD.MM.YYYY");
        setLoader(true);

        try {
            const mainData = await PayrollSheetServices.CreatePayrollSheetMainData({ ...payrollSheet, ...filterFormValues });
            if (mainData.status === 200) {
                setCurrentDocId(mainData.data);
                const { pagination } = tablePagination;
                fetchTableData({ pagination }, {}, mainData.data);
            }
        } catch (error) {
            setLoader(false);
            // console.log(error);
            Notification('error', error);
        }
    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed', errorInfo);
    };

    const fetchTableData = (params = {}, filterValues, docId) => {
        // console.log(docId);

        setTableLoading(true);
        let pageNumber = params.pagination.current,
            pageLimit = params.pagination.pageSize,
            sortColumn = params.sortField,
            orderType = params.sortOrder

        PayrollSheetServices.getPayrollTableData(docId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
            .then((res) => {
                if (res.status === 200) {
                    setPayrollDocsTables(res.data.rows);
                    // console.log(res.data.rows);
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

    const roundingChangeHandler = (rounding) => {
        setRoundingType(rounding);
    }

    const onMonthChange = (value, data) => {
        const month = data.children;
        const year = mainForm.getFieldValue('docYear');

        let subCalcKind = '';
        if (parentId === 18) {
            subCalcKind = 'з/п за 1-половину'
        } else if (parentId === 19) {
            subCalcKind = 'з/п за 2-половину'
        }

        if (parentId === 63) {
            mainForm.setFieldsValue({ Comment: '' });
        } else {
            const comment = `${subCalcKind} ${t(month.name)} ${year}.`;
            mainForm.setFieldsValue({ Comment: comment });
        }
    }

    const onYearChange = (value) => {
        let subCalcKind = '';
        if (parentId === 18) {
            subCalcKind = 'з/п за 1-половину'
        } else if (parentId === 19) {
            subCalcKind = 'з/п за 2-половину'
        }

        const monthId = mainForm.getFieldValue('DocMonth');
        const month = months.find(item => {
            if (item.id === monthId) {
                return item;
            }
            return 0;
        });

        const year = value;

        if (parentId === 63) {

            mainForm.setFieldsValue({ Comment: '' });
        } else {
            const comment = `${subCalcKind} ${t(month.name)} ${year}.`;
            mainForm.setFieldsValue({ Comment: comment });
        }

    }

    const onSubCalcChange = (value, data) => {
        let subCalcKind = '';
        if (data['data-parent'] === 18) {
            subCalcKind = 'з/п за 1-половину'
        } else if (data['data-parent'] === 19) {
            subCalcKind = 'з/п за 2-половину'
        }

        const monthId = mainForm.getFieldValue('DocMonth');
        const month = months.find(item => {
            if (item.id === monthId) {
                return item;
            }
            return 0;
        });

        const year = mainForm.getFieldValue('DocYear');

        if (data['data-parent'] === 63) {
            setDisabledComment(true);
            mainForm.setFieldsValue({ Comment: '' });
        } else {
            const comment = `${subCalcKind} ${t(month.name)} ${year}.`;
            mainForm.setFieldsValue({ Comment: comment });
        }

    }


    // End Auto comment writer functions

    const clearTableHandler = () => {
        setLoader(true);
        setPayrollDocsTables([]);
        PayrollSheetServices.clearTable(currentDocId)
            .then(res => setLoader(false))
            .catch(err => Notification('error', err))
    };

    const { pagination } = tablePagination;

    let subAccListNode = null;
    if (parentId === 18 || parentId === 19) {
        subAccListNode = (
            <Form.Item
                label={t("subAccList")}
                name="SalarySubAccID"
                rules={[
                    {
                        required: true,
                        message: t("inputValidData"),
                    },
                ]}
            >
                <Select
                    placeholder={t("subAccList")}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={AccSelectChange}
                >
                    {subAccList.map(item => <Option key={item.ID} value={item.ID} data-acc={item.AccID}>{item.SubAcc}</Option>)}
                </Select>
            </Form.Item>
        );
    }

    let itemOfExpense = null;
    if (accShow !== 60 && (parentId === 19 || parentId === 18)) {
        itemOfExpense = (
            <Form.Item
                label={t("ItemOfExpensesID")}
                name="ItemOfExpensesID"
                rules={[
                    {
                        required: true,
                        message: t("inputValidData"),
                    },
                ]}
            >
                <Select
                    placeholder={t("ItemOfExpensesID")}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {itemOfExpensesList.map(item => <Option key={item.ID} value={item.ID} >{item.Code}</Option>)}
                </Select>
            </Form.Item>
        )
    }

    let isAliment = null;
    if (parentId === 63) {
        isAliment = (
            <Form.Item
                label={t('IsAliment')}
                name='IsAliment'
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>
        )
    }

    // let isAfterPrePayment = null;
    let isFinallyCalculation = null;
    if (parentId === 19) {

        isFinallyCalculation = (
            <Form.Item
                label={t('IsFinallyCalculation')}
                name='IsFinallyCalculation'
                valuePropName="checked"
            >
                <Switch onChange={SwitchChange} />
            </Form.Item>
        )
    }

    return (
        <Fade>
            <MainCard title={docTitle}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        className={classes.FilterForm}
                        form={mainForm}
                        id='mainForm'
                    >
                        <Row gutter={[16, 16]}>
                            <Col xl={12} lg={12}>
                                <Card
                                    hoverable
                                    title="Card"
                                    size='small'
                                    className='inputs-wrapper-card'
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Row gutter={[10, 10]}>
                                        <Col xl={8} lg={12}>
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
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
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
                                                <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item
                                                label={t("SelectMonth")}
                                                name="DocMonth"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("pleaseSelect"),
                                                    },
                                                ]}>

                                                <Select placeholder={t("SelectMonth")} onSelect={onMonthChange}>
                                                    {months.map(item => <Option key={item.id} value={item.id}>{t(item.name)}</Option>)}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item
                                                label={t("Year")}
                                                name="DocYear"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("pleaseSelect"),
                                                    },
                                                ]}
                                            >
                                                <InputNumber className={classes['year-input']} onChange={onYearChange} />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item
                                                label={t("division")}
                                                name="DivisionID"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("inputValidData"),
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder={t("division")}
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    onChange={divisionChangeHandler}
                                                // onChange={handleCommentChange}
                                                >
                                                    {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item
                                                label={t("department")}
                                                name="DepartmentID"
                                            >
                                                <Select
                                                    placeholder={t("department")}
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                // onChange={divisionChangeHandler}
                                                >
                                                    {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item
                                                label={t("RoundingTypeID")}
                                                name="RoundingTypeID"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("inputValidData"),
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder={t("RoundingTypeID")}
                                                    style={{ width: '100%' }}
                                                    optionFilterProp="children"
                                                    onChange={roundingChangeHandler}
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {roundingTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col xl={24} lg={24}>
                                            <Form.Item
                                                label={t("Comment")}
                                                name="Comment"
                                            >

                                                <TextArea
                                                    disabled={disabledComment}
                                                    rows={2}
                                                />

                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xl={12} lg={12}>
                                <Card
                                    hoverable
                                    title="Card"
                                    size='small'
                                    className='inputs-wrapper-card'
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Row gutter={[10, 10]}>
                                        <Col xl={10} lg={12}>
                                            <Form.Item
                                                label={t("Typeofcalculation")}
                                                name="SubCalculationKindID"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("inputValidData"),
                                                    },
                                                ]}

                                            >
                                                <Select
                                                    placeholder={t("Typeofcalculation")}
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    onChange={SelectChange}
                                                    onSelect={onSubCalcChange}
                                                >
                                                    {payrollList.map(item => <Option key={item.ID} value={item.ID} data-parent={item.ParentID}>{item.Name}</Option>)}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xl={9} lg={12}>
                                            <Form.Item
                                                label={t("OrganizationsSettlementAccount")}
                                                name="OrganizationsSettlementAccountID"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("inputValidData"),
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder={t("OrganizationsSettlementAccount")}
                                                    style={{ width: '100%' }}
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
                                        <Col xl={15} lg={12}>
                                            {subAccListNode}
                                        </Col>
                                        <Col xl={9} lg={12}>
                                            {itemOfExpense}
                                        </Col>
                                        {/* <Col xl={12} lg={12}>
                                            {ignoreCustomPercentage}
                                        </Col> */}
                                        {/* <Col xl={12} lg={12}>
                                            {isAfterPrePayment}
                                        </Col> */}
                                        <Col xl={12} lg={12}>
                                            {isFinallyCalculation}
                                        </Col>
                                        <Col xl={12} lg={12}>
                                            {isAliment}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                    {/* Vedmost Table */}
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={t("Bill")} key="1">
                            <Form form={tableForm}
                                component={false}
                                scrollToFirstError
                                onValuesChange={onTableValuesChange}
                            >
                                {employeeStateModal && (
                                    <AddTableModal
                                        visible={employeeStateModal}
                                        onCancel={() => setEmployeeState(false)}
                                        onCreate={createTableDataHandler}
                                        payrollDocsTables={payrollDocsTables}
                                        getModalData={getModalData}
                                        parentId={parentId}
                                        currentDocId={currentDocId}
                                    />
                                )}

                                <Form
                                    onFinish={onTableFilterHandler}
                                    onFinishFailed={onTableFilterFailedHandler}
                                >

                                    <div className={classes.buttons}>

                                        <Button type="primary"
                                            disabled={disabledAddBtn}
                                            onClick={AddBtn}
                                        >{t('add')}
                                        </Button>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            form="mainForm"
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
                                    <div className={classes.filterData}>
                                        <Form.Item
                                            label={t('PrsNum')}
                                            name="PersonnelNumber"
                                        >
                                            <InputNumber
                                                min={0}
                                                form="mainForm"
                                                placeholder={t('PrsNum')} />
                                        </Form.Item>

                                        <Form.Item
                                            label={t('fio')}
                                            name="Search"
                                        >
                                            <Input placeholder={t('fio')} />
                                        </Form.Item>

                                        <Button type="primary" htmlType="submit">
                                            <i className="feather icon-refresh-ccw" />
                                        </Button>

                                    </div>
                                </Form>

                                {payrollDocsTables.length === 0 ?
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                                    <Table
                                        bordered
                                        rowClassName={setRowClassName}
                                        className="main-table inner-table"
                                        showSorterTooltip={false}
                                        dataSource={payrollDocsTables}
                                        columns={mergedColumns}
                                        loading={tableLoading}
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
                                            y: '80vh'
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


                        {/* Payroll Calculation */}
                        {
                            !isFinalCalculation &&
                            <TabPane tab={t("PayCalc")} key="2">

                                <Form
                                    form={tableForm}
                                    component={false}
                                    scrollToFirstError
                                    onValuesChange={onTableValuesChange}
                                >
                                    <div className={classes.buttons}>

                                        {employeeStateModal && (
                                            <AddTableModal
                                                visible={employeeStateModal}
                                                onCancel={() => setEmployeeState(false)}
                                                onCreate={createTableDataHandler}
                                                payrollDocsTables={payrollDocsTables}
                                                getModalData={getModalData}

                                            />
                                        )}

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            form="mainForm"
                                        >
                                            {t("fill")}
                                        </Button>

                                        <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("deleted")}</Button>

                                        <Form.Item
                                            label={t('PrsNum')}
                                            name="PersonNumber"
                                        >
                                            <InputNumber style={{ width: 80 }} min={0} placeholder={t('PrsNum')} />
                                        </Form.Item>

                                        <Form.Item
                                            label={t('fio')}
                                            name="EmpFullName"
                                        >
                                            <Input placeholder={t('fio')} />
                                        </Form.Item>

                                        <Button type="primary" htmlType="submit">
                                            <i className="feather icon-refresh-ccw" />
                                        </Button>

                                    </div>
                                    {payrollDocsTables.length === 0 ?
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                                        <Table
                                            bordered
                                            rowClassName="editable-row table-row"
                                            className="main-table inner-table"
                                            showSorterTooltip={false}
                                            dataSource={payrollDocsTables}
                                            columns={mergedColumns2}
                                            loading={tableLoading}
                                            rowKey={(record) => record.ID === 0 ? record.key : record.ID}
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
                                                            edit(record)
                                                        }
                                                    },
                                                };
                                            }}
                                        />}

                                </Form>
                            </TabPane>
                        }
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
export default EditPayrollSheet;