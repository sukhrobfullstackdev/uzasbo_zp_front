import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Input, InputNumber, Select, Spin, Card, Switch, Tabs, Table, Typography, Popconfirm } from "antd";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import moment from "moment";

import MainCard from "../../../../../components/MainCard";
import classes from "./BLHoursGridForClass.module.css";
import { Notification } from "../../../../../../helpers/notifications";
// import HelperServices from "../../../../../../services/Helper/helper.services";
import ClassTitleServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitle.services";
import BLHoursGridForClassServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/BLHoursGridForClass/BLHoursGridForClass.services";
import BasicEducationalPlanServices from "../../../../../../services/References/Organizational/BasicEducationalPlan/BasicEducationalPlan.services";
import { useRef } from "react";
import { useContext } from "react";
import { useCallback } from "react";
//import EditableCell from "./EditableCell";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    // console.log(props);
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EdittableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    tableList,
    ...restProps
}) => {
    // console.log(dataIndex);
    const [editing, setEditing] = useState(false);
    const [defaultValue, setDefaultValue] = useState(null);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            let status = 0;
            if (record.Status === 0) {
                status = 2;
            } else if (record.Status === 1) {
                status = 1;
            }
            toggleEdit();
            handleSave({ ...record, ...values, Status: status });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable && (dataIndex === 'DividedSciences' && record.ParentID !== 0
        // && record.CanEdit === true
    )) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('Sum')}
                    defaultValue={defaultValue}
                    onChange={(e) => {
                        if (0 < e.target.value < record.TotalHours) {
                            setDefaultValue(0)
                        } else setDefaultValue(record.TotalHours)
                    }}
                    min={0}
                    max={record.TotalHours}
                />
            </Form.Item>
        ) : (
            <div
                className={`editable-cell-value-wrap`}
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    return <td {...restProps}>
        {childNode}
    </td>;
};


const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
let tableRowChanged = false;

const UpdateBLHoursGridForClass = (props) => {
    const [rowId, setRowId] = useState(null);
    //const [hoursGridSheet, setBLHoursGridForClass] = useState([]);
    // const [classTitle, setClassTitle] = useState([]);
    const [loader, setLoader] = useState(true);
    const [classTitleTableList, setClassTitleTableList] = useState([]);
    const [attachedClassTitleTableList, setAttachedClassTitleTableList] = useState([]);
    const [disabledComment, setDisabledComment] = useState(false);
    const [editingKey, setEditingKey] = useState("");
    const [startYear, setStartYear] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [tablesTeachingAtHome, setTablesTeachingAtHome] = useState([]);
    const [backendTableData, setBackendTableData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [disabledAttachedClassName, setDisabledAttachedClassName] = useState(true);
    const [disabledClassName, setDisabledClassName] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [editingRowTeachingAtHome, setEditingRowTeachingAtHome] = useState(null);
    const [regularHours, setRegularHours] = useState(0);
    const [Hours, setHours] = useState(0);
    const [Hours2, setHours2] = useState(0);
    const [fillLoading, setFillLoading] = useState(false);
    const [ClassNumberID, setClassNumberID] = useState(0);
    const [IsVariative, setIsVariative] = useState(false);
    const [form] = Form.useForm();
    const inputRef = useRef();
    const docId = props.match.params.id ? props.match.params.id : 0;

    const { t } = useTranslation();

    const history = useHistory();
    const [mainForm] = Form.useForm();
    const [tableForm] = Form.useForm();
    const docTitle = docId === 0 ? t('BLHoursGridForClass') : t('BLHoursGridForClass');

    useEffect(() => {
        async function fetchData() {
            try {
                const hoursGridSht = await BLHoursGridForClassServices.getById(docId);
                // const classTitleLt = await ClassTitleServices.GetWithStartYear(hoursGridSht.data.StartYear);
                const classTitleTableLt = await ClassTitleServices.getAll(hoursGridSht.data.StartYear);
                setStartYear(hoursGridSht.data)
                setIsVariative(hoursGridSht.data.IsVariative)
                setTableData(hoursGridSht.data.Tables)
                setTablesTeachingAtHome(hoursGridSht.data.TablesTeachingAtHome)
                let totalHours = 0;
                let totalHours2 = 0;
                hoursGridSht.data.Tables.forEach(item => {
                    if (item.ParentID === 0 && item.Status !== 3) {
                        totalHours += item.TotalHours
                    }
                })
                hoursGridSht.data.TablesTeachingAtHome.forEach(item => {
                    if (item.ParentID === 0 && item.Status !== 3) {
                        totalHours2 += item.TotalHours
                    }
                })
                setRegularHours(totalHours)
                setHours(totalHours)
                setHours2(totalHours2)
                setClassTitleTableList(classTitleTableLt.data);
                setDisabledComment(true);
                setLoader(false);
                if (docId === 0) {
                    mainForm.setFieldsValue({
                        ...hoursGridSht.data,
                        // ...classTitle.data,
                        ClassTitleTableID: null,
                        BLHGTypeName: null,
                        Date: moment(hoursGridSht.data.Date, 'DD.MM.YYYY'),
                        DocYear: moment().year(),
                        StartYear: moment(hoursGridSht.data.StartYear, 'YYYY'),
                        EndYear: moment(hoursGridSht.data.EndYear, 'YYYY'),
                        // ChildrenCount: classTitleTableLt.data.ChildrenCount,
                        // FemaleCount: classTitleTableLt.data.FemaleCount,
                        // TeachingAtHomeCount: thisTitle.data.TeachingAtHomeCount,


                    });
                } else {
                    const thisTitle = classTitleTableLt.data.find(title => title.ID === hoursGridSht.data.ClassTitleTableID)
                    const attachedClassTitle = await ClassTitleServices.getAll(hoursGridSht.data.StartYear, thisTitle.ClassNumberID);
                    setAttachedClassTitleTableList(attachedClassTitle.data)
                    mainForm.setFieldsValue({
                        ...hoursGridSht.data,
                        // ...classTitle.data,
                        Date: moment(hoursGridSht.data.Date, 'DD.MM.YYYY'),
                        DocYear: moment().year(),
                        StartYear: moment(hoursGridSht.data.StartYear, 'YYYY'),
                        EndYear: moment(hoursGridSht.data.EndYear, 'YYYY'),
                        ChildrenCount: thisTitle.ChildrenCount,
                        FemaleCount: thisTitle.FemaleCount,
                        TeachingAtHomeCount: thisTitle.TeachingAtHomeCount,
                    });
                    setClassNumberID(thisTitle.ClassNumberID)
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [docId, mainForm]);

    const onFinish = async () => {
        // ClassNumber1 = 0;
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed', errorInfo);
    };

    const startYearHandler = (event) => {
        if (event.target.value.length === 4) {
            ClassTitleServices.GetWithStartYear(event.target.value)
                .then(res => {
                    setTableData(res.data.Tables)
                    mainForm.setFieldsValue({
                        ...res.data,
                        Date: moment(res.data.Date, 'DD.MM.YYYY'),
                        DocYear: moment().year(),
                        // ChildrenCount: classTitleTableLt.data.ChildrenCount,
                        FemaleCount: res.data.FemaleCount,
                    })

                })
                .catch(err => Notification('error', err))
        } else {
            console.log("Please enater 4 number")
        }
    }

    const fillTableHandler = async (params) => {
        mainForm.validateFields()
            .then((values) => {
                setFillLoading(true)
                values.Date = values.Date?.format("DD.MM.YYYY");
                values.StartYear = values.StartYear?.format("YYYY");
                values.EndYear = values.EndYear?.format("YYYY");
                BLHoursGridForClassServices.FillBLHoursGridForClass({ ...startYear, ...values })
                    .then(res => {
                        if (res.status === 200) {
                            setTableData(res.data.Tables);
                            // console.log(res.data.Tables);
                            setTablesTeachingAtHome(res.data.TablesTeachingAtHome)
                            let totalHours = 0;
                            let totalHours2 = 0;
                            res.data.Tables.forEach(item => {
                                if (item.ParentID === 0 && item.Status !== 3) {
                                    totalHours += item.TotalHours
                                }
                            })
                            res.data.TablesTeachingAtHome.forEach(item => {
                                if (item.ParentID === 0 && item.Status !== 3) {
                                    totalHours2 += item.TotalHours
                                }
                            })
                            setRegularHours(totalHours)
                            setHours(totalHours)
                            setHours2(totalHours2)
                            setFillLoading(false)
                        }
                    })
                    .catch(err => {
                        Notification('error', err);
                        setFillLoading(false)
                    })
            })
    };

    const inputsChangeHandler = (id) => {
        const thisTitle = classTitleTableList.find(title => title.ID === id)
        if (thisTitle.IsOpenAttachedClass === 1) {
            setDisabledAttachedClassName(false)
            ClassTitleServices.getAll(startYear.StartYear, thisTitle.ClassNumberID)
                .then(res => {
                    setAttachedClassTitleTableList(res.data)
                }).catch(err => {
                    Notification('error', err);
                })
        } else {
            setDisabledAttachedClassName(true)
        }
        // console.log(thisTitle);
        mainForm.setFieldsValue({
            ClassLanguageID: thisTitle.ClassLanguageID,
            ClassLanguageName: thisTitle.ClassLangName,
            IsSpecialized: thisTitle.IsSpecialized,
            ClassTitleID: thisTitle.ClassTitleID,
            Comment: thisTitle.Comment,
            BLHGTypeID: thisTitle.BLHGTypeID,
            BLHGTypeName: thisTitle.BLHGTypeName,
            ChildrenCount: thisTitle.ChildrenCount,
            FemaleCount: thisTitle.FemaleCount,
            TeachingAtHomeCount: thisTitle.TeachingAtHomeCount,
        });
        setClassNumberID(thisTitle.ClassNumberID)
    }

    const attachedChangeHandler = (id) => {
        if (id > 0) {
            setDisabledClassName(true)
        } else {
            setDisabledClassName(false)
        }
        const thisTitle = attachedClassTitleTableList.find(title => title.ID === id)
        mainForm.setFieldsValue({
            ClassTitleID: thisTitle?.ClassTitleID,
        });
        BLHoursGridForClassServices.getAttachedClassTitleTableData(id)
            .then(res => {
                console.log(res.data);
            })
    }

    const edit = (record, table) => {
        if (table === 1) {
            setEditingRow(record.SubjectsID);
            const newTableData = tableData.map((row) => {
                if (row.SubjectsID === record.SubjectsID) {
                    // console.log(row, editingRow);
                    row.Status = 2
                }
                return row
            })
            setTableData(newTableData)
        } else if (table === 2) {
            setEditingRowTeachingAtHome(record.SubjectsID);
            const newTableData = tablesTeachingAtHome.map((row) => {
                if (row.SubjectsID === record.SubjectsID) {
                    // console.log(row, editingRow);
                    row.Status = 2
                }
                return row
            })
            setTablesTeachingAtHome(newTableData)
        }
    };

    const cancel = () => {
        setEditingKey('');
    };

    const handleHourSelect = (e, record) => {
        save(record, record.SubjectsID, e);
    }

    const save = (record, editingRow, selectedHour) => {
        // console.log(record, selectedHour);
        if (record.DividedSciences === null) {
            record.DividedSciences = 0;
        }
        if (record.SubjectsID === editingRow) {
            const newTableData = tableData.map((row) => {
                if (row.SubjectsID === editingRow) {
                    // console.log(row, editingRow);
                    row.DividedSciences = selectedHour
                    row.TotalHours = selectedHour + row.Hours
                }
                return row
            })
            let parentHour = 0
            let childSubjects = newTableData.filter(data => (data.ParentID === record.ParentID && data.Status !== 3))
            childSubjects.map(item => {
                parentHour += item.DividedSciences;
                return item
            })
            newTableData.map(row => {
                if (row.SubjectsID === record.ParentID) {
                    row.DividedSciences = parentHour;
                    row.TotalHours = parentHour + row.Hours
                }
                return row;
            })
            // console.log(newTableData);
            setTableData(newTableData)
            setEditingRow(null)
        }
    };


    const saveInput = (e, record) => {
        const newTableData = tableData.map((row) => {
            if (row.SubjectsID === record.SubjectsID) {
                row.Hours = parseFloat(e.target.value.replace(/,/, '.'))
                row.TotalHours = parseFloat(e.target.value.replace(/,/, '.')) + row.DividedSciences
                row.DividedSciences = 0
            }
            return row
        })
        let parentHour = 0
        let childSubjects = newTableData.filter(data => (data.ParentID === record.ParentID && data.Status !== 3))
        childSubjects.map(item => {
            parentHour += item.Hours;
            return item
        })
        // console.log(childSubjects, parentHour);
        newTableData.map(row => {
            if (row.SubjectsID === record.ParentID) {
                row.Hours = parentHour;
                row.TotalHours = parentHour + row.DividedSciences
            }
            return row;
        })
        setTableData(newTableData)
    }
    const saveInputTeachingAtHome = (e, record) => {
        const newTableData = tablesTeachingAtHome.map((row) => {
            if (row.SubjectsID === record.SubjectsID) {
                row.Hours = parseFloat(e.target.value.replace(/,/, '.'))
                row.TotalHours = parseFloat(e.target.value.replace(/,/, '.')) + row.DividedSciences
                row.DividedSciences = 0
            }
            return row
        })
        let parentHour = 0
        let childSubjects = newTableData.filter(data => (data.ParentID === record.ParentID && data.Status !== 3))
        childSubjects.map(item => {
            parentHour += item.Hours;
            return item
        })
        console.log(childSubjects, parentHour);
        newTableData.map(row => {
            if (row.SubjectsID === record.ParentID) {
                row.Hours = parentHour;
                row.TotalHours = parentHour + row.DividedSciences
            }
            return row;
        })
        setTablesTeachingAtHome(newTableData)
    }

    const setRowClassName = (record) => {
        // console.log(record);
        return (record.ParentID === null || record.ParentID === 0) ? `${classes.bold} table-row clicked-row` : 'table-row';
    }

    const regularClassTable = [
        {
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            width: 100,
        },
        {
            title: t("SubjectName"),
            dataIndex: "SubjectsName",
            key: "SubjectsName",
            width: 150,
        },
        {
            title: t("Hours"),
            dataIndex: "Hours",
            key: "Hours",
            width: 100,
            render: (_, record) => {
                return ((record.CanEdit && record.ParentID !== 0) && (record.Status === 1 || record.Status === 2)) ? (
                    <Input
                        ref={inputRef}
                        onPressEnter={(e) => { saveInput(e, record); inputRef.current.blur(); }}
                        onBlur={(e) => saveInput(e, record)} defaultValue={record.Hours}
                        placeholder={t('Hours')}
                    />
                ) : (
                    <>{record.Hours}</>
                )
            }
        },

        {
            title: t("DividedSciences"),
            dataIndex: "DividedSciences",
            key: "DividedSciences",
            editable: true,
            width: 100,
            render: (_, record) => {
                let options = [];
                if (IsVariative === true) {
                    for (let i = 0; i < record.Hours; i++) {
                        options.push(i)
                    }
                } else {
                    options.push(0)
                }
                return (record.OpenDividedSciences && (record.Status === 1 || record.Status === 2)) ? (
                    <Select
                        style={{ width: 100 }}
                        placeholder={t("pleaseSelect")}
                        value={record.DividedSciences} required
                        onSelect={(e) => handleHourSelect(e, record)}
                    >
                        {options.map(option => <Option key={option} value={option}>{option}</Option>)}
                        <Option value={record.Hours}>{record.Hours}</Option>
                    </Select>
                ) : (
                    <>{record.DividedSciences}</>
                )
            }
        },
        {
            title: t("TotalHours"),
            dataIndex: "TotalHours",
            key: "TotalHours",
            width: 100,
            render: (_, record) => {
                return <>{record.TotalHours}</>
            }
        },
        {
            title: t("actions"),
            key: "action",
            // fixed: 'right',
            width: 100,
            render: (_, record) => {
                return ((record.CanEdit === true || record.OpenDividedSciences === true) && record.Status === 0) && (
                    editingRow === record.SubjectsID ? (
                        <span>
                            {/* <Typography.Link onClick={() => save(record)} style={{ marginRight: 8 }}>
                                Save
                            </Typography.Link> */}
                            {/* <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                                <a>Cancel</a>
                            </Popconfirm> */}
                        </span>
                    ) : (
                        <span>
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record, 1)}>
                                <i
                                    className='feather icon-edit action-icon'
                                    aria-hidden="true"
                                />
                            </Typography.Link>
                        </span>
                    )
                )
            },
        },
    ]
    const regularClassTableTeachingAtHome = [
        {
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            width: 100,
        },
        {
            title: t("SubjectName"),
            dataIndex: "SubjectsName",
            key: "SubjectsName",
            width: 150,
        },
        {
            title: t("Hours"),
            dataIndex: "Hours",
            key: "Hours",
            width: 100,
            render: (_, record) => {
                return ((record.CanEdit && record.ParentID !== 0) && (record.Status === 1 || record.Status === 2)) ? (
                    <Input
                        ref={inputRef}
                        onPressEnter={(e) => { saveInputTeachingAtHome(e, record); inputRef.current.blur(); }}
                        onBlur={(e) => saveInputTeachingAtHome(e, record)} defaultValue={record.Hours}
                        placeholder={t('Hours')}
                    />
                ) : (
                    <>{record.Hours}</>
                )
            }
        },
        {
            title: t("DividedSciences"),
            dataIndex: "DividedSciences",
            key: "DividedSciences",
            editable: true,
            width: 100,
            render: (_, record) => {
                return (record.OpenDividedSciences && (record.Status === 1 || record.Status === 2)) ? (
                    <Select
                        style={{ width: 100 }}
                        placeholder={t("pleaseSelect")}
                        value={record.DividedSciences} required
                        onSelect={(e) => handleHourSelect(e, record)}
                    >
                        <Option value={0}>0</Option>
                        <Option value={record.Hours}>{record.Hours}</Option>
                    </Select>
                ) : (
                    <>{record.DividedSciences}</>
                )
            }
        },
        {
            title: t("TotalHours"),
            dataIndex: "TotalHours",
            key: "TotalHours",
            width: 100,
            render: (_, record) => {
                return <>{record.TotalHours}</>
            }
        },
        {
            title: t("actions"),
            key: "action",
            // fixed: 'right',
            width: 100,
            render: (_, record) => {
                return ((record.CanEdit === true || record.OpenDividedSciences === true) && record.Status === 0) && (
                    editingRowTeachingAtHome === record.SubjectsID ? (
                        <span>
                            {/* <Typography.Link onClick={() => save(record)} style={{ marginRight: 8 }}>
                                Save
                            </Typography.Link> */}
                            {/* <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                                <a>Cancel</a>
                            </Popconfirm> */}
                        </span>
                    ) : (
                        <span>
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record, 2)}>
                                <i
                                    className='feather icon-edit action-icon'
                                    aria-hidden="true"
                                />
                            </Typography.Link>
                        </span>
                    )
                )
            },
        },
    ]

    const mergedColumns = regularClassTable.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                // save: save,
                // tableList: tableData,
            }),
        };
    });

    const clearTableHandler = () => {
        let deleteData1 = [...tableData];
        let deleteData2 = [...tablesTeachingAtHome];
        deleteData1.forEach(item => {
            item.Status = 3;
        })
        deleteData2.forEach(item => {
            item.Status = 3;
        })
        setTableData(deleteData1)
        setTablesTeachingAtHome(deleteData2)
        setHours(0)
        setHours2(0)

    };

    const tableSummaryHandler = (records) => {
        // console.log(records);
        let totalHours = 0;
        let dividedSciences = 0;
        let totalTotalHours = 0;

        records.forEach(item => {
            if (item.ParentID === 0 || item.ParentID === null) {
                totalHours += +item.Hours;
                dividedSciences += +item.DividedSciences;
                totalTotalHours += +item.TotalHours;
            }
        });
        setHours(totalTotalHours)
        return (
            <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalHours)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(dividedSciences)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalTotalHours)}</Table.Summary.Cell>
            </Table.Summary.Row>
        );
    }
    const tableTeachingAtHomeSummaryHandler = (records) => {
        // console.log(records);
        let totalHours = 0;
        let dividedSciences = 0;
        let totalTotalHours = 0;

        records.forEach(item => {
            if (item.ParentID === 0 || item.ParentID === null) {
                totalHours += +item.Hours;
                dividedSciences += +item.DividedSciences;
                totalTotalHours += +item.TotalHours;
            }
        });
        setHours2(totalTotalHours)
        return (
            <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalHours)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(dividedSciences)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalTotalHours)}</Table.Summary.Cell>
            </Table.Summary.Row>
        );
    }
    useEffect(() => {
        mainForm.setFieldsValue({
            TotalHours: Hours + Hours2,
        })
    }, [mainForm, Hours, Hours2])

    const handleSave = () => {
        mainForm.validateFields()
            .then(values => {
                values.Date = values.Date.format("DD.MM.YYYY");
                values.StartYear = values.StartYear.format("YYYY");
                values.EndYear = values.EndYear.format("YYYY");
                let totalHours = 0;
                tableData.forEach(item => {
                    if (item.ParentID === 0 && item.Status !== 3) {
                        totalHours += item.Hours
                    }
                })
                console.log({ ...startYear, ...values, Tables: tableData });
                console.log(totalHours, regularHours);
                if (totalHours === regularHours) {
                    BLHoursGridForClassServices.postData({
                        ...startYear, ...values, Tables: tableData, TablesTeachingAtHome: tablesTeachingAtHome
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                setLoader(false);
                                history.push(`/BLHoursGridForClass`);
                                Notification('success', t('success-msg'));
                            }
                        })
                        .catch((err) => {
                            Notification('error', err);
                            setLoader(false);
                        });
                } else {
                    Notification('error', `Оддий синфда умумий соатлар сони ${regularHours} га тенг емас!`);
                }
            });
    }

    const handleIsVariative = (e) => {
        setIsVariative(e)
    }

    return (
        <Fade>
            <MainCard title={docTitle}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        id='mainForm'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        className={classes.FilterForm}
                        form={mainForm}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xl={12} lg={12} md={24}>
                                <Card
                                    // hoverable
                                    // title="Card"
                                    size='small'
                                    className='inputs-wrapper-card'
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Row gutter={[10, 10]}>
                                        <Col xl={6} lg={12}>
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
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={6} lg={12}>
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
                                                <DatePicker disabled placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={4} lg={12}>
                                            <Form.Item
                                                label={t("StartYear")}
                                                name="StartYear"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("pleaseSelect"),
                                                    },
                                                ]}
                                            >
                                                <DatePicker disabled format="YYYY" picker="year" />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={4} lg={12}>
                                            <Form.Item label={t("EndYear")}
                                                name="EndYear"
                                                style={{ width: '100%' }}
                                            >
                                                <DatePicker disabled format="YYYY" picker="year" />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={4} lg={12}>
                                            <Form.Item label={t("TotalHours")}
                                                name="TotalHours"
                                                style={{ width: '100%' }}
                                            >
                                                <Input disabled />
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
                                            <Form.Item
                                                label={t("ClassTitleID")}
                                                name="ClassTitleID"
                                                hidden={true}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xl={12} lg={12} md={24}>
                                <Card
                                    // hoverable
                                    // title="Card"
                                    size='small'
                                    className='inputs-wrapper-card'
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Row gutter={[10, 10]}>
                                        <Col xl={8} lg={12}>
                                            <Form.Item
                                                label={t("ClassTitleTableName")}
                                                name="ClassTitleTableID"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("inputValidData"),
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder={t("ClassTitleTableName")}
                                                    style={{ width: '100%' }}
                                                    allowClear showSearch
                                                    disabled={tableData.filter(item => item.Status !== 3).length > 0}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    onChange={inputsChangeHandler}
                                                >
                                                    {classTitleTableList.map(item =>
                                                        <Option
                                                            key={item.ID}
                                                            value={item.ID}
                                                            data-childcount={item.ChildrenCount}
                                                            data-femalecount={item.FemaleCount}
                                                            data-teachingcount={item.TeachingAtHomeCount}
                                                        >
                                                            {item.Name}
                                                        </Option>
                                                    )}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item label={t("ClassLanguageName")}
                                                name="ClassLanguageName"
                                                style={{ width: '100%' }}
                                            >
                                                <Input placeholder={t("ClassLanguageName")} disabled={disabledComment} />
                                            </Form.Item>
                                            <Form.Item
                                                label={t("ClassLanguageID")}
                                                name="ClassLanguageID"
                                                hidden={true}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item
                                                label={t('IsSpecialized')}
                                                name='IsSpecialized'
                                                valuePropName="checked"
                                            >
                                                <Switch disabled={disabledComment} />
                                            </Form.Item>
                                        </Col>
                                        {ClassNumberID > 6 && (
                                            <Col xl={8} lg={12}>
                                                <Form.Item
                                                    label={t('IsVariative')}
                                                    name='IsVariative'
                                                    valuePropName="checked"
                                                >
                                                    <Switch onChange={handleIsVariative} disabled={tableData.filter(item => item.Status !== 3).length > 0} />
                                                </Form.Item>
                                            </Col>
                                        )}
                                        <Col xl={8} lg={8}>
                                            <Form.Item label={t("AttachedClassName")}
                                                name="AttachedClassTitleTableID"
                                                style={{ width: '100%' }}
                                            >
                                                <Select
                                                    placeholder={t("AttachedClassName")}
                                                    style={{ width: '100%' }} allowClear
                                                    showSearch disabled={disabledAttachedClassName}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    onChange={attachedChangeHandler}
                                                >
                                                    {attachedClassTitleTableList.map(item =>
                                                        <Option
                                                            key={item.ID}
                                                            value={item.ID}
                                                            data-childcount={item.ChildrenCount}
                                                            data-femalecount={item.FemaleCount}
                                                            data-teachingcount={item.TeachingAtHomeCount}
                                                        >
                                                            {item.Name}
                                                        </Option>
                                                    )}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={8}>
                                            <Form.Item label={t("ClassTitleName")}
                                                name="Comment"
                                                style={{ width: '100%' }}
                                            >
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={8}>
                                            <Form.Item label={t("BLHGTypeName")}
                                                name="BLHGTypeName"
                                                style={{ width: '100%' }}
                                            >
                                                <Input placeholder={t("BLHGTypeName")} disabled />
                                            </Form.Item>
                                            <Form.Item
                                                label={t("BLHGTypeID")}
                                                name="BLHGTypeID"
                                                hidden={true}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>

                                        <Col xl={8} lg={12}>
                                            <Form.Item label={t("ChildrenCount")}
                                                name="ChildrenCount"
                                                style={{ width: '100%' }}
                                            >
                                                <Input disabled={disabledComment} />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item label={t("FemaleCount")}
                                                name="FemaleCount"
                                                style={{ width: '100%' }}
                                            >
                                                <Input disabled={disabledComment} />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={8} lg={12}>
                                            <Form.Item label={t("TeachingAtHomeCount")}
                                                name="TeachingAtHomeCount"
                                                style={{ width: '100%' }}
                                            >
                                                <Input disabled={disabledComment} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col md={8} lg={6}>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("regularClass")}: </div><div className={classes.value}>
                                        {Hours} {t('hour').toLocaleLowerCase()}
                                    </div>
                                </div>
                            </Col>
                            <Col md={8} lg={6}>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("Обучение на дому")}: </div><div className={classes.value}>{Hours2} {t('hour').toLocaleLowerCase()}</div>
                                </div>
                            </Col>
                        </Row>
                        {!disabledClassName && (
                            <div className={classes.buttons}>
                                <Button
                                    disabled={tableData.filter(item => item.Status !== 3).length > 0}
                                    onClick={fillTableHandler} loading={fillLoading}
                                >{t("fill")}</Button>
                                <Button onClick={clearTableHandler}>{t("Tozalash")}</Button>
                            </div>
                        )}
                    </Form>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={t("regularClass")} key="1">
                            <Form
                                form={tableForm}
                            >
                                {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : */}
                                <Table
                                    boardered
                                    rowClassName={setRowClassName}
                                    // className="main-table inner-table"
                                    dataSource={tableData.filter(item => item.Status !== 3)}
                                    columns={regularClassTable}
                                    loading={tableLoading}
                                    pagination={false}
                                    // components={{
                                    //     body: {
                                    //         row: EditableRow,
                                    //         cell: EdittableCell,
                                    //     }
                                    // }}
                                    summary={records => tableSummaryHandler(records)}
                                // rowSelection={{
                                //     // onChange: onSelectChange,
                                //     selections: [Table.SELECTION_INVERT],
                                // }}
                                // scroll={{
                                //     x: "max-content",
                                //     y: '50vh'
                                // }}
                                // onRow={(record) => {
                                //     return {
                                //         onDoubleClick: () => {

                                //             edit(record);
                                //             // let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                                //             // document.addEventListener('click', function clickHandler(event) {
                                //             // let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                                //             // if (!isClickInsideElement) {
                                //             //     save(record.ID);
                                //             //     document.removeEventListener('click', clickHandler);
                                //             // }
                                //             // });

                                //         },
                                //         onClick: () => {
                                //             setRowId(record.ID);
                                //         },
                                //     };
                                // }}
                                />
                            </Form>
                        </TabPane>
                        {tablesTeachingAtHome.length > 0 && (
                            <TabPane tab={t("TeachingAtHome")} key="2">
                                <Form
                                    form={tableForm}
                                >
                                    {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : */}
                                    <Table
                                        boardered
                                        rowClassName={setRowClassName}
                                        className={classes.tableForm}
                                        dataSource={tablesTeachingAtHome.filter(item => item.Status !== 3)}
                                        columns={regularClassTableTeachingAtHome}
                                        loading={tableLoading}
                                        pagination={false}
                                        // components={{
                                        //     body: {
                                        //         cell: EdittableCell
                                        //     }
                                        // }}
                                        summary={records => tableTeachingAtHomeSummaryHandler(records)}
                                        // rowSelection={{
                                        //     // onChange: onSelectChange,
                                        //     selections: [Table.SELECTION_INVERT],
                                        // }}
                                        // scroll={{
                                        //     x: "max-content",
                                        //     // y: 'none'
                                        // }}
                                        onRow={(record) => {
                                            return {
                                                onDoubleClick: () => {
                                                    // edit(record);
                                                    // let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                                                    // document.addEventListener('click', function clickHandler(event) {
                                                    // let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                                                    // if (!isClickInsideElement) {
                                                    //     save(record.ID);
                                                    //     document.removeEventListener('click', clickHandler);
                                                    // }
                                                    // });
                                                },
                                                onClick: () => {
                                                    // setRowId(record.ID);
                                                    edit(record);
                                                },
                                            };
                                        }}
                                    />
                                </Form>
                            </TabPane>
                        )}
                    </Tabs>

                    <div className={classes.buttons}>
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
                            type="primary"
                            onClick={handleSave}
                        >
                            {t("save")}
                        </Button>
                    </div>
                </Spin>
            </MainCard >
        </Fade >
    );
};
export default React.memo(UpdateBLHoursGridForClass);