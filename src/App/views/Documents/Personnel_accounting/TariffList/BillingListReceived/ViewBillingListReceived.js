import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Input, Spin, Table, InputNumber, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import MainCard from "../../../../../components/MainCard";
import classes from "./BillingListSend.module.css";
import { Notification } from "../../../../../../helpers/notifications";
import BillingListServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/BillingList/BillingList.services";
// import HelperServices from "../../../../../../services/Helper/helper.services";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const ViewBillingListReceived = (props) => {
    const [loader, setLoader] = useState(true);
    const [employeeId, setEmployeeId] = useState(null);
    //  const [minimalSalaryList, setMinimalSalaryList] = useState([]);

    const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
    //  const [selectionType, setSelectionType] = useState('checkbox');
    // const [filldata, setFilldata] = useState([]);
    //Movement modal table
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [cantEdit, setCantEdit] = useState(false);

    const [tablePagination, setTablePagination] = useState({
        pagination: {
            current: 1,
            pageSize: 50
        }
    });

    const [tableLoading, setTableLoading] = useState(false);

    const { TextArea } = Input;
    const { t } = useTranslation();
    const history = useHistory();
    const [form] = Form.useForm();
    const [tableForm] = Form.useForm();
    const docId = props.match.params.id ? props.match.params.id : 0;

    useEffect(() => {
        async function fetchData() {
            try {
                const EmployeeMovement = await BillingListServices.getById(docId);
                setEmployeeId(EmployeeMovement.data.EmployeeID)
                setTableData(EmployeeMovement.data.Tables)
                setCantEdit(EmployeeMovement.data.StatusID === 2
                    || EmployeeMovement.data.StatusID === 8
                    || EmployeeMovement.data.StatusID === 9
                    || EmployeeMovement.data.StatusID === 13);
                setLoader(false);
                form.setFieldsValue({
                    ...EmployeeMovement.data,
                    Date: moment(EmployeeMovement.data.Date, 'DD.MM.YYYY'),
                    EndYear: EmployeeMovement.data.Year + 1,
                    MinSalary: EmployeeMovement.data.MinSalary,
                })
            } catch (err) {
                console.log(err);
                setLoader(false);
            }
        }
        fetchData();
    }, [docId, form]);
console.log(cantEdit);
    const fetchTableData = (params = {}, filterValues) => {
        setTableLoading(true);
        let pageNumber = params.pagination.current,
            pageLimit = params.pagination.pageSize,
            sortColumn = params.sortField,
            orderType = params.sortOrder
        // fillId = id ? id : docId

        BillingListServices.getTableData(docId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
            .then((res) => {
                if (res.status === 200) {
                    setCurrentDocId(docId);
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
                console.log(err);
                setLoader(false);
                setTableLoading(false);
            });
    };
    //table row fill
    const fillTableHandler = async (params) => {
        form.validateFields()
            .then((values) => {
                console.log(values);
                values.EmployeeID = employeeId;
                values.ID = currentDocId;
                values.Date = values.Date.format('DD.MM.YYYY');
                // values.Tables = [...tableData];
                setTableLoading(true);
                BillingListServices.postDataFillTableData(values)
                    .then(res => {
                        console.log(res);
                        if (res.status === 200) {
                            // setCurrentDocId(res.data[0].OwnerID)
                            setTableLoading(false);
                            setLoader(false);
                            setTablePagination({
                                pagination: {
                                    ...params.pagination,
                                    total: res.data.total,
                                },
                            });
                            setTableData(res.data.Tables);
                        }
                    })
                    .catch(err => {
                        Notification('error', err);
                        setTableLoading(false);
                        setLoader(false);
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }
    //delete row clear
    const clearRowsHandler = () => {
        let deleteData = [...tableData];
        deleteData.forEach(item => {
            item.Status = 3;
        })
        setTableData(deleteData);
    };

    //delete select row

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
    };

    // const deleteRowsHandler = () => {
    //     if (selectedRows.length === 0) {
    //         Notification("warning", t("please select row"));
    //         return;
    //     }
    //     setTableLoading(true);
    //     const selectedIds = selectedRows.map(item => item.ID);
    //     BillingListServices.deleteTableRow(selectedIds)
    //         .then(res => {
    //             if (res.status === 200) {
    //                 setTableLoading(false)
    //                 const { pagination } = tablePagination;
    //                 fetchTableData({ pagination });
    //                 setSelectedRows([]);
    //             }
    //         })
    //         .catch(err => console.log(err))
    // }

    //save All ADD
    const saveAllHandler = () => {
        if (tableData.filter(item => item.Status !== 3).length > 0) {
            history.push('/BillingList');
        } else {
            Notification("error", t("notFilled"));
        }
        // form.validateFields()
        //     .then((values) => {
        //         values.EmployeeID = employeeId;
        //         values.ID = currentDocId;
        //         values.Date = values.Date.format('DD.MM.YYYY');
        //         values.Tables = [...tableData];
        //         setLoader(true);
        //         BillingListServices.postData(values)
        //             .then(res => {
        //                 history.push('/BillingList');
        //                 Notification("success", t("saved"));
        //                 setLoader(false);
        //             })
        //             .catch(err => {
        //                 console.log(err);
        //                 setLoader(false);
        //             })
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }

    const Tables = [
        {
            title: t('Vacancies'),
            dataIndex: 'Vacancies',
            key: 'Vacancies',
            width: 100,
            render: (record) => {
                return <Switch defaultChecked={record} disabled />
            }
        },
        {
            title: t('Employee'),
            dataIndex: 'Employee',
            key: 'Employee',
            width: 200,
        },
        {
            title: t('PositionQualificationName'),
            dataIndex: 'PositionQualificationName',
            key: 'PositionQualificationName',
            width: 180,
        },
        {
            title: t('SubjectName'),
            dataIndex: 'SubjectName',
            key: 'SubjectName',
            width: 180,
        },

        {
            title: t('PositionQualificationAmountTable'),
            dataIndex: 'PositionQualificationAmountTable',
            key: 'PositionQualificationAmountTable',
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
            width: 120,
        },


        {
            title: t('EnrolmentType'),
            dataIndex: 'EnrolmentType',
            key: 'EnrolmentType',
            width: 180,
        },
        {
            title: '1-4 классы',
            children: [
                {
                    title: t('ElementaryClassWorkLoad'),
                    dataIndex: 'ElementaryClassWorkLoad',
                    key: 'ElementaryClassWorkLoad',
                    width: 100,
                },
                {
                    title: t('ElementaryClassTeachingLoad'),
                    dataIndex: 'ElementaryClassTeachingLoad',
                    key: 'ElementaryClassTeachingLoad',
                    width: 100,
                },
            ],
        },
        {
            title: t('5-9 классы'),
            children: [
                {
                    title: t('JuniorClassWorkLoad'),
                    dataIndex: 'JuniorClassWorkLoad',
                    key: 'JuniorClassWorkLoad',
                    width: 100,
                },
                {
                    title: t('JuniorClassTeachingLoad'),
                    dataIndex: 'JuniorClassTeachingLoad',
                    key: 'JuniorClassTeachingLoad',
                    width: 100,
                },
            ],
        },
        {
            title: t('10-11 классы'),
            children: [
                {
                    title: t('SeniorClassWorkLoad'),
                    dataIndex: 'SeniorClassWorkLoad',
                    key: 'SeniorClassWorkLoad',
                    width: 100,
                },
                {
                    title: t('SeniorClassTeachingLoad'),
                    dataIndex: 'SeniorClassTeachingLoad',
                    key: 'SeniorClassTeachingLoad',
                    width: 100,
                },
            ],
        },
        {
            title: t('Месячная зарплата'),
            children: [
                {
                    title: t('1-4 классы'),
                    children: [

                        {
                            title: t('ElementaryClassWorkLoadSum'),
                            dataIndex: 'ElementaryClassWorkLoadSum',
                            key: 'ElementaryClassWorkLoadSum',
                            width: 120,
                        },
                        {
                            title: t('ElementaryClassTeachingLoadSum'),
                            dataIndex: 'ElementaryClassTeachingLoadSum',
                            key: 'ElementaryClassTeachingLoadSum',
                            width: 120,
                        },
                    ],
                },

                {
                    title: t('5-9 классы'),
                    children: [
                        {
                            title: t('JuniorClassWorkLoadSum'),
                            dataIndex: 'JuniorClassWorkLoadSum',
                            key: 'JuniorClassWorkLoadSum',
                            width: 120,
                        },
                        {
                            title: t('JuniorClassTeachingLoadSum'),
                            dataIndex: 'JuniorClassTeachingLoadSum',
                            key: 'JuniorClassTeachingLoadSum',
                            width: 120,
                        },
                    ],
                },

                {
                    title: t('10-11 классы'),
                    children: [
                        {
                            title: t('SeniorClassWorkLoadSum'),
                            dataIndex: 'SeniorClassWorkLoadSum',
                            key: 'SeniorClassWorkLoadSum',
                            width: 120,
                        },
                        {
                            title: t('SeniorClassTeachingLoadSum'),
                            dataIndex: 'SeniorClassTeachingLoadSum',
                            key: 'SeniorClassTeachingLoadSum',
                            width: 120,
                        },
                    ],
                },
            ],
        },

        {
            title: t('Проверка тетрадей и писменных работ'),
            children: [
                {
                    title: t('AllowanceElementaryCheckNoteBook'),
                    dataIndex: 'AllowanceElementaryCheckNoteBook',
                    key: 'AllowanceElementaryCheckNoteBook',
                    width: 150,
                },
                {
                    title: t('AllowanceSeniorCheckNoteBook'),
                    dataIndex: 'AllowanceSeniorCheckNoteBook',
                    key: 'AllowanceSeniorCheckNoteBook',
                    width: 150,
                },
            ],
        },


        {
            title: t('Классное руководство'),
            children: [
                {
                    title: t('ClassTitleTableName'),
                    dataIndex: 'ClassTitleTableName',
                    key: 'ClassTitleTableName',
                    width: 150,
                },
                {
                    title: t('AllowanceClassGuidance'),
                    dataIndex: 'AllowanceClassGuidance',
                    key: 'AllowanceClassGuidance',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 150,
                },
            ],
        },

        {
            title: t('Обучение на дому'),
            children: [
                {
                    title: t('IndTraingClassWorkLoad'),
                    dataIndex: 'IndTraingClassWorkLoad',
                    key: 'IndTraingClassWorkLoad',
                    width: 120,
                },
                {
                    title: t('IndTraingClassWorkLoadSum'),
                    dataIndex: 'IndTraingClassWorkLoadSum',
                    key: 'IndTraingClassWorkLoadSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('Надбавка с дир. фонда'),
            children: [
                {
                    title: t('AllowanceForProfessionality'),
                    dataIndex: 'AllowanceForProfessionality',
                    key: 'AllowanceForProfessionality',
                    width: 120,
                },
                {
                    title: t('AllowanceForProfessionalitySum'),
                    dataIndex: 'AllowanceForProfessionalitySum',
                    key: 'AllowanceForProfessionalitySum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },

        {
            title: t('AllowanceForeignLanguageTop'),
            children: [
                {
                    title: t('AllowanceForeignLanguage'),
                    dataIndex: 'AllowanceForeignLanguage',
                    key: 'AllowanceForeignLanguage',
                    width: 200,
                },
                {
                    title: t('AllowanceForeignLanguageSum'),
                    dataIndex: 'AllowanceForeignLanguageSum',
                    key: 'AllowanceForeignLanguageSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 150,
                },
            ],
        },
        {
            title: t('AllowanceForDepthTop'),
            children: [
                {
                    title: t('AllowanceInDepth'),
                    dataIndex: 'AllowanceInDepth',
                    key: 'AllowanceInDepth',
                    width: 200,
                },
                {
                    title: t('AllowanceInDepthSum'),
                    dataIndex: 'AllowanceInDepthSum',
                    key: 'AllowanceInDepthSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 150,
                },
            ],
        },
        {
            title: t('AllowancePhysicsTop'),
            children: [
                {
                    title: t('AllowancePhysicalEducation'),
                    dataIndex: 'AllowancePhysicalEducation',
                    key: 'AllowancePhysicalEducation',
                    width: 200,
                },
                {
                    title: t('AllowancePhysicalEducationSum'),
                    dataIndex: 'AllowancePhysicalEducationSum',
                    key: 'AllowancePhysicalEducationSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 220,
                },
            ],
        },
        {
            title: t('AllowanceMountainousPlacesTop'),
            children: [
                {
                    title: t('AllowanceMountainousPlaces'),
                    dataIndex: 'AllowanceMountainousPlaces',
                    key: 'AllowanceMountainousPlaces',
                    width: 100,
                },
                {
                    title: t('AllowanceMountainousPlacesSum'),
                    dataIndex: 'AllowanceMountainousPlacesSum',
                    key: 'AllowanceMountainousPlacesSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('RemoteRegionTop'),
            children: [
                {
                    title: t('RemoteRegion'),
                    dataIndex: 'RemoteRegion',
                    key: 'RemoteRegion',
                    width: 100,
                },
                {
                    title: t('RemoteRegionSum'),
                    dataIndex: 'RemoteRegionSum',
                    key: 'RemoteRegionSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('OlympicsTop'),
            children: [
                {
                    title: t('Olympics'),
                    dataIndex: 'Olympics',
                    key: 'Olympics',
                    width: 100,
                },
                {
                    title: t('OlympicsSum'),
                    dataIndex: 'OlympicsSum',
                    key: 'OlympicsSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('HonoredTeacherTop'),
            children: [
                {
                    title: t('HonoredTeacher'),
                    dataIndex: 'HonoredTeacher',
                    key: 'HonoredTeacher',
                    width: 120,
                },
                {
                    title: t('HonoredTeacherSum'),
                    dataIndex: 'HonoredTeacherSum',
                    key: 'HonoredTeacherSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },

        {
            title: t('DirectorsFundSuperTeacherTop'),
            children: [
                {
                    title: t('DirectorsFundSuperTeacher'),
                    dataIndex: 'DirectorsFundSuperTeacher',
                    key: 'DirectorsFundSuperTeacher',
                    width: 120,
                },
                {
                    title: t('DirectorsFundSuperTeacherSum'),
                    dataIndex: 'DirectorsFundSuperTeacherSum',
                    key: 'DirectorsFundSuperTeacherSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('AllowanceIslamicUnivTop'),
            children: [
                {
                    title: t('AllowanceIslamicUniv'),
                    dataIndex: 'AllowanceIslamicUniv',
                    key: 'AllowanceIslamicUniv',
                    width: 120,
                },
                {
                    title: t('AllowanceIslamicUnivSum'),
                    dataIndex: 'AllowanceIslamicUnivSum',
                    key: 'AllowanceIslamicUnivSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('LongServicePaymentTop'),
            children: [
                {
                    title: t('LongServicePayment'),
                    dataIndex: 'LongServicePayment',
                    key: 'LongServicePayment',
                    width: 100,
                },
                {
                    title: t('LongServicePaymentSum'),
                    dataIndex: 'LongServicePaymentSum',
                    key: 'LongServicePaymentSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('AllowanceHasInformaticsCabinetTop'),
            children: [
                {
                    title: t('hasInformaticsCabinet'),
                    dataIndex: 'HasInformaticsCabinet',
                    key: 'HasInformaticsCabinet',
                    width: 120,
                    render: (record) => {
                        return <Switch defaultChecked={record} disabled />
                    }
                },
                {
                    title: t('AllowanceHasInformaticsCabinetSum'),
                    dataIndex: 'AllowanceHasInformaticsCabinetSum',
                    key: 'AllowanceHasInformaticsCabinetSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('AlloeanceOlympicsChildren'),
            children: [
                {
                    title: t('OlympicsChildren'),
                    dataIndex: 'OlympicsChildren',
                    key: 'OlympicsChildren',
                    width: 120,
                },
                {
                    title: t('OlympicsChildrenSum'),
                    dataIndex: 'OlympicsChildrenSum',
                    key: 'OlympicsChildrenSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('Таълим сифати юқори бўлмаган мактаблар (Қизил мактаб) учун устама'),
            children: [
                {
                    title: t('RedSchool'),
                    dataIndex: 'RedSchool',
                    key: 'RedSchool',
                    width: 100,
                },
                {
                    title: t('RedSchoolSum'),
                    dataIndex: 'RedSchoolSum',
                    key: 'RedSchoolSum',
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                    width: 120,
                },
            ],
        },
        {
            title: t('Табиий фанлар учун устама'),
            children: [
                {
                    title: t('NaturalSciences'),
                    dataIndex: 'NaturalSciences',
                    key: 'NaturalSciences',
                    width: 100,
                },
                {
                    title: t('NaturalSciencesSum'),
                    dataIndex: 'NaturalSciencesSum',
                    key: 'NaturalSciencesSum',
                    width: 120,
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                },
            ],
        },
        {
            title: t('С1 сертификат учун устама'),
            children: [
                {
                    title: t('ForeignLang'),
                    dataIndex: 'ForeignLang',
                    key: 'ForeignLang',
                    width: 100,
                },
                {
                    title: t('ForeignLangSum'),
                    dataIndex: 'ForeignLangSum',
                    key: 'ForeignLangSum',
                    width: 120,
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                },
            ],
        },
        {
            title: t('Фан номзодлиги учун устама'),
            children: [
                {
                    title: t('ScienceCandidate'),
                    dataIndex: 'ScienceCandidate',
                    key: 'ScienceCandidate',
                    width: 100,
                },
                {
                    title: t('ScienceCandidateSum'),
                    dataIndex: 'ScienceCandidateSum',
                    key: 'ScienceCandidateSum',
                    width: 120,
                    render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
                },
            ],
        },
        {
            title: t('Sum'),
            dataIndex: 'Sum',
            key: 'Sum',
            width: 140,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
    ];

    //table
    const mergedColumns = Tables.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (values) => ({
                values,
                inputType: "number",
                dataIndex: col.dataIndex,
                title: col.title,
            })
        };
    });

    const tableSummaryHandler = (records) => {
        let ElementaryClassWorkLoad = 0;
        let ElementaryClassTeachingLoad = 0;
        let JuniorClassWorkLoad = 0;
        let JuniorClassTeachingLoad = 0;
        let SeniorClassWorkLoad = 0;
        let SeniorClassTeachingLoad = 0;
        let ElementaryClassWorkLoadSum = 0;
        let ElementaryClassTeachingLoadSum = 0;
        let JuniorClassWorkLoadSum = 0;
        let JuniorClassTeachingLoadSum = 0;
        let SeniorClassWorkLoadSum = 0;
        let SeniorClassTeachingLoadSum = 0;
        let AllowanceElementaryCheckNoteBook = 0;
        let AllowanceSeniorCheckNoteBook = 0;
        let AllowanceClassGuidance = 0;
        let IndTraingClassWorkLoadSum = 0;
        let AllowanceForProfessionalitySum = 0;
        let AllowanceForeignLanguageSum = 0;
        let AllowanceInDepthSum = 0;
        let AllowancePhysicalEducationSum = 0;
        let AllowanceMountainousPlacesSum = 0;
        let RemoteRegionSum = 0;
        let OlympicsSum = 0;
        let HonoredTeacherSum = 0;
        let DirectorsFundSuperTeacherSum = 0;
        let AllowanceIslamicUnivSum = 0;
        let LongServicePaymentSum = 0;
        let AllowanceHasInformaticsCabinetSum = 0;
        let OlympicsChildrenSum = 0;
        let RedSchoolSum = 0;
        let NaturalSciencesSum = 0;
        let ForeignLangSum = 0;
        let ScienceCandidateSum = 0;
        let Sum = 0;

        records.forEach(item => {
            ElementaryClassWorkLoad += +item.ElementaryClassWorkLoad;
            ElementaryClassTeachingLoad += +item.ElementaryClassTeachingLoad;
            JuniorClassWorkLoad += +item.JuniorClassWorkLoad;
            JuniorClassTeachingLoad += +item.JuniorClassTeachingLoad;
            SeniorClassWorkLoad += +item.SeniorClassWorkLoad;
            SeniorClassTeachingLoad += +item.SeniorClassTeachingLoad;
            ElementaryClassWorkLoadSum += +item.ElementaryClassWorkLoadSum;
            ElementaryClassTeachingLoadSum += +item.ElementaryClassTeachingLoadSum;
            JuniorClassWorkLoadSum += +item.JuniorClassWorkLoadSum;
            JuniorClassTeachingLoadSum += +item.JuniorClassTeachingLoadSum;
            SeniorClassWorkLoadSum += +item.SeniorClassWorkLoadSum;
            SeniorClassTeachingLoadSum += +item.SeniorClassTeachingLoadSum;
            AllowanceElementaryCheckNoteBook += +item.AllowanceElementaryCheckNoteBook;
            AllowanceSeniorCheckNoteBook += +item.AllowanceSeniorCheckNoteBook;
            AllowanceClassGuidance += +item.AllowanceClassGuidance;
            IndTraingClassWorkLoadSum += +item.IndTraingClassWorkLoadSum;
            AllowanceForProfessionalitySum += +item.AllowanceForProfessionalitySum;
            AllowanceForeignLanguageSum += +item.AllowanceForeignLanguageSum;
            AllowanceInDepthSum += +item.AllowanceInDepthSum;
            AllowancePhysicalEducationSum += +item.AllowancePhysicalEducationSum;
            AllowanceMountainousPlacesSum += +item.AllowanceMountainousPlacesSum;
            RemoteRegionSum += +item.RemoteRegionSum;
            OlympicsSum += +item.OlympicsSum;
            HonoredTeacherSum += +item.HonoredTeacherSum;
            DirectorsFundSuperTeacherSum += +item.DirectorsFundSuperTeacherSum;
            AllowanceIslamicUnivSum += +item.AllowanceIslamicUnivSum;
            LongServicePaymentSum += +item.LongServicePaymentSum;
            AllowanceHasInformaticsCabinetSum += +item.AllowanceHasInformaticsCabinetSum;
            OlympicsChildrenSum += +item.OlympicsChildrenSum;
            RedSchoolSum += +item.RedSchoolSum;
            NaturalSciencesSum += +item.NaturalSciencesSum;
            ForeignLangSum += +item.ForeignLangSum;
            ScienceCandidateSum += +item.ScienceCandidateSum;
            Sum += +item.Sum;
        });
        return (
            <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(ElementaryClassWorkLoad)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(ElementaryClassTeachingLoad)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(JuniorClassWorkLoad)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(JuniorClassTeachingLoad)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(SeniorClassWorkLoad)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(SeniorClassTeachingLoad)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(ElementaryClassWorkLoadSum)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(ElementaryClassTeachingLoadSum)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(JuniorClassWorkLoadSum)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(JuniorClassTeachingLoadSum)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(SeniorClassWorkLoadSum)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(SeniorClassTeachingLoadSum)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceElementaryCheckNoteBook)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceSeniorCheckNoteBook)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceClassGuidance)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(IndTraingClassWorkLoadSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceForProfessionalitySum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceForeignLanguageSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceInDepthSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowancePhysicalEducationSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceMountainousPlacesSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(RemoteRegionSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(OlympicsSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(HonoredTeacherSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(DirectorsFundSuperTeacherSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceIslamicUnivSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(LongServicePaymentSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(AllowanceHasInformaticsCabinetSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(OlympicsChildrenSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(RedSchoolSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(NaturalSciencesSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(ForeignLangSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(ScienceCandidateSum)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Sum)}</Table.Summary.Cell>
            </Table.Summary.Row>
        );
    }

    //main
    return (
        <Fade >
            <MainCard title={t("BillingList")}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        form={form}
                        id="form"
                        className={classes.FilterForm}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xl={6} lg={8}>
                                <div className={classes.InputsWrapper}>
                                    <Form.Item
                                        label={t("number")}
                                        name="Number"
                                    >
                                        <Input disabled placeholder={t("number")} />
                                    </Form.Item>
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
                                        <DatePicker format="DD.MM.YYYY" disabled style={{ color: 'black', width: '100%' }} />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={6} lg={8}>
                                <div className={classes.InputsWrapper}>
                                    <Form.Item
                                        label={t("Year")}
                                        name="Year"
                                        style={{ width: "50%" }}
                                    >
                                        <Input disabled placeholder={t("Year")} />
                                    </Form.Item>
                                    <Form.Item
                                        label={t("EndYear")}
                                        name="EndYear"
                                        style={{ width: "50%" }}
                                        rules={[
                                            {
                                                required: true,
                                                message: t("inputValidData"),
                                            },
                                        ]}>
                                        <Input disabled placeholder={t("EndYear")} />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={6} lg={8}>
                                <div className={classes.InputsWrapper}>
                                    <Form.Item
                                        label={t('Minimal Salary')}
                                        name="MinSalary"
                                    >
                                        <InputNumber
                                            disabled
                                            style={{ color: 'black', width: '100%' }}
                                            decimalSeparator=','
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                        />
                                    </Form.Item>
                                    <Form.Item

                                        label={t("TotalSum")}
                                        name="TotalSum"
                                    >
                                        <Input placeholder={t("TotalSum")} disabled
                                            style={{ color: 'black' }} />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xl={24} lg={6}>
                                <Form.Item
                                    label={t("Comment")}
                                    name="Comment"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <TextArea disabled rows={3} />
                                </Form.Item>
                            </Col>
                            <Col xl={24} lg={24} >
                                <Form form={tableForm} component={false} >
                                    <div className={classes.Buttons}>
                                        {/* <Button onClick={deleteRowsHandler} disabled style={{ color: 'black' }} >{t("Delete")}</Button> */}
                                        <Button
                                            type="primary" onClick={fillTableHandler}
                                            disabled={tableData.filter(item => item.Status !== 3).length > 0}
                                        >
                                            {t("Tuldirish")}
                                        </Button>
                                        <Button disabled={cantEdit} onClick={clearRowsHandler}>{t("Tozalash")}</Button>
                                    </div>

                                    <Table
                                        size='small'
                                        className="main-table"
                                        columns={Tables}
                                        dataSource={tableData.filter(item => item.Status !== 3)}
                                        showSorterTooltip={false}
                                        rowKey={record => record.key ? record.key : record.ID}
                                        pagination={false}
                                        bordered
                                        loading={tableLoading}
                                        // rowSelection={{
                                        //     onChange: onSelectChange,
                                        //     selections: [Table.SELECTION_INVERT],

                                        // }}
                                        scroll={{
                                            x: "max-content",
                                        }}
                                        summary={records => tableSummaryHandler(records)}
                                    // onRow={(values) => {
                                    //     return {
                                    //         //onDoubleClick: () => edit(values),
                                    //     };
                                    // }}
                                    />
                                </Form>
                            </Col>
                            <Col xl={24} lg={24}>
                                <div className={classes.Buttons}>
                                    <Button
                                        type="danger"
                                        onClick={() => {
                                            history.goBack();
                                            Notification("warning", t("not-saved"));
                                        }}>
                                        {t("back")}
                                    </Button>
                                    <Button
                                        onClick={saveAllHandler}
                                        type="primary"
                                        disabled={cantEdit}
                                    >
                                        {t("save")}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </MainCard>
        </Fade>
    );
};
export default React.memo(ViewBillingListReceived);
