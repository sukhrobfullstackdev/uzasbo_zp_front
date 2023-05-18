import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Spin, Form, Row, Col, DatePicker, InputNumber, Select, Input, Button, Table, Space, Tooltip, Card } from 'antd';
import { useLocation, useHistory } from 'react-router';
import { useTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';

import { Notification } from "../../../../../../helpers/notifications";
import HelperServices from "../../../../../../services/Helper/helper.services";
import StaffListServices from "../../../../../../services/Documents/Personnel_accounting/StaffingTable/StaffList/StaffList.services";
import PostionServices from "../../../../../../services/References/Global/Position/Position.services";
import DepartmentServices from "../../../../../../services/References/Organizational/Department/department.services";
import TariffScaleServices from "../../../../../../services/References/Global/TariffScale/TariffScale.services";
import RowsTable from './components/RowsTable';
import classes from "../StaffList/StaffList.module.css";

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
let tableRowChanged = false;


const ViewStaffList = (props) => {
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

    const [staffList, setStaffList] = useState({});
    const [orgSettleAcc, setOrgSettleAcc] = useState([]);
    const [staffListType, setStaffListType] = useState([]);
    const [staffGroupList, setStaffGroupList] = useState([]);
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
    // End Staff table states
    const [minSalary, setMinSalary] = useState(null);
    const [categorygrouplist, setCategorygrouplist] = useState([]);
    const [subspecialtylist, setSubspecialtylist] = useState([]);
    const [StaffListGroupID, setStaffListGroupID] = useState(null);
    const [XTV, setXTV] = useState(false);
    const [loading, setLoading] = useState(true);

    let allowances = Object.fromEntries(Object.entries(staffList).filter(([key]) => key.includes('Allowance')));
    let allowancesObj = [];
    let someTablesObj = [];

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

            const [staffLs, staffLsType, orgSetAcc, staffGrList, posQualLs, posPerLs, posSalaryTypeLs, departmentLs, tariffScaleLs] = await Promise.all([
                StaffListServices.getById(docId, organizationsSettlementAccountID, staffListTypeID, isClone),
                HelperServices.getStaffListType(),
                HelperServices.getOrganizationsSettlementAccountList(),
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
            const categorygrouplist = await HelperServices.GetCategorygroupList({ SettlementAccountID: staffLs.data.SettlementAccountID });
            const subspecialtylist = await HelperServices.GetCategorygroupList({ SettlementAccountID: staffLs.data.SettlementAccountID });
            // const posLs = await PostionServices.getAll(organizationsSettlementAccountID);
            // if (props.match.params.id) {
            //   const departmentLs = await HelperServices.getDepartmentList(leavePayment.data.DivisionID);
            // }
            setStaffList(staffLs.data);
            staffLs.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setStaffTableData(staffLs.data.Tables);
            setStaffListGroupID(staffLs.data.StaffListGroupID);
            setRowTableData(staffLs.data.Rows);
            let thisStaffListType = await staffLsType.data.find(item => item.ID === staffLs.data.StaffListTypeID);
            setStaffListType([thisStaffListType]);
            let thisStaffGrList= await staffGrList.data.find(item => item.ID === staffLs.data.StaffListGroupID);
            setStaffGroupList([thisStaffGrList]);
            let thisOrgSetAcc = await orgSetAcc.data.find(item => item.ID === staffLs.data.SettlementAccountID);
            setOrgSettleAcc([thisOrgSetAcc]);
            setMinSalary(minSalary.data);
            setPosList(posLs.data);
            setPosQualList(posQualLs.data);
            setPosPerList(posPerLs.data);
            setPosSalaryTypeList(posSalaryTypeLs.data);
            setDepartmentList(departmentLs.data);
            setTariffScaleList(tariffScaleLs.data);
            setCategorygrouplist(categorygrouplist.data);
            setSubspecialtylist(subspecialtylist.data);
            setXTV(staffLs.data.SettlementAccountItemOfExpense);
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
        if (item[0] === 'Allowance01' && item[1] === true) {
            someTablesObj = [
                {
                    title: t("CategoryGroupID"),
                    dataIndex: "CategoryGroupID",
                    key: "CategoryGroupID",
                    width: 250,
                },
                {
                    title: t("Subspecialty"),
                    dataIndex: "SubspecialtyID",
                    key: "SubspecialtyID",
                    width: 250,
                },
            ]
        }
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
            dataIndex: "DepartmentID",
            key: "DepartmentID",
            width: 250,
            render: (value) => {
                const record = departmentList.find(item => item.ID === value);
                return record ? record.Name : '';
            }
        },
        // {
        //     title: t("SubDepartment"),
        //     dataIndex: "SubDepartmentName",
        //     width: 250,
        // },
        // {
        //     title: t("Sector"),
        //     dataIndex: "SectorName",
        //     width: 250,
        // },
        // ...someTablesObj,
        {
            title: t("PositionQualification"),
            dataIndex: "PositionQualificationID",
            width: 250,
            render: (value) => {
                const record = posQualList.find(item => item.ID === value);
                return record ? record.Name : value;
            }
        },
        {
            title: t("StaffQuantity"),
            dataIndex: "StaffQuantity",
            width: 150,
        },
        {
            title: t("PositionPeriodicity"),
            dataIndex: "PositionPeriodicityID",
            width: 200,
            render: (value) => {
                const record = posPerList.find(item => item.ID === value);
                return record ? record.Name : value;
            }
        },
        {
            title: t("PPMonthCount"),
            dataIndex: "PPMonthCount",
            width: 200,
        },
        {
            title: t("PositionSalaryType"),
            dataIndex: "PositionSalaryTypeID",
            width: 150,
            render: (value) => {
                const record = posSalaryTypeList.find(item => item.ID === value);
                return record ? record.Name : value;
            }
        },
        {
            title: t("TariffScale"),
            dataIndex: "TariffScaleID",
            width: 250,
            render: (value) => {
                const record = tariffScaleList.find(item => item.ID === value);
                return record ? record.Name : value;
            }
        },
        {
            title: t("TariffScaleTableName"),
            dataIndex: "TariffScaleTableName",
            width: 250,
        },
        {
            title: t("CorrCoefficient"),
            dataIndex: "CorrCoefficient",
            width: 150,
        },
        {
            title: t("totalSalary"),
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
    ];

    const staffTableColumnsXTV = [
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
        // {
        //     title: t("Department"),
        //     dataIndex: "DepartmentName",
        //     key: "DepartmentName",
        //     width: 250,
        //     // render: (value) => {
        //     //     const record = departmentList.find(item => item.ID === value);
        //     //     return record ? record.Name : '';
        //     // }
        // },
        // {
        //     title: t("SubDepartment"),
        //     dataIndex: "SubDepartmentName",
        //     width: 250,
        // },
        // {
        //     title: t("Sector"),
        //     dataIndex: "SectorName",
        //     width: 250,
        // },
        // ...someTablesObj,
        {
            title: t("PositionQualification"),
            dataIndex: "PositionQualificationID",
            width: 250,
            render: (value) => {
                const record = posQualList.find(item => item.ID === value);
                return record ? record.Name : value;
            }
        },
        {
            title: t("StaffQuantity"),
            dataIndex: "StaffQuantity",
            width: 150,
        },
        {
            title: t("PositionPeriodicity"),
            dataIndex: "PositionPeriodicityID",
            width: 200,
            render: (value) => {
                const record = posPerList.find(item => item.ID === value);
                return record ? record.Name : value;
            }
        },
        {
            title: t("PPMonthCount"),
            dataIndex: "PPMonthCount",
            width: 200,
        },
        {
            title: t("PositionSalaryType"),
            dataIndex: "PositionSalaryTypeID",
            width: 150,
            render: (value) => {
                const record = posSalaryTypeList.find(item => item.ID === value);
                return record ? record.Name : value;
            }
        },
        {
            title: t("TariffScale"),
            dataIndex: "TariffScaleID",
            width: 250,
            render: (value) => {
                const record = tariffScaleList.find(item => item.ID === value);
                return record ? record.Name : value;
            }
        },
        {
            title: t("TariffScaleTableName"),
            dataIndex: "TariffScaleTableName",
            width: 250,
        },
        {
            title: t("CorrCoefficient"),
            dataIndex: "CorrCoefficient",
            width: 150,
        },
        {
            title: t("totalSalary"),
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

    const mergedStaffColumnsXTV = staffTableColumnsXTV.map((col) => {
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
        // record.Status = 3;
        let deleted = staffTableData.map(row => {
            if (row.key === record.key) {
                row.Status = 3;
            };
            return row;
        })
        setStaffTableData(deleted)
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
        return record.ID === staffTableRowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
    }

    const onTableValuesChange = () => {
        tableRowChanged = true;
    }

    const onStaffTableRow = (record) => {
        // if (editingKey === '') {
        //     return {
        //         onDoubleClick: () => {
        //             edit(record);
        //             let ignoreClickOnMeElement = document.querySelector('.clicked-row');
        //             document.addEventListener('click', function clickHandler(event) {
        //                 let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
        //                 if (!isClickInsideElement) {
        //                     save(record.ID === 0 ? record.key : record.ID);
        //                     document.removeEventListener('click', clickHandler);
        //                 }
        //             });
        //         },
        //         onClick: () => {
        //             setStaffTableRowId(record.key);
        //         },
        //     };
        // }
        return {
            onClick: () => {
                setStaffTableRowId(record.ID);
            },
        }
    }

    const tableSummaryHandler = pageData => {
        let totalOrderNum = 0;
        let totalFot = 0;

        pageData.forEach(({ StaffQuantity, FOT }) => {
            totalOrderNum += +StaffQuantity;
            totalFot += +FOT;
        });

        return (
            <>
                <Table.Summary.Row>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    {/* <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell> */}
                    {/* {Object.keys(someTablesObj).map(item => <Table.Summary.Cell key={item[0]}></Table.Summary.Cell>)} */}
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalOrderNum)}</Table.Summary.Cell>
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

    const tableSummaryHandlerXTV = pageData => {
        let totalOrderNum = 0;
        let totalFot = 0;

        pageData.forEach(({ StaffQuantity, FOT }) => {
            totalOrderNum += +StaffQuantity;
            totalFot += +FOT;
        });

        return (
            <>
                <Table.Summary.Row>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    {/* <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell> */}
                    {/* {Object.keys(someTablesObj).map(item => <Table.Summary.Cell key={item[0]}></Table.Summary.Cell>)} */}
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalOrderNum)}</Table.Summary.Cell>
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

    const fillTableHandler = async (params) => {
        mainForm.validateFields()
            .then((values) => {
                setLoading(true);
                values.ID = props.match.params.id ? props.match.params.id : 0;
                values.Date = values.Date.format('DD.MM.YYYY');
                values.Tables = staffTableData;
                values.Rows = rowTableData;
                StaffListServices.FillStaffList({ ...staffList, ...values })
                    .then(res => {
                        // Notification("success", t("saved"));
                        setStaffList(res.data)
                        setRowTableData(res.data.Rows)
                        setLoading(false);
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification('error', err);
                        setLoading(false);
                    })
            })
    }

    const saveAllHandler = () => {
        mainForm.validateFields()
            .then((values) => {
                setLoading(true);
                values.ID = props.match.params.id ? props.match.params.id : 0;
                values.Date = values.Date.format('DD.MM.YYYY');
                values.Tables = staffTableData;
                values.Rows = rowTableData;
                // console.log({ ...staffList, ...values });
                StaffListServices.postData({ ...staffList, ...values })
                    .then(res => {
                        Notification("success", t("saved"));
                        setLoading(false);
                        history.push('/StaffList');
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification('error', err);
                        setLoading(false);
                    })
            })
    }

    return (
        <Fade>
            <Row gutter={[16, 16]}>
                <Col xl={14}>
                    <Card
                        title={<div style={{ fontSize: 22 }}>{t('StaffList')}</div>}
                        className='card'
                        bordered={false}
                    >
                        <Spin spinning={loading} size='large'>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("Date")}: </div><div className={classes.value}>
                                    {staffList.Date}
                                </div>
                            </div>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("year")}: </div><div className={classes.value}>
                                    {staffList.Year}
                                </div>
                            </div>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("Date")}: </div><div className={classes.value}>
                                    {staffGroupList[0]?.NameRus}
                                </div>
                            </div>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("Comment")}: </div><div className={classes.value}>
                                    {staffList.Comment}
                                </div>
                            </div>
                            {/* <Form
                                {...layout}
                                form={mainForm}
                                id='mainForm'
                            // onFinish={fillTableHandler}
                            // onFinishFailed={fillTableHandlerFailed}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col md={6} span={12}>
                                        <Form.Item
                                            label={t("Date")}
                                            name="Date"
                                            style={{ margin: 0 }}
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
                                    <Col md={6} span={12}>
                                        <Form.Item
                                            label={t("year")}
                                            name="Year"
                                            style={{ margin: 0 }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("inputValidData")
                                                },
                                            ]}
                                        >
                                            <InputNumber placeholder={t("year")} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col md={12} span={24}>
                                        <Form.Item
                                            label={t("StaffListGroup")}
                                            name="StaffListGroupID"
                                            style={{ margin: 0 }}
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
                                                placeholder={t("StaffListGroup")}
                                                style={{ width: '100%' }}
                                                optionFilterProp="children"
                                                onChange={(e) => setStaffListGroupID(e)}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {staffGroupList.map(item => <Option key={item.ID} value={item.ID}>{item.NameRus}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col md={24} xs={24}>
                                        <Form.Item
                                            label={t("Comment")}
                                            name="Comment"
                                            style={{ margin: 0 }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("inputValidData")
                                                },
                                            ]}
                                        >
                                            <TextArea placeholder={t("Comment")} rows={2} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form> */}
                        </Spin>
                    </Card>
                </Col>
                <Col xl={10}>
                    <Card className='card' bordered={false}>
                        <Spin spinning={loading} size='large'>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("minSalary")}: </div><div className={classes.value}>
                                    {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(minSalary)}
                                </div>
                            </div>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("sum")}: </div><div className={classes.value}>
                                    {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(staffList.TotalSum)}
                                </div>
                            </div>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("month")}: </div><div className={classes.value}>
                                    {staffList.ForMonths}
                                </div>
                            </div>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("StaffListType")}: </div><div className={classes.value}>
                                    {staffListType[0]?.DisplayName}
                                </div>
                            </div>
                            <div className={classes.orgInfo}>
                                <div className={classes.key}>{t("SettlementAccount")}: </div><div className={classes.value}>
                                    {orgSettleAcc[0]?.Code}
                                </div>
                            </div>
                            {/* <Form
                                {...layout}
                                form={mainForm}
                                id='mainForm'
                            // onFinish={fillTableHandler}
                            // onFinishFailed={fillTableHandlerFailed}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col span={12} md={8}>
                                        <Form.Item
                                            label={t("minSalary")}
                                            style={{ margin: 0 }}
                                        >
                                            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(minSalary)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} md={8}>
                                        <Form.Item
                                            label={t("sum")}
                                            style={{ margin: 0 }}
                                        >
                                            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(staffList.TotalSum)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} md={8}>
                                        <Form.Item
                                            label={t("month")}
                                            name="ForMonths"
                                            style={{ margin: 0 }}
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
                                    <Col span={12} md={24}>
                                        <Form.Item
                                            label={t("StaffListType")}
                                            name="StaffListTypeID"
                                            style={{ margin: 0 }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("pleaseSelect")
                                                },
                                            ]}
                                        >
                                            <Select
                                                disabled
                                                allowClear
                                                showSearch
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
                                    <Col span={24} md={24}>
                                        <Form.Item
                                            label={t("SettlementAccount")}
                                            name="SettlementAccountCode"
                                            // name="SettlementAccountID"
                                            style={{ margin: 0 }}
                                        >
                                            <Select
                                                disabled
                                                allowClear
                                                showSearch
                                                placeholder={t("SettlementAccount")}
                                                style={{ width: '100%' }}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {orgSettleAcc.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form> */}
                        </Spin>
                    </Card>
                </Col>
            </Row>
            <Card className='card' bordered={false} style={{ marginTop: 32 }}>
                <Spin spinning={loading} size='large'>
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
                            columns={staffList?.SettlementAccountItemOfExpense !== "7092100075" ? mergedStaffColumns : mergedStaffColumnsXTV}
                            dataSource={staffTableData.filter(item => item.Status !== 3)}
                            onRow={(record) => onStaffTableRow(record)}
                            scroll={{
                                x: "max-content",
                                y: '90vh'
                            }}
                            summary={pageData => staffList?.SettlementAccountItemOfExpense !== "7092100075" ? tableSummaryHandler(pageData) : tableSummaryHandlerXTV(pageData)}
                        />
                    </Form>

                    <div style={{ margin: '32px 0px' }}>
                        <Table
                            bordered
                            size='middle'
                            pagination={false}
                            rowClassName={'table-row'}
                            className="main-table"
                            columns={[
                                {
                                    title: t("StaffListRowType"),
                                    dataIndex: "StaffListRowTypeName",
                                    key: "StaffListRowTypeName",
                                    sorter: true,
                                    width: 200,
                                    render: record => <div className="ellipsis-2">{record}</div>
                                },
                                {
                                    title: t("StaffQuantity"),
                                    dataIndex: "StaffQuantity",
                                    key: "StaffQuantity",
                                    sorter: true,
                                    width: 50,
                                    render: record => new Intl.NumberFormat('ru-RU', {}).format(record),
                                },
                                {
                                    title: t("FOT"),
                                    dataIndex: "FOT",
                                    key: "FOT",
                                    sorter: true,
                                    width: 50,
                                    render: (_, record) => new Intl.NumberFormat('ru-RU', {}).format(record.FOT),
                                },
                            ]}
                            dataSource={rowTableData}
                            scroll={{
                                x: "max-content",
                                y: '90vh'
                            }}
                        />
                    </div>

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
                    </Space>
                </Spin>
            </Card>
        </Fade>
    );
};

export default React.memo(ViewStaffList);