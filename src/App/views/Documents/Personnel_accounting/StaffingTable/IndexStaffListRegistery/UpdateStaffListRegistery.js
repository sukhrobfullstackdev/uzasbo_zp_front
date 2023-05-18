import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Form, Row, Col, DatePicker, InputNumber, Select, Input, Button, Table, Space, Tooltip, Tabs } from 'antd';
import { useLocation, useHistory } from 'react-router';
import { useTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';

import MainCard from "../../../../../components/MainCard";
import { Notification } from "../../../../../../helpers/notifications";
import HelperServices from "../../../../../../services/Helper/helper.services";
import StaffListServices from "../../../../../../services/Documents/Personnel_accounting/StaffingTable/StaffList/StaffList.services";
import PostionServices from "../../../../../../services/References/Global/Position/Position.services";
import DepartmentServices from "../../../../../../services/References/Organizational/Department/department.services";
import TariffScaleServices from "../../../../../../services/References/Global/TariffScale/TariffScale.services";
import TablesReceived from '../StaffList/components/TablesReceived';
import TablesNotReceived from '../StaffList/components/TablesNotReceived';
import RowsTable from './components/RowsTable';
import OrganizationsSettlementAccountServices from '../../../../../../services/References/Organizational/OrganizationsSettlementAccount/OrganizationsSettlementAccount.services';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
let tableRowChanged = false;

const UpdateStaffListRegistery = (props) => {
    const { t } = useTranslation();
    const [mainForm] = Form.useForm();
    const [staffTableForm] = Form.useForm();
    const [rowTableForm] = Form.useForm();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const organizationsSettlementAccountID = queryParams.get('OrganizationsSettlementAccountID');
    const staffListTypeID = queryParams.get('StaffListTypeID');
    const id = queryParams.get('id');
    const isClone = queryParams.get('IsClone') ? queryParams.get('IsClone') : false;
    const history = useHistory();
    const StaffListIndexOblastView = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('StaffListIndexOblastView');

    const [staffList, setStaffList] = useState({});
    const [orgSettleAcc, setOrgSettleAcc] = useState([]);
    const [staffListType, setStaffListType] = useState([]);
    const [staffGroupList, setStaffGroupList] = useState([]);
    const [organizationFunctionalItemList, setOrganizationFunctionalItemList] = useState([]);
    const [posList, setPosList] = useState([]);
    const [posQualList, setPosQualList] = useState([]);
    const [posPerList, setPosPerList] = useState([]);
    const [posSalaryTypeList, setPosSalaryTypeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [tariffScaleList, setTariffScaleList] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    // Staff table states
    const [staffTableData, setStaffTableData] = useState([]);
    const [staffTableRowId, setStaffTableRowId] = useState(null);
    const [rowTableData, setRowTableData] = useState([]);
    const [receivedTableData, setReceivedTableData] = useState([]);
    const [notReceivedTableData, setNotReceivedTableData] = useState([]);
    // End Staff table states
    const [minSalary, setMinSalary] = useState(0);
    const [totalSum, setTotalSum] = useState(0);
    const [loading, setLoading] = useState(true);

    let allowances = Object.fromEntries(Object.entries(staffList).filter(([key]) => key.includes('Allowance')));
    let allowancesObj = [];

    useEffect(() => {
        const fetchData = async () => {
            let docId;
            if (props.match.params.id) {
                docId = props.match.params.id;
            } else if (isClone && id) {
                docId = id;
            } else {
                docId = 0
            }

            const [staffLs, staffLsType, orgSetAcc, orgFuncItem, staffGrList, posQualLs, posPerLs, posSalaryTypeLs, departmentLs, tariffScaleLs] = await Promise.all([
                StaffListServices.getRegistery(docId),
                HelperServices.getStaffListType(),
                OrganizationsSettlementAccountServices.GetAll(),
                HelperServices.GetOrganizationFunctionalItem(),
                HelperServices.getStaffListGroupList(),
                HelperServices.GetPositionQualificationList(),
                HelperServices.GetPositionPeriodicityList(),
                HelperServices.GetPositionSalaryTypeList(),
                DepartmentServices.getAll(),
                TariffScaleServices.getAll()
            ]);

            // console.log(staffLs);
            const minSalary = await HelperServices.GetMinimalSalary(staffLs.data.Date);
            const posLs = await PostionServices.getAll(organizationsSettlementAccountID ? organizationsSettlementAccountID : staffLs.data.SettlementAccountID);
            // const posLs = await PostionServices.getAll(organizationsSettlementAccountID);
            // if (props.match.params.id) {
            //   const departmentLs = await HelperServices.getDepartmentList(leavePayment.data.DivisionID);
            // }                                        
            setStaffList(staffLs.data);
            setTotalSum(staffLs.data.TotalSum);
            setStaffTableData(staffLs.data.Tables);
            setRowTableData(staffLs.data.Rows);
            setReceivedTableData(staffLs.data.TablesReceived);
            setNotReceivedTableData(staffLs.data.TablesNotReceived);
            setStaffListType(staffLsType.data);
            setStaffGroupList(staffGrList.data);
            setOrgSettleAcc(orgSetAcc.data);
            setOrganizationFunctionalItemList(orgFuncItem.data);
            setMinSalary(minSalary.data);
            setPosList(posLs.data);
            setPosQualList(posQualLs.data);
            setPosPerList(posPerLs.data);
            setPosSalaryTypeList(posSalaryTypeLs.data);
            setDepartmentList(departmentLs.data);
            setTariffScaleList(tariffScaleLs.data);
            setLoading(false);
            mainForm.setFieldsValue({
                ...staffLs.data,
                Date: moment(staffLs.data.Date, 'DD.MM.YYYY')
            });
        }
        fetchData().catch(err => {
            // console.log(err);
            Notification('error', err);
            setLoading(false);
        });
    }, [props.match.params.id, mainForm, id, isClone, organizationsSettlementAccountID, staffListTypeID])

    // Staff table functions

    // const filteredColumns = staffTableColumns.filter(item => item !== undefined);

    Object.entries(allowances).forEach(item => {
        if (item[1] === true) {
            let last2 = item[0].slice(-2)
            allowancesObj.push({
                title: `${item[0]}`,
                dataIndex: `AllowanceType${last2}`,
                key: `${item[0]}`,
                // editable: true,
                width: 150,
            })
        }
    });

    const staffTableColumns = [
        {
            title: t("position"),
            dataIndex: "PositionName",
            key: "PositionName",
            width: 250,
            // render: (value) => {
            //     const position = posList.find(item => item.ID === value);
            //     return position ? position.Name : '';
            // }
        },
        {
            title: t("Department"),
            dataIndex: "DepartmentName",
            key: "DepartmentName",
            width: 250,
            // render: (value) => {
            //     const record = departmentList.find(item => item.ID === value);
            //     return record ? record.Name : '';
            // }
        },
        {
            title: t("SubDepartment"),
            dataIndex: "SubDepartmentName",
            width: 200,
        },
        {
            title: t("Sector"),
            dataIndex: "SectorName",
            width: 200,
        },
        {
            title: t("StaffListGroup"),
            dataIndex: "StaffListGroupName",
            width: 250,
        },
        {
            title: t("PositionCategory"),
            dataIndex: "PositionCategoryName",
            width: 250,
        },
        {
            title: t("PositionQualification"),
            dataIndex: "PositionQualificationName",
            width: 250,
        },
        {
            title: t("CategoryGroup"),
            dataIndex: "CategoryGroupName",
            width: 250,
        },
        {
            title: t("Subspecialty"),
            dataIndex: "SubspecialtyName",
            width: 250,
        },
        {
            title: t("StaffQuantity"),
            dataIndex: "StaffQuantity",
            width: 250,
        },
        {
            title: t("PositionPeriodicity"),
            dataIndex: "PositionPeriodicityName",
            width: 200,
        },
        {
            title: t("PPMonthCount"),
            dataIndex: "PPMonthCount",
            width: 200,
        },
        {
            title: t("PositionSalaryType"),
            dataIndex: "PositionSalaryTypeName",
            width: 150,
        },
        {
            title: t("TariffScale"),
            dataIndex: "TariffScaleName",
            width: 250,
        },
        {
            title: t("CorrCoefficient"),
            dataIndex: "CorrCoefficient",
            width: 150,
        },
        {
            title: t("Salary"),
            dataIndex: "Salary",
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        ...allowancesObj,
        {
            title: t("FOT"),
            dataIndex: "FOT",
            width: 150,
            editable: true,
            className: 'disabled-input',
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 80,
            render: (_, record) => (
                <Tooltip title={t("Delete")}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<i className="feather icon-trash-2 action-icon" aria-hidden="true" />}
                        onClick={() => deleteRow(record)}
                    />
                </Tooltip>
            )
        }
    ];

    const mergedStaffColumns = staffTableColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                editing: isEditing(record),
                save: save,
                staffTableForm: staffTableForm,
                fot: col.FOT
            }),
        };
    });

    const isEditing = (record) => {
        const key = record.ID === 0 ? record.key : record.ID;
        return key === editingKey
    };

    const deleteRow = record => {
        record.Status = 3;
    }

    const edit = (record) => {
        staffTableForm.setFieldsValue({
            ...record,
        });
        const key = record.ID === 0 ? record.key : record.ID;
        setEditingKey(key);
    };

    const save = async (key, fot) => {
        try {
            const row = await staffTableForm.validateFields();
            const newData = [...staffTableData];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                item.ID === 0 ? item.Status = 1 : item.Status = 2;
                newData.splice(index, 1, { ...item, ...row });
                if (tableRowChanged) {
                    setStaffTableData(newData);
                    tableRowChanged = false;
                }
                // console.log(newData);
                // staffTableForm.resetFields();
                setEditingKey("");
            } else {
                newData.push(row);
                setEditingKey("");
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
            // alert(errInfo);
            setEditingKey("");
            tableRowChanged = false;
        }
    };

    const addStaffTableDataHandler = useCallback((values) => {
        setStaffTableData((prevState) => [values, ...prevState]);
    }, [])

    const setRowClassName = (record) => {
        return record.key === staffTableRowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
    }

    const onTableValuesChange = () => {
        tableRowChanged = true;
    }

    const onStaffTableRow = (record) => {
        if (editingKey === '') {
            return {
                onDoubleClick: () => {
                    edit(record);
                    let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                    document.addEventListener('click', function clickHandler(event) {
                        let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                        if (!isClickInsideElement) {
                            save(record.ID === 0 ? record.key : record.ID);
                            document.removeEventListener('click', clickHandler);
                        }
                    });
                },
                onClick: () => {
                    setStaffTableRowId(record.key);
                },
            };
        }
    }

    const tableSummaryHandler = pageData => {
        let totalOrderNum = 0;
        let totalFot = 0;

        pageData.forEach(({ OrderNumber, FOT }) => {
            totalOrderNum += +OrderNumber;
            totalFot += +FOT;
        });

        return (
            <>
                <Table.Summary.Row>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalOrderNum)}</Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    {Object.entries(allowances).map(item => {
                        if (item[1] === true) {
                            return (
                                <Table.Summary.Cell key={item[0]}></Table.Summary.Cell>
                            )
                        } else return null;
                    })}
                    <Table.Summary.Cell colSpan={2}>
                        {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalFot)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                </Table.Summary.Row>
            </>
        );
    }

    // End Staff Table functions

    const saveAllHandler = () => {
        mainForm.validateFields()
            .then((values) => {
                setLoading(true);
                values.ID = props.match.params.id ? props.match.params.id : 0;
                values.Date = values.Date.format('DD.MM.YYYY');
                values.Tables = staffTableData;
                values.Rows = rowTableData;
                values.TablesReceived = receivedTableData;
                values.TablesNotReceived = notReceivedTableData;
                StaffListServices.UpdateRegistery({ ...staffList, ...values })
                    .then(res => {
                        Notification("success", t("saved"));
                        setLoading(false);
                        history.push('/IndexStaffListRegistery');
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification('error', err);
                        setLoading(false);
                    })
            })
    }

    const fillTableHandler = async (params) => {
        mainForm.validateFields()
            .then((values) => {
                setLoading(true);
                console.log(values);
                StaffListServices.GetStaffListRegisteryFilTables({
                    FinanceYear: values.Year,
                    OrganizationFunctionalItemCode: values.OrganizationFunctionalItemCode,
                    SettleCodeLevel: values.SettleCodeLevel,
                    // StaffListGroupID: values.StaffListGroupID,
                    StaffListGroupID: 0,
                    StaffListTypeID: values.StaffListTypeID,
                })
                    .then(res => {
                        // Notification("success", t("saved"));
                        setStaffList(res.data)
                        setTotalSum(res.data.TotalSum)
                        setStaffTableData(res.data.Tables)
                        // setRowTableData(res.data.Rows)
                        setRowTableData((prevState) => [...prevState, ...res.data.Rows]);
                        setReceivedTableData(res.data.TablesReceived)
                        setNotReceivedTableData(res.data.TablesNotReceived)
                        setLoading(false);
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification('error', err);
                        setLoading(false);
                    })
            })
    }

    const clearRowsHandler = () => {
        let deleteData = [...staffTableData];
        let deleteData2 = [...rowTableData];
        deleteData.forEach(item => {
            item.Status = 3;
        })
        deleteData2.forEach(item => {
            item.Status = 3;
        })
        setStaffTableData(deleteData);
        setRowTableData(deleteData2);
        setTotalSum(0);
    };

    return (
        <Fade>
            <MainCard title={t('StaffList')}>
                <Spin spinning={loading} size='large'>
                    <Form
                        {...layout}
                        form={mainForm}
                        id='mainForm'
                    // onFinish={fillTableHandler}
                    // onFinishFailed={fillTableHandlerFailed}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xl={3}>
                                <Form.Item
                                    label={t("Date")}
                                    name="Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}
                                >
                                    <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xl={3}>
                                <Form.Item
                                    label={t("year")}
                                    name="Year"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("inputValidData")
                                        },
                                    ]}
                                >
                                    <InputNumber disabled placeholder={t("year")} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xl={4}>
                                <Form.Item
                                    label={t("StaffListType")}
                                    name="StaffListTypeID"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect")
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        disabled
                                        placeholder={t("StaffListType")}
                                        style={{ width: '100%' }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {staffListType.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            {!StaffListIndexOblastView ? <Col xl={6}>
                                <Form.Item
                                    label={t("SettlementAccount")}
                                    name="SettlementAccountID"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect")
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder={t("SettlementAccount")}
                                        style={{ width: '100%' }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={(_, item) => mainForm.setFieldsValue({
                                            SettlementAccountID: item.value,
                                            SettlementAccountCode: item.Name,
                                            SettleCodeLevel: item.SettleCodeLevel,
                                            OrganizationFunctionalItemCode: item.OrganizationFunctionalItemCode,
                                        })}
                                    >
                                        {orgSettleAcc.map(item => <Option
                                            key={item.ID} Name={item.Name}
                                            SettleCodeLevel={item.SettleCodeLevel}
                                            OrganizationFunctionalItemCode={item.OrganizationFunctionalItemCode}
                                            value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label={t("SettlementAccountCode")}
                                    name="SettlementAccountCode"
                                    hidden
                                >
                                    <Input placeholder={t("SettlementAccountCode")} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col> : <>
                                <Col xl={4}>
                                    <Form.Item
                                        label={t("OrganizationFunctionalItem")}
                                        name="OrganizationFunctionalItemID"
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder={t("StaffListGroup")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(_, item) => mainForm.setFieldsValue({
                                                OrganizationFunctionalItemCode: item.OrganizationFunctionalItemCode,
                                            })}
                                        >
                                            {organizationFunctionalItemList.map(item => <Option key={item.ID} OrganizationFunctionalItemCode={item.Name} value={item.ID}>{item.Name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </>
                            }

                            {/* <Col xl={6}> */}
                            <Form.Item
                                label={t("StaffListGroup")}
                                name="StaffListGroupID"
                                hidden
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("StaffListGroup")}
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {staffGroupList.map(item => <Option key={item.ID} value={item.ID}>{item.NameRus}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("OrganizationFunctionalItemCode")}
                                name="OrganizationFunctionalItemCode"
                                hidden
                            >
                                <Input placeholder={t("OrganizationFunctionalItemCode")} style={{ width: '100%' }} />
                            </Form.Item>
                            <Col xl={4}>
                                <Form.Item
                                    label={t("SettleCodeLevel")}
                                    name="SettleCodeLevel"
                                    hidden={!StaffListIndexOblastView}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect")
                                        },
                                    ]}
                                >
                                    <InputNumber placeholder={t("year")} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            {/* </Col> */}
                            <Col xl={4}>
                                <Form.Item
                                    label={t("minSalary")}
                                >
                                    {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(minSalary)}
                                </Form.Item>
                            </Col>
                            <Col xl={4}>
                                <Form.Item
                                    label={t("sum")}
                                >
                                    {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalSum)}
                                </Form.Item>
                            </Col>
                            <Col xl={4}>
                                <Form.Item
                                    label={t("month")}
                                    name="ForMonths"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("inputValidData")
                                        },
                                    ]}
                                >
                                    <InputNumber disabled placeholder={t("month")} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item
                                    label={t("Comment")}
                                    name="Comment"
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: t("inputValidData")
                                //     },
                                // ]}
                                >
                                    <TextArea placeholder={t("Comment")} rows={1} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            onClick={fillTableHandler}
                        // disabled={tableData.filter(item => item.Status !== 3).length > 0}
                        >
                            {t("Tuldirish")}
                        </Button>
                        <Button
                            // disabled={cantEdit}
                            onClick={clearRowsHandler}
                        >{t("Tozalash")}</Button>
                    </Space>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={t('Staffingtable')} key="1">
                            <Form
                                form={staffTableForm}
                                onValuesChange={onTableValuesChange}
                                // onFinish={addStaffTableDataHandler}
                                component={false}
                            >
                                <Table
                                    bordered
                                    size='middle'
                                    pagination={false}
                                    rowClassName={setRowClassName}
                                    className="main-table"
                                    rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                    columns={mergedStaffColumns}
                                    dataSource={staffTableData.filter(item => item.Status !== 3)}
                                    onRow={(record) => onStaffTableRow(record)}
                                    scroll={{
                                        x: "max-content",
                                        y: '90vh'
                                    }}
                                    summary={pageData => tableSummaryHandler(pageData)}
                                />
                            </Form>
                            <div style={{ margin: 64 }}>
                                <RowsTable rowTableData={rowTableData.filter(item => item.Status !== 3)} />
                            </div>
                        </TabPane>
                        <TabPane tab={t('received')} key="2">
                            <TablesReceived receivedTableData={receivedTableData} />
                        </TabPane>
                        <TabPane tab={t('notReceived')} key="3">
                            <TablesNotReceived notReceivedTableData={notReceivedTableData} />
                        </TabPane>
                    </Tabs>

                    <Space size='middle' className='btns-wrapper'>
                        <Button
                            type="danger"
                            onClick={() => {
                                Notification("warning", t("not-saved"));
                                history.goBack();
                            }}
                        >
                            {t("back")}
                        </Button>
                        <Button
                            onClick={saveAllHandler}
                            type="primary"
                        // disabled={disabledActions}
                        >
                            {t("save")}
                        </Button>
                    </Space>
                </Spin>
            </MainCard>
        </Fade>
    );
};

export default UpdateStaffListRegistery;