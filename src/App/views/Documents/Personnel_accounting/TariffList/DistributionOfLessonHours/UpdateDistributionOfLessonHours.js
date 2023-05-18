import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, Select, Spin, DatePicker, Space, InputNumber, Switch, Tabs, Table, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';

import MainCard from "../../../../../components/MainCard";
import { Notification } from "../../../../../../helpers/notifications";
import HelperServices from "../../../../../../services/Helper/helper.services";
import IndexsationOfSalaryServices from "../../../../../../services/Documents/Payroll/IndexationOfSalary/IndexationOfSalary.services";
import DistributionOfLessonHoursServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/DistributionOfLessonHours.services";
import EmployeeServices from "../../../../../../services/References/Organizational/Employee/employee.services";
import EditableCell from "./HoursTable/EditableCell";
import HoursTableHeader from "./HoursTable/HoursTableHeader";
import QualCategoryTableHeader from "./QualCategoryTable/QualCategoryTableHeader";
import QualCategoryTableEditableCell from "./QualCategoryTable/EditableCell";
import ClassTitleServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitle.services";
import SubjectsInBLHGTApis from "../../../../../../services/References/Organizational/SubjectInBLGHT/SubjectInBLGHT";
import DiplomaTableHeader from "./DiplomaTable/DiplomaTableHeader";
import RetrainingTableHeader from "./RetrainingTable/RetrainingTableHeader";
import LangCertificateTableHeader from "./LangCertificateTable/LangCertificateTableHeader";
import DirectorsFundTableHeader from "./DirectorsFundTable/DirectorsFundTableHeader";
import { CSSTransition } from "react-transition-group";
import BonusInfoModal from "./components/BonusInfoModal";
import MethodUnionTableHeader from "./MethodUnion/MethodUnionTableHeader";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const { Option } = Select;
const { TabPane } = Tabs;
let hoursTableRowChanged = false;
let qualCategoryTableRowChanged = false;

const UpdateDistributionOfLessonHours = (props) => {
    const [DistributionOfLessonHours, setDistributionOfLessonHours] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [enrollmentTypeList, setEnrollmentTypeList] = useState([]);
    const [classTitleList, setClassTitleList] = useState([]);
    // Hours table states
    const [hoursTableData, setHoursTableData] = useState([]);
    const [posQualList, setPosQualList] = useState([]);
    const [diplomaSpecialityListFalse, setDiplomaSpecialityListFalse] = useState([]);
    const [diplomaSpecialityListTrue, setDiplomaSpecialityListTrue] = useState([]);
    const [hoursTableEditingKey, setHoursTableEditingKey] = useState("");
    const [hoursTableRowId, setHoursTableRowId] = useState(null);
    const [subjectsInBLHGT, setSubjectsInBLHGT] = useState([]);
    // End Hours table states
    // Qual Category table states
    const [qualCategoryTableData, setQualCategoryTableData] = useState([]);
    const [qualCategoryTableEditingKey, setQualCategoryTableEditingKey] = useState("");
    const [qualCategoryTableRowId, setQualCategoryTableRowId] = useState(null);
    // Qual Category table states end
    // Qual Category table states
    const [diplomaTableData, setDiplomaTableData] = useState([]);
    // const [diplomaTableEditingKey, setDiplomaTableEditingKey] = useState("");
    // const [diplomaTableRowId, setDiplomaTableRowId] = useState(null);
    // Retraining table states
    const [retrainSertTableData, setRetrainSertTableData] = useState([]);
    // const [retrainSertTableEditingKey, setRetrainSertTableEditingKey] = useState("");
    // const [retrainSertTableRowId, setRetrainSertTableRowId] = useState(null);
    // Retraining table states end
    // Retraining table states
    const [langSertTableData, setLangSertTableData] = useState([]);
    // const [langSertTableEditingKey, setLangSertTableEditingKey] = useState("");
    // const [langSertTableRowId, setLangSertTableRowId] = useState(null);
    // Retraining table states end
    // DirectorsFund table states
    const [directorsFundTableData, setDirectorsFundTableData] = useState([]);
    // const [directorsFundTableRowId, setDirectorsFundTableRowId] = useState(null);
    // const [directorsFundTableEditingKey, setDirectorsFundTableEditingKey] = useState("");
    // DirectorsFund table states end
    const [disabledActions, setDisabledActions] = useState(false);
    const [classGuidance, setClassGuidance] = useState(false);
    const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);
    const [loader, setLoader] = useState(true);

    const [bonusModalVisible, setBonusModalVisible] = useState(false);
    const [bonusModalId, setBonusModalId] = useState(null);

    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();
    const [hoursTableForm] = Form.useForm();
    const [qualCategoryTableForm] = Form.useForm();
    const [diplomaTableForm] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            const [DistributionOfLessonHrs, emps, enrollmentTypeLs, posQualLs, diplomaSpecialityList, diplomaSpecialityList2] = await Promise.all([
                DistributionOfLessonHoursServices.getById(props.match.params.id ? props.match.params.id : 0),
                EmployeeServices.getAll(),
                HelperServices.GetEnrolmentTypeList(),
                HelperServices.GetPositionQualificationList(),
                HelperServices.GetDiplomaSpecialityList({ IsRetraining: false }),
                HelperServices.GetDiplomaSpecialityList({ IsRetraining: true }),
            ]);

            const [classTitleList, subjectsInBLHGT] = await Promise.all([
                ClassTitleServices.getAll(DistributionOfLessonHrs.data.StartYear, DistributionOfLessonHrs.data.ClassNumberID),
                SubjectsInBLHGTApis.getAllSubjectsInBLHGTList({
                    Date: DistributionOfLessonHrs.data.Date,
                    BLHGTypeID: DistributionOfLessonHrs.data.BLHGTypeID,
                    ForBillingList: true,
                }),
            ]);

            setDistributionOfLessonHours(DistributionOfLessonHrs.data);
            setEmployees(emps.data);
            setEnrollmentTypeList(enrollmentTypeLs.data);
            setPosQualList(posQualLs.data);
            setDiplomaSpecialityListFalse(diplomaSpecialityList.data);
            setDiplomaSpecialityListTrue(diplomaSpecialityList2.data);
            setDisabledActions(DistributionOfLessonHrs.data.StatusID === 2 ? true : false);
            setHoursTableData(DistributionOfLessonHrs.data.Tables);
            setQualCategoryTableData(DistributionOfLessonHrs.data.Tables5);
            setDiplomaTableData(DistributionOfLessonHrs.data.Tables1);
            setRetrainSertTableData(DistributionOfLessonHrs.data.Tables2);
            setLangSertTableData(DistributionOfLessonHrs.data.Tables3);
            setDirectorsFundTableData(DistributionOfLessonHrs.data.Tables4);
            setClassGuidance(DistributionOfLessonHrs.data.HasClassGuidance);
            setClassTitleList(classTitleList.data);
            setSubjectsInBLHGT(subjectsInBLHGT.data);
            // setSubjects([]);
            setDocId(props.match.params.id ? props.match.params.id : 0);

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...DistributionOfLessonHrs.data,
                    Date: moment(DistributionOfLessonHrs.data.Date, 'DD.MM.YYYY'),
                    StartYear: moment(DistributionOfLessonHrs.data.StartYear, 'YYYY'),
                    EndYear: moment(DistributionOfLessonHrs.data.EndYear, 'YYYY'),
                })
            } else {
                mainForm.setFieldsValue({
                    ...DistributionOfLessonHrs.data,
                    Date: moment(DistributionOfLessonHrs.data.Date, 'DD.MM.YYYY'),
                    StartYear: moment(DistributionOfLessonHrs.data.StartYear, 'YYYY'),
                    EndYear: moment(DistributionOfLessonHrs.data.EndYear, 'YYYY'),
                    EmployeeID: null,
                    EnrolmentTypeID: null,
                    ClassTitleTableID: null,
                })
            }

            setLoader(false);
        }
        fetchData().catch(err => {
            // console.log(err);
            setLoader(false);
            Notification('error', err);
        });
    }, [props.match.params.id, mainForm]);

    // Hours table
    const hoursTableColumns = [
        {
            title: t("SubjectName"),
            dataIndex: "SubjectName",
            width: 200,
        },
        {
            title: t("PositionQualification"),
            dataIndex: "PositionQualificationID",
            editable: true,
            width: 200,
            render: (value) => {
                const record = posQualList.find(item => item.ID === value);
                return record ? record.Name : '';
            }
        },
        {
            title: t("ClassTitleTableName"),
            dataIndex: "ClassTitleTableID",
            width: 150,
            render: (value) => {
                const record = classTitleList.find(item => item.ID === value);
                return record ? record.Name : '';
            }
        },
        {
            title: t("Hours"),
            dataIndex: "Hours",
            width: 100,
        },
        {
            title: t("ChildrenCount"),
            dataIndex: "ChildrenCount",
            width: 150,
            editable: true
        },
        {
            title: t("teachingAtHomeHours"),
            dataIndex: "TeachingAtHomeHours",
            width: 150,
        },
        {
            title: t("teachingAtHomeChildrenCount"),
            dataIndex: "TeachingAtHomeChildrenCount",
            width: 150,
            editable: true
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 50,
            render: (_, record) => (
                <Tooltip title={t("Delete")}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<i className="feather icon-trash-2 action-icon" aria-hidden="true" />}
                        onClick={() => deleteHoursTableRow(record)}
                    />
                </Tooltip>
            )
        }
    ];

    const mergedHoursColumns = hoursTableColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                editing: isHoursTableEditing(record),
                posQualList: posQualList,
                // staffTableForm: staffTableForm,
            }),
        };
    });

    const isHoursTableEditing = (record) => {
        const key = record.ID === 0 ? record.key : record.ID;
        return key === hoursTableEditingKey
    };

    const hoursTableEdit = (record) => {
        hoursTableForm.setFieldsValue({
            ...record,
        });
        const key = record.ID === 0 ? record.key : record.ID;
        setHoursTableEditingKey(key);
    };

    const hoursTableSave = async (key) => {
        try {
            const row = await hoursTableForm.validateFields();
            const newData = [...hoursTableData];
            const index = newData.findIndex((item) => key === (item.ID === 0 ? item.key : item.ID));

            if (index > -1) {
                const item = newData[index];
                item.ID === 0 ? item.Status = 1 : item.Status = 2;
                newData.splice(index, 1, { ...item, ...row });

                if (hoursTableRowChanged) {
                    setHoursTableData(newData);
                    hoursTableRowChanged = false;
                }
                // staffTableForm.resetFields();
                setHoursTableEditingKey("");
            } else {
                newData.push(row);
                setHoursTableEditingKey("");
            }
        } catch (err) {
            // console.log("Validate Failed:", errInfo);
            Notification('error', err)
            setHoursTableEditingKey("");
            hoursTableRowChanged = false;
        }
    };

    const addHoursTableDataHandler = useCallback((values) => {
        setHoursTableData((prevState) => [values, ...prevState]);
    }, [])

    const setHoursTableRowClassName = (record) => {
        const key = record.ID === 0 ? record.key : record.ID;
        return key === hoursTableRowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
    }

    const onHoursTableRow = (record) => {
        return {
            onDoubleClick: () => {
                hoursTableEdit(record);
                let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                document.addEventListener('click', function clickHandler(event) {
                    let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                    let optionList = document.querySelector('.ant-select-dropdown');
                    console.log(!isClickInsideElement, !optionList);
                    if (!isClickInsideElement) {
                        hoursTableSave(record.ID === 0 ? record.key : record.ID);
                        document.removeEventListener('click', clickHandler);
                    }
                });
            },
            onClick: () => {
                setHoursTableRowId(record.ID === 0 ? record.key : record.ID);
            },
        };
    }

    const deleteHoursTableRow = record => {
        record.Status = 3;
    }

    const onHoursTableValuesChange = () => {
        hoursTableRowChanged = true;
    }
    // End Hours table

    // Qual Category table
    const qualCategoryTableColumns = [
        {
            title: t("SubjectName"),
            dataIndex: "SubjectName",
            editable: true,
            width: 200,
            // render: (value) => {
            //     const record = subjectsInBLHGT.find(item => item.ID === value);
            //     return record ? record.Name : '';
            // }
        },
        {
            title: t("PositionQualification"),
            dataIndex: "PositionQualificationName",
            editable: true,
            width: 200,
            // render: (value) => {
            //     const record = posQualList.find(item => item.ID === value);
            //     return record ? record.Name : '';
            // }
        },
        {
            title: t("Series"),
            dataIndex: "Series",
            width: 100,
            editable: true
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            width: 100,
            editable: true
        },
        {
            title: t("DateOfIssue"),
            dataIndex: "DateOfIssue",
            width: 150,
            editable: true
        },
        {
            title: t("ExpireDate"),
            dataIndex: "ExpireDate",
            width: 150,
            editable: true
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 50,
            render: (_, record) => (
                <Tooltip title={t("Delete")}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<i className="feather icon-trash-2 action-icon" aria-hidden="true" />}
                        onClick={() => deleteQualCategoryTableRow(record)}
                    />
                </Tooltip>
            )
        }
    ];

    const mergedQualCategoryColumns = qualCategoryTableColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                editing: isQualCategoryTableEditing(record),
                posQualList: posQualList,
                subjects: subjectsInBLHGT,
                // staffTableForm: staffTableForm,
            }),
        };
    });

    const isQualCategoryTableEditing = (record) => {
        const key = record.ID === 0 ? record.key : record.ID;
        return key === qualCategoryTableEditingKey;
    };

    const qualCategoryTableEdit = (record) => {
        qualCategoryTableForm.setFieldsValue({
            ...record,
            DateOfIssue: moment(record.DateOfIssue, 'DD.MM.YYYY'),
            ExpireDate: moment(record.ExpireDate, 'DD.MM.YYYY'),
        });
        const key = record.ID === 0 ? record.key : record.ID;
        setQualCategoryTableEditingKey(key);
    };

    const qualCategoryTableSave = async (key) => {
        try {
            const row = await qualCategoryTableForm.validateFields();
            const newData = [...qualCategoryTableData];
            const index = newData.findIndex((item) => key === (item.ID === 0 ? item.key : item.ID));

            if (index > -1) {
                const item = newData[index];
                item.ID === 0 ? item.Status = 1 : item.Status = 2;
                // item.DateOfIssue = typeof (item.DateOfIssue) === 'string' ? item.DateOfIssue : item.DateOfIssue.format("DD.MM.YYYY");
                // item.ExpireDate = typeof (item.DateOfIssue) === 'string' ? item.DateOfIssue : item.ExpireDate.format("DD.MM.YYYY");
                console.log(item);
                newData.splice(index, 1, { ...item, ...row });

                if (qualCategoryTableRowChanged) {
                    setQualCategoryTableData(newData);
                    qualCategoryTableRowChanged = false;
                }
                // staffTableForm.resetFields();
                setQualCategoryTableEditingKey("");
            } else {
                newData.push(row);
                setQualCategoryTableEditingKey("");
            }
        } catch (err) {
            // console.log("Validate Failed:", errInfo);
            Notification('error', err)
            setQualCategoryTableEditingKey("");
            qualCategoryTableRowChanged = false;
        }
    };

    const addQualCategoryTableDataHandler = useCallback((values) => {
        setQualCategoryTableData((prevState) => [values, ...prevState]);
    }, [])

    const setQualCategoryTableRowClassName = (record) => {
        const key = record.ID === 0 ? record.key : record.ID;
        return key === qualCategoryTableRowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
    }

    const onQualCategoryTableRow = (record) => {
        return {
            // onDoubleClick: () => {
            //   qualCategoryTableEdit(record);
            //   let ignoreClickOnMeElement = document.querySelector('.clicked-row');
            //   document.addEventListener('click', function clickHandler(event) {
            //     let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
            //     let datePicker = document.querySelector('.ant-picker-dropdown');
            //     let optionList = document.querySelector('.ant-select-dropdown');

            //     console.log(isClickInsideElement, !datePicker, !optionList);
            //     if (!isClickInsideElement) {
            //       qualCategoryTableSave(record.ID === 0 ? record.key : record.ID);
            //       document.removeEventListener('click', clickHandler);
            //     }
            //   });
            // },
            onClick: () => {
                setQualCategoryTableRowId(record.ID === 0 ? record.key : record.ID);
            },
        };
    }

    const deleteQualCategoryTableRow = record => {
        record.Status = 3;
    }

    const onQualCategoryTableValuesChange = () => {
        qualCategoryTableRowChanged = true;
    }
    // Qual Category table end

    // Diploma table
    const diplomaColumns = [
        {
            title: t("Series"),
            dataIndex: "Series",
            width: 100,
            editable: true
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            width: 100,
            editable: true
        },
        {
            title: t("Speciality"),
            dataIndex: "Speciality",
            width: 150,
            editable: true
        },
        {
            title: t("SubjectName"),
            dataIndex: "SubjectName",
            width: 150,
            editable: true
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 50,
            render: (_, record) => (
                <Tooltip title={t("Delete")}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<i className="feather icon-trash-2 action-icon" aria-hidden="true" />}
                        onClick={() => deleteDiplomaTableRow(record)}
                    />
                </Tooltip>
            )
        }
    ];

    const mergedDiplomaColumns = diplomaColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                editing: isQualCategoryTableEditing(record),
                // posQualList: posQualList,
                // subjects: subjectsInBLHGT,
                // staffTableForm: staffTableForm,
            }),
        };
    });

    const addDiplomaTableDataHandler = useCallback((values) => {
        setDiplomaTableData((prevState) => [values, ...prevState]);
    }, [])
    const deleteDiplomaTableRow = record => {
        record.Status = 3;
    }
    // Diploma table end

    // Retraining table
    const retrainSertColumns = [
        {
            title: t("Series"),
            dataIndex: "Series",
            width: 100,
            editable: true
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            width: 100,
            editable: true
        },
        {
            title: t("Speciality"),
            dataIndex: "Speciality",
            width: 150,
            editable: true
        },
        {
            title: t("SubjectName"),
            dataIndex: "SubjectName",
            width: 150,
            editable: true
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 50,
            render: (_, record) => (
                <Tooltip title={t("Delete")}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<i className="feather icon-trash-2 action-icon" aria-hidden="true" />}
                        onClick={() => deleteRetrainingTableRow(record)}
                    />
                </Tooltip>
            )
        }
    ];

    const mergedRetrainSertColumns = retrainSertColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                editing: isQualCategoryTableEditing(record),
                // posQualList: posQualList,
                // subjects: subjectsInBLHGT,
                // staffTableForm: staffTableForm,
            }),
        };
    });

    const addRetrainingTableDataHandler = useCallback((values) => {
        setRetrainSertTableData((prevState) => [values, ...prevState]);
    }, [])
    const deleteRetrainingTableRow = record => {
        record.Status = 3;
    }
    // Retraining table end

    // Lang Sertificate table
    const langSertColumns = [
        {
            title: t("CertForeignLangType"),
            dataIndex: "CertForeignLangTypeName",
            width: 120,
            editable: true
        },
        {
            title: t("Series"),
            dataIndex: "Series",
            width: 100,
            editable: true
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            width: 100,
            editable: true
        },
        {
            title: t("Percentage"),
            dataIndex: "Percentage",
            width: 100,
            editable: true
        },
        {
            title: t("ExpireDate"),
            dataIndex: "ExpireDate",
            width: 100,
            editable: true
        },
        {
            title: t("SubjectName"),
            dataIndex: "SubjectName",
            width: 150,
            editable: true
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 50,
            render: (_, record) => (
                <Tooltip title={t("Delete")}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<i className="feather icon-trash-2 action-icon" aria-hidden="true" />}
                        onClick={() => deleteLangSertTableRow(record)}
                    />
                </Tooltip>
            )
        }
    ];

    const mergedLangSertColumns = langSertColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                editing: isQualCategoryTableEditing(record),
                // posQualList: posQualList,
                // subjects: subjectsInBLHGT,
                // staffTableForm: staffTableForm,
            }),
        };
    });

    const addLangSertTableDataHandler = useCallback((values) => {
        setLangSertTableData((prevState) => [values, ...prevState]);
    }, [])
    const deleteLangSertTableRow = record => {
        record.Status = 3;
    }
    // Lang Sertificate table end

    // Lang Sertificate table
    const directorsFundColumns = [
        {
            title: t("SubjectName"),
            dataIndex: "SubjectName",
            width: 150,
            editable: true
        },
        {
            title: t("Percentage"),
            dataIndex: "Percentage",
            width: 50,
            editable: true
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 100,
            render: (_, record) => (
                <Tooltip title={t("Delete")}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<i className="feather icon-trash-2 action-icon" aria-hidden="true" />}
                        onClick={() => deleteDirectorsFundTableRow(record)}
                    />
                </Tooltip>
            )
        }
    ];

    const mergedDirectorsFundColumns = directorsFundColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                editing: isQualCategoryTableEditing(record),
                // posQualList: posQualList,
                // subjects: subjectsInBLHGT,
                // staffTableForm: staffTableForm,
            }),
        };
    });

    const addDirectorsFundTablDataHandler = useCallback((values) => {
        setDirectorsFundTableData((prevState) => [values, ...prevState]);
    }, [])
    const deleteDirectorsFundTableRow = record => {
        record.Status = 3;
    }
    // Lang Sertificate table end

    // Method Union table
    const methodUnionColumns = [
        {
            title: t("SubjectName"),
            dataIndex: "SubjectName",
            width: 150,
            editable: true
        },
        {
            title: t("Percentage"),
            dataIndex: "Percentage",
            width: 50,
            editable: true
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 100,
            render: (_, record) => (
                <Tooltip title={t("Delete")}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<i className="feather icon-trash-2 action-icon" aria-hidden="true" />}
                        onClick={() => deleteMethodUnionTableRow(record)}
                    />
                </Tooltip>
            )
        }
    ];

    const mergedMethodUnionColumns = methodUnionColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                editing: isQualCategoryTableEditing(record),
                // posQualList: posQualList,
                // subjects: subjectsInBLHGT,
                // staffTableForm: staffTableForm,
            }),
        };
    });
    const deleteMethodUnionTableRow = record => {
        record.Status = 3;
    }
    // Method Union table end

    const submitFormHandler = () => {
        mainForm.validateFields()
            .then(values => {
                setLoader(true);
                values.ID = +docId;
                values.Date = values.Date.format('DD.MM.YYYY');
                values.StartYear = values.StartYear.format("YYYY");
                values.EndYear = values.EndYear.format("YYYY");
                values.Tables = hoursTableData;
                values.Tables5 = qualCategoryTableData;
                values.Tables1 = diplomaTableData;
                values.Tables2 = retrainSertTableData;
                values.Tables3 = langSertTableData;
                values.Tables4 = directorsFundTableData;
                // console.log(values);
                DistributionOfLessonHoursServices.postData(values)
                    .then(res => {
                        if (res.status === 200) {
                            Notification("success", t("saved"));
                            setLoader(false);
                            history.push('/DistributionOfLessonHours');
                        }
                    })
                    .catch(err => {
                        // console.log(err);
                        setLoader(false);
                        Notification("error", err);
                    })
            })
    };

    const classGuidanceChangeHandler = val => {
        setClassGuidance(val);
    }

    const openBonusModalHandler = inputName => {
        setBonusModalId(inputName);
        setBonusModalVisible(true);
    }

    const closeBonusModalHandler = () => {
        setBonusModalVisible(false);
    }

    return (
        <Fade>
            <MainCard title={t('DistributionOfLessonHours')}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        form={mainForm}
                        id='mainForm'
                        scrollToFirstError
                    // onFinish={submitFormHandler}
                    >
                        <Row gutter={[16, 16]} align="top">
                            <Col xl={2} lg={6}>
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
                                    <DatePicker
                                        placeholder={t("date")}
                                        format='DD.MM.YYYY'
                                        style={{ width: '100%' }}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={2} lg={6}>
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
                            <Col xl={2} lg={6}>
                                <Form.Item
                                    label={t("EndYear")}
                                    name="EndYear"
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
                            {/* <Col xl={2} lg={6}>
                                <Form.Item
                                    label={t("number")}
                                    name="Number"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("inputValidData"),
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder={t("Number")}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col> */}
                            <Col xl={6} lg={8}>
                                <Form.Item
                                    label={t("Employee")}
                                    name="EmployeeID"
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
                                        placeholder={t("Employee")}
                                        style={{ width: '100%' }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {employees.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={6}>
                                <Form.Item
                                    label={t("EnrolmentType")}
                                    name="EnrolmentTypeID"
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
                                        placeholder={t("EnrolmentType")}
                                        style={{ width: '100%' }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {enrollmentTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xl={2} lg={6}>
                                <Form.Item
                                    label={t("hasInformaticsCabinet")}
                                    name="HasInformaticsCabinet"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col xl={2} lg={6}>
                                <Form.Item
                                    label={t("hasClassGuidance")}
                                    name="HasClassGuidance"
                                    valuePropName="checked"
                                >
                                    <Switch onChange={classGuidanceChangeHandler} />
                                </Form.Item>
                            </Col>
                            <Col xl={4} lg={6}>
                                {classGuidance &&
                                    <Form.Item
                                        label={t("class")}
                                        name="ClassTitleTableID"
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
                                            placeholder={t("class")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {classTitleList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                }
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("DirectorsFundSuperTeacher")}
                                        name="DirectorsFundSuperTeacher"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={100}>100%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(10)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("RemoteRegion")}
                                        name="RemoteRegion"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={10}>10%</Option>
                                            <Option value={20}>20%</Option>
                                            <Option value={30}>30%</Option>
                                            <Option value={40}>40%</Option>
                                            <Option value={50}>50%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(7)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("Olympics")}
                                        name="Olympics"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={100}>100%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(8)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("HonoredTeacher")}
                                        name="HonoredTeacher"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={160}>160%</Option>
                                            {/* <Option value={1.8}>180%</Option> */}
                                            <Option value={300}>300%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(9)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("AllowanceIslamicUniv")}
                                        name="AllowanceIslamicUniv"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={20}>20%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(11)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("LongServicePayment")}
                                        name="LongServicePayment"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={25}>25%</Option>
                                            <Option value={50}>50%</Option>
                                            <Option value={75}>75%</Option>
                                            {/* <Option value={100}>100%</Option> */}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(12)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("climaticConditions")}
                                        name="ClimaticConditions"
                                        style={{ maxWidth: '100%' }}
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={10}>10%</Option>
                                            <Option value={15}>15%</Option>
                                            <Option value={20}>20%</Option>
                                            <Option value={30}>30%</Option>
                                            <Option value={40}>40%</Option>
                                            <Option value={50}>50%</Option>
                                            <Option value={60}>60%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(6)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={3} lg={6}>
                                <Form.Item
                                    label={t("OlympicsChildren")}
                                    name="OlympicsChildren"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}
                                >
                                    <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={150}>150%</Option>
                                            <Option value={175}>175%</Option>
                                            <Option value={200}>200%</Option>
                                        </Select>
                                </Form.Item>
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("RedSchool")}
                                        name="RedSchool"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={50}>50%</Option>
                                            <Option value={100}>100%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(14)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            {/* <Col xl={3} lg={6}>
                                <Form.Item
                                    label={t("NaturalSciences")}
                                    name="NaturalSciences"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder={t("NaturalSciences")}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col> */}
                            {/* <Col xl={3} lg={6}>
                                <Form.Item
                                    label={t("ForeignLang")}
                                    name="ForeignLang"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder={t("ForeignLang")}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col> */}
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("ScienceCandidate")}
                                        name="ScienceCandidate"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={30}>30%</Option>
                                            <Option value={60}>60%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(16)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("CorrectiveScience")}
                                        name="CorrectiveScience"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={10}>10%</Option>
                                            <Option value={20}>20%</Option>
                                            <Option value={30}>30%</Option>
                                            <Option value={40}>40%</Option>
                                            <Option value={50}>50%</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="&nbsp;">
                                        <Button
                                            icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                            onClick={() => openBonusModalHandler(18)}
                                        />
                                    </Form.Item>
                                </div>
                            </Col>
                            {/* <Col xl={3} lg={6}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        label={t("MethodUnion")}
                                        name="MethodUnion"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("pleaseSelect"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={t("select")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                        >
                                            <Option value={0}>0%</Option>
                                            <Option value={10}>10%</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </Col> */}
                        </Row>
                    </Form>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={t('hours')} key="1">
                            <Form
                                form={hoursTableForm}
                                onValuesChange={onHoursTableValuesChange}
                                component={false}
                            >
                                <Table
                                    bordered
                                    size='middle'
                                    pagination={false}
                                    rowClassName={setHoursTableRowClassName}
                                    className="main-table"
                                    rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                    columns={mergedHoursColumns}
                                    dataSource={hoursTableData.filter(item => item.Status !== 3)}
                                    onRow={(record) => onHoursTableRow(record)}
                                    scroll={{
                                        x: "max-content",
                                        y: '90vh'
                                    }}
                                    components={{
                                        header: {
                                            row: () => <HoursTableHeader
                                                DistributionOfLessonHours={DistributionOfLessonHours}
                                                posQualList={posQualList}
                                                classTitleList={classTitleList}
                                                subjects={subjectsInBLHGT}
                                                addData={addHoursTableDataHandler}
                                            />
                                        },
                                        body: {
                                            cell: EditableCell
                                        }
                                    }}
                                />
                            </Form>
                        </TabPane>
                        <TabPane tab={t('positionQualificationName')} key="2">
                            <Form
                                form={qualCategoryTableForm}
                                onValuesChange={onQualCategoryTableValuesChange}
                                component={false}
                            >
                                <Table
                                    bordered
                                    size='middle'
                                    pagination={false}
                                    rowClassName={setQualCategoryTableRowClassName}
                                    className="main-table"
                                    rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                    columns={mergedQualCategoryColumns}
                                    dataSource={qualCategoryTableData.filter(item => item.Status !== 3)}
                                    onRow={(record) => onQualCategoryTableRow(record)}
                                    scroll={{
                                        x: "max-content",
                                        y: '90vh'
                                    }}
                                    components={{
                                        header: {
                                            row: () => <QualCategoryTableHeader
                                                posQualList={posQualList}
                                                subjects={subjectsInBLHGT}
                                                addData={addQualCategoryTableDataHandler}
                                            />
                                        },
                                        body: {
                                            cell: QualCategoryTableEditableCell
                                        }
                                    }}
                                />
                            </Form>
                        </TabPane>
                        <TabPane tab={t('diploma')} key="3">
                            <Form
                                form={diplomaTableForm}
                                onValuesChange={onQualCategoryTableValuesChange}
                                component={false}
                            >
                                <Table
                                    bordered
                                    size='middle'
                                    pagination={false}
                                    rowClassName={setQualCategoryTableRowClassName}
                                    className="main-table"
                                    rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                    columns={mergedDiplomaColumns}
                                    dataSource={diplomaTableData.filter(item => item.Status !== 3)}
                                    onRow={(record) => onQualCategoryTableRow(record)}
                                    scroll={{
                                        x: "max-content",
                                        y: '90vh'
                                    }}
                                    components={{
                                        header: {
                                            row: () => <DiplomaTableHeader
                                                diplomaSpecialityList={diplomaSpecialityListTrue}
                                                subjectsInBLHGT={subjectsInBLHGT}
                                                subjects={subjectsInBLHGT}
                                                addData={addDiplomaTableDataHandler}
                                            />
                                        },
                                        body: {
                                            cell: QualCategoryTableEditableCell
                                        }
                                    }}
                                />
                            </Form>
                        </TabPane>
                        <TabPane tab={t('Сертификат переподготовки')} key="4">
                            <Form
                                form={qualCategoryTableForm}
                                onValuesChange={onQualCategoryTableValuesChange}
                                component={false}
                            >
                                <Table
                                    bordered
                                    size='middle'
                                    pagination={false}
                                    rowClassName={setQualCategoryTableRowClassName}
                                    className="main-table"
                                    rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                    columns={mergedRetrainSertColumns}
                                    dataSource={retrainSertTableData.filter(item => item.Status !== 3)}
                                    onRow={(record) => onQualCategoryTableRow(record)}
                                    scroll={{
                                        x: "max-content",
                                        y: '90vh'
                                    }}
                                    components={{
                                        header: {
                                            row: () => <RetrainingTableHeader
                                                diplomaSpecialityList={diplomaSpecialityListFalse}
                                                subjectsInBLHGT={subjectsInBLHGT}
                                                addData={addRetrainingTableDataHandler}
                                            />
                                        },
                                        body: {
                                            cell: QualCategoryTableEditableCell
                                        }
                                    }}
                                />
                            </Form>
                        </TabPane>
                        <TabPane tab={t('Сертификат языка')} key="5">
                            <Form
                                form={qualCategoryTableForm}
                                onValuesChange={onQualCategoryTableValuesChange}
                                component={false}
                            >
                                <Table
                                    bordered
                                    size='middle'
                                    pagination={false}
                                    rowClassName={setQualCategoryTableRowClassName}
                                    className="main-table"
                                    rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                    columns={mergedLangSertColumns}
                                    dataSource={langSertTableData.filter(item => item.Status !== 3)}
                                    onRow={(record) => onQualCategoryTableRow(record)}
                                    scroll={{
                                        x: "max-content",
                                        y: '90vh'
                                    }}
                                    components={{
                                        header: {
                                            row: () => <LangCertificateTableHeader
                                                DistributionOfLessonHours={DistributionOfLessonHours}
                                                addData={addLangSertTableDataHandler}
                                            />
                                        },
                                        body: {
                                            cell: QualCategoryTableEditableCell
                                        }
                                    }}
                                />
                            </Form>
                        </TabPane>
                        <TabPane tab={t('Надбавка с дир. фонда')} key="6">
                            <Form
                                form={qualCategoryTableForm}
                                onValuesChange={onQualCategoryTableValuesChange}
                                component={false}
                            >
                                <Table
                                    bordered
                                    size='middle'
                                    pagination={false}
                                    rowClassName={setQualCategoryTableRowClassName}
                                    className="main-table"
                                    rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                    columns={mergedDirectorsFundColumns}
                                    dataSource={directorsFundTableData.filter(item => (item.Status !== 3 && item.AllowanceTypeID === 1))}
                                    onRow={(record) => onQualCategoryTableRow(record)}
                                    scroll={{
                                        x: "max-content",
                                        y: '90vh'
                                    }}
                                    components={{
                                        header: {
                                            row: () => <DirectorsFundTableHeader
                                                subjectsInBLHGT={subjectsInBLHGT}
                                                addData={addDirectorsFundTablDataHandler}
                                            />
                                        },
                                        body: {
                                            cell: QualCategoryTableEditableCell
                                        }
                                    }}
                                />
                            </Form>
                        </TabPane>
                        <TabPane tab={t('MethodUnion')} key="7">
                            <Form
                                form={qualCategoryTableForm}
                                onValuesChange={onQualCategoryTableValuesChange}
                                component={false}
                            >
                                <Table
                                    bordered
                                    size='middle'
                                    pagination={false}
                                    rowClassName={setQualCategoryTableRowClassName}
                                    className="main-table"
                                    rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                    columns={mergedMethodUnionColumns}
                                    dataSource={directorsFundTableData.filter(item => (item.Status !== 3 && item.AllowanceTypeID === 2))}
                                    onRow={(record) => onQualCategoryTableRow(record)}
                                    scroll={{
                                        x: "max-content",
                                        y: '90vh'
                                    }}
                                    components={{
                                        header: {
                                            row: () => <MethodUnionTableHeader
                                                subjectsInBLHGT={subjectsInBLHGT}
                                                addData={addDirectorsFundTablDataHandler}
                                            />
                                        },
                                        body: {
                                            cell: QualCategoryTableEditableCell
                                        }
                                    }}
                                />
                            </Form>
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
                            type="primary"
                            // htmlType="submit"
                            // form={mainForm}
                            disabled={disabledActions}
                            onClick={submitFormHandler}
                        >
                            {t("save")}
                        </Button>
                    </Space>
                </Spin>
            </MainCard>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={bonusModalVisible}
                timeout={300}
            >
                <BonusInfoModal
                    visible={bonusModalVisible}
                    id={bonusModalId}
                    onCancel={closeBonusModalHandler}
                />
            </CSSTransition>
        </Fade>
    );
};

export default React.memo(UpdateDistributionOfLessonHours);
