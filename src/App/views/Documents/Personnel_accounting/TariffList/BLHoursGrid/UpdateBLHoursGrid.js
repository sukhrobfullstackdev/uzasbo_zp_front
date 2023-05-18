import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Input, InputNumber, Spin, Tabs, Table } from "antd";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import moment from "moment";

import MainCard from "../../../../../components/MainCard";
import classes from "./BLHoursGrid.module.css";
import { Notification } from "../../../../../../helpers/notifications";
import BLHoursGridServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/BLHoursGrid/BLHoursGrid.services";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const { TabPane } = Tabs;
// const { Option } = Select;
const { TextArea } = Input;

const UpdateBLHoursGrid = (props) => {
    //const [hoursGridSheet, setBLHoursGridForClass] = useState([]);
    const [rowId, setRowId] = useState(null);
    const [loader, setLoader] = useState(true);
    const [disabledInputs, setDisabledInputs] = useState(false);
    const [BLHoursGrid, setBLHoursGrid] = useState([])
    const [blHourGradeTable, setBlHourGradeTable] = useState([])
    const [tableLoading, setTableLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [tablesTeachingAtHome, setTablesTeachingAtHome] = useState([]);
    const [BLClassCount, setBLClassCount] = useState([]);
    const [TotalHours1, setTotalHours1] = useState(0);
    const [TotalHours2, setTotalHours2] = useState(0);
    const [tablePagination, setTablePagination] = useState({
        pagination: {
            current: 1,
            pageSize: 50
        }
    });
    const docId = props.match.params.id ? props.match.params.id : 0;

    const { t } = useTranslation();

    const history = useHistory();
    const [mainForm] = Form.useForm();
    const [tableForm] = Form.useForm();
    const docTitle = docId === 0 ? t('BLHoursGrid') : t('BLHoursGrid');

    const regularClassTable = [
        {
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            sorter: true,
            align: 'center',
            // width: 90
        },
        {
            title: t("Items"),
            dataIndex: "SubjectsName",
            key: "SubjectsName",
            sorter: true,
            // align: 'center',
        },
        {
            title: t("FirstClass"),
            dataIndex: "Class1",
            key: "Class1",
            sorter: true,
            align: 'center',
        },
        {
            title: t("SecondClass"),
            dataIndex: "Class2",
            key: "Class2",
            sorter: true,
            align: 'center',
        },
        {
            title: t("ThirdClass"),
            dataIndex: "Class3",
            key: "Class3",
            sorter: true,
            align: 'center',
        },
        {
            title: t("FourthClass"),
            dataIndex: "Class4",
            key: "Class4",
            sorter: true,
            align: 'center',
        },
        {
            title: t("FivethClass"),
            dataIndex: "Class5",
            key: "Class5",
            sorter: true,
            align: 'center',
        },
        {
            title: t("SixthClass"),
            dataIndex: "Class6",
            key: "Class6",
            sorter: true,
            align: 'center',
        },
        {
            title: t("SeventhClass"),
            dataIndex: "Class7",
            key: "Class7",
            sorter: true,
            align: 'center',
        },
        {
            title: t("EighthClass"),
            dataIndex: "Class8",
            key: "Class8",
            sorter: true,
            align: 'center',
        },
        {
            title: t("NinethClass"),
            dataIndex: "Class9",
            key: "Class9",
            sorter: true,
            align: 'center',
        },
        {
            title: t("TenthClass"),
            dataIndex: "Class10",
            key: "Class10",
            sorter: true,
            align: 'center',
        },
        {
            title: t("ElevnthClass"),
            dataIndex: "Class11",
            key: "Class11",
            sorter: true,
            align: 'center',
        },
        {
            title: t("TotalWeeklyHours"),
            dataIndex: "TotaWeeklylHours",
            key: "TotaWeeklylHours",
            sorter: true,
            align: 'center',
        },
        {
            title: t("DividedSciences"),
            dataIndex: "DividedSciences",
            key: "DividedSciences",
            sorter: true,
            align: 'center',
        },
        {
            title: t("TotalAnnualHours"),
            dataIndex: "TotalAnnualHours",
            key: "TotalAnnualHours",
            sorter: true,
            align: 'center',
        }
    ]

    useEffect(() => {
        async function fetchData() {
            try {
                const hoursGridSht = await BLHoursGridServices.getById(docId);
                // const blHourGradeTable = await BLHoursGridServices.GetForFillBLHoursGrid(hoursGridSht.data.StartYear, 1, 50);
                setBLHoursGrid(hoursGridSht.data);
                setTableData(hoursGridSht.data.Tables)
                setTablesTeachingAtHome(hoursGridSht.data.TablesTeachingAtHome)
                let TotalAnnualHours1 = 0;
                let TotalAnnualHours2 = 0;
                hoursGridSht.data.Tables.forEach(item => {
                    if (item.ParentID === 0) {
                        TotalAnnualHours1 += +item.TotalAnnualHours;
                    }
                })
                hoursGridSht.data.TablesTeachingAtHome.forEach(item => {
                    if (item.ParentID === 0) {
                        TotalAnnualHours2 += +item.TotalAnnualHours;
                    }
                })
                setTotalHours1(TotalAnnualHours1)
                setTotalHours2(TotalAnnualHours2)
                setLoader(false);
                setDisabledInputs(true);
                // setBlHourGradeTable(blHourGradeTable.data);
                // setTablePagination((prevState) => (
                //     {
                //         pagination: {
                //             ...prevState.pagination,
                //             total: blHourGradeTable.data.total
                //         }
                //     }
                // ));
                mainForm.setFieldsValue({
                    ...hoursGridSht.data,
                    Date: moment(hoursGridSht.data.Date, 'DD.MM.YYYY'),
                    StartYear: moment(hoursGridSht.data.StartYear, 'YYYY'),
                    EndYear: moment(hoursGridSht.data.EndYear, 'YYYY'),
                    DocYear: moment().year(),
                });
            } catch (err) {
                // console.log(err);
                Notification('error', err);
            }
        }
        fetchData();
    }, [docId, mainForm]);

    // const onFinish = async (values) => {
    //     console.log(values)
    //     values.ID = docId;
    //     setLoader(true);

    //     try {
    //         const mainData = await BLHoursGridServices.GetForFillBLHoursGrid(values.StartYear);
    //         if (mainData.status === 200) {
    //             const { pagination } = tablePagination;
    //             fetchTableData({ pagination }, {}, mainData.data);
    //         }
    //     } catch (error) {
    //         setLoader(false);
    //         // console.log(error);
    //         Notification('error', error)
    //     }
    // };
    const fillTableHandler = async (params) => {
        mainForm.validateFields()
            .then((value) => {
                const fetchData = async () => {
                    setTableLoading(true);
                    const [BLClassCount, ForFillBLHoursGrid,] = await Promise.all([
                        BLHoursGridServices.getBLClassCount({ StartYear: value.StartYear.format('YYYY') }),
                        BLHoursGridServices.GetForFillBLHoursGrid(value.StartYear.format('YYYY'), value.BLHGTypeID),
                    ])
                    setBLClassCount(BLClassCount.data)
                    setTableData([...tableData, ...ForFillBLHoursGrid.data.Tables])
                    setTablesTeachingAtHome([...tablesTeachingAtHome, ...ForFillBLHoursGrid.data.TablesTeachingAtHome])
                    let TotalAnnualHours1 = 0;
                    let TotalAnnualHours2 = 0;
                    ForFillBLHoursGrid.data.Tables.forEach(item => {
                        if (item.ParentID === 0) {
                            TotalAnnualHours1 += +item.TotalAnnualHours;
                        }
                    })
                    ForFillBLHoursGrid.data.TablesTeachingAtHome.forEach(item => {
                        if (item.ParentID === 0) {
                            TotalAnnualHours2 += +item.TotalAnnualHours;
                        }
                    })
                    setTotalHours1(TotalAnnualHours1)
                    setTotalHours2(TotalAnnualHours2)
                    setTableLoading(false);
                }
                fetchData().catch(err => {
                    Notification('error', err)
                });
            })
    };

    const fetchTableData = (params = {}, filterValues, StartYear) => {
        // console.log(docId);

        setTableLoading(true);
        let pageNumber = params.pagination.current,
            pageLimit = params.pagination.pageSize,
            sortColumn = params.sortField,
            orderType = params.sortOrder

        BLHoursGridServices.GetForFillBLHoursGrid(StartYear, pageNumber, pageLimit, sortColumn, orderType, filterValues)
            .then((res) => {
                if (res.status === 200) {
                    setBlHourGradeTable(res.data.rows);
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
        return (record.ParentID === null || record.ParentID === 0) ? `${classes.bold} table-row clicked-row` : 'table-row';
    }

    const tableSummaryHandler = records => {
        let total1 = 0;
        let total2 = 0;
        let total3 = 0;
        let total4 = 0;
        let total5 = 0;
        let total6 = 0;
        let total7 = 0;
        let total8 = 0;
        let total9 = 0;
        let total10 = 0;
        let total11 = 0;
        let TotaWeeklylHours = 0;
        let DividedSciences = 0;
        let TotalAnnualHours = 0;

        records.forEach(item => {
            if (item.ParentID === 0) {
                total1 += +item.Class1;
                total2 += +item.Class2;
                total3 += +item.Class3;
                total4 += +item.Class4;
                total5 += +item.Class5;
                total6 += +item.Class6;
                total7 += +item.Class7;
                total8 += +item.Class8;
                total9 += +item.Class9;
                total10 += +item.Class10;
                total11 += +item.Class11;
                TotaWeeklylHours += +item.TotaWeeklylHours;
                DividedSciences += +item.DividedSciences;
                TotalAnnualHours += +item.TotalAnnualHours;
            }
        });

        return (
            <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                {/* <Table.Summary.Cell>{t("TotalHours")}</Table.Summary.Cell> */}
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total1)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total2)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total3)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total4)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total5)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total6)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total7)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total8)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total9)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total10)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total11)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(TotaWeeklylHours)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(DividedSciences)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(TotalAnnualHours)}</div></Table.Summary.Cell>
            </Table.Summary.Row>
        );
    }
    const tableTeachingAtHomeSummaryHandler = records => {
        let total1 = 0;
        let total2 = 0;
        let total3 = 0;
        let total4 = 0;
        let total5 = 0;
        let total6 = 0;
        let total7 = 0;
        let total8 = 0;
        let total9 = 0;
        let total10 = 0;
        let total11 = 0;
        let TotaWeeklylHours = 0;
        let DividedSciences = 0;
        let TotalAnnualHours = 0;

        records.forEach(item => {
            if (item.ParentID === 0) {
                total1 += +item.Class1;
                total2 += +item.Class2;
                total3 += +item.Class3;
                total4 += +item.Class4;
                total5 += +item.Class5;
                total6 += +item.Class6;
                total7 += +item.Class7;
                total8 += +item.Class8;
                total9 += +item.Class9;
                total10 += +item.Class10;
                total11 += +item.Class11;
                TotaWeeklylHours += +item.TotaWeeklylHours;
                DividedSciences += +item.DividedSciences;
                TotalAnnualHours += +item.TotalAnnualHours;
            }
        });

        return (
            <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                {/* <Table.Summary.Cell>{t("TotalHours")}</Table.Summary.Cell> */}
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total1)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total2)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total3)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total4)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total5)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total6)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total7)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total8)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total9)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total10)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total11)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(TotaWeeklylHours)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(DividedSciences)}</div></Table.Summary.Cell>
                <Table.Summary.Cell><div style={{ textAlign: 'center' }}>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(TotalAnnualHours)}</div></Table.Summary.Cell>
            </Table.Summary.Row>
        );
    }
    useEffect(() => {
        mainForm.setFieldsValue({
            TotalHours: TotalHours1 + TotalHours2,
        })
    }, [mainForm, TotalHours1, TotalHours2])

    const saveAllHandler = () => {
        setLoader(true);
        mainForm.validateFields()
            .then(values => {
                values.ID = docId;
                values.Date = values.Date.format('DD.MM.YYYY');
                values.StartYear = values.StartYear?.format("YYYY");
                values.EndYear = values.EndYear?.format("YYYY");
                BLHoursGridServices.postData({
                    ...BLHoursGrid, ...values, Tables: tableData, TablesTeachingAtHome: tablesTeachingAtHome
                })
                    .then(res => {
                        if (res.status === 200) {
                            Notification("success", t("saved"));
                            setLoader(false);
                            history.push('/BLHoursGrid');
                        }
                    })
                    .catch(err => {
                        // console.log(err);
                        setLoader(false);
                    })
            })
            .catch(err => {
                alert('please fill all inputs');
                setLoader(false);
            })
    }

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
        setBLClassCount({
            CountClass1: 0, CountClass2: 0,
            CountClass3: 0, CountClass4: 0,
            CountClass5: 0, CountClass6: 0,
            CountClass7: 0, CountClass8: 0,
            CountClass9: 0, CountClass10: 0,
            CountClass11: 0,
        })
    };

    const { pagination } = tablePagination;

    const components = {
        header: {
            row: () => <tr>
                <th className='ant-table-cell'>
                    {t('Code')}
                </th>
                <th className='ant-table-cell'>
                    {t('Items')}
                </th>
                <th className='ant-table-cell'>
                    {t('FirstClass').slice(0, -3)}({Object.values(BLClassCount)[0] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('SecondClass').slice(0, -3)}({Object.values(BLClassCount)[1] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('ThirdClass').slice(0, -3)}({Object.values(BLClassCount)[2] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('FourthClass').slice(0, -3)}({Object.values(BLClassCount)[3] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('FivethClass').slice(0, -3)}({Object.values(BLClassCount)[4] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('SixthClass').slice(0, -3)}({Object.values(BLClassCount)[5] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('SeventhClass').slice(0, -3)}({Object.values(BLClassCount)[6] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('EighthClass').slice(0, -3)}({Object.values(BLClassCount)[7] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('NinethClass').slice(0, -3)}({Object.values(BLClassCount)[8] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('TenthClass').slice(0, -3)}({Object.values(BLClassCount)[9] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('ElevnthClass').slice(0, -3)}({Object.values(BLClassCount)[10] || 0})
                </th>
                <th className='ant-table-cell'>
                    {t('TotalWeeklyHours')}
                </th>
                <th className='ant-table-cell'>
                    {t('DividedSciences')}
                </th>
                <th className='ant-table-cell'>
                    {t('TotalAnnualHours')}
                </th>
            </tr>
        },
    };

    return (
        <Fade>
            <MainCard title={docTitle}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        className={classes.FilterForm}
                        //onFinish={onFinish}
                        form={mainForm}
                        id='mainForm'
                    >
                        <Row gutter={[16, 16]}>

                            <Col xl={3} lg={6} md={12}>
                                <Form.Item label={t("number")}
                                    name="Number"
                                    style={{ width: '100%' }}
                                >
                                    <Input disabled={disabledInputs} />
                                </Form.Item>
                            </Col>

                            <Col xl={3} lg={6} md={12}>
                                <Form.Item
                                    label={t("Date")}
                                    name="Date"
                                >
                                    <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} disabled={disabledInputs} />
                                </Form.Item>
                            </Col>

                            <Col xl={2} lg={6} md={12}>
                                <Form.Item
                                    label={t("StartYear")}
                                    name="StartYear"
                                >
                                    <DatePicker format="YYYY" picker="year" disabled={disabledInputs} />
                                </Form.Item>
                            </Col>

                            <Col xl={2} lg={6} md={12}>
                                <Form.Item label={t("EndYear")}
                                    name="EndYear"
                                    style={{ width: '100%' }}
                                >
                                    <DatePicker format="YYYY" picker="year" disabled={disabledInputs} />
                                </Form.Item>
                            </Col>

                            <Col xl={3} lg={6} md={12}>
                                <Form.Item label={t("TotalHours")}
                                    name="TotalHours"
                                    style={{ width: '100%' }}
                                >
                                    <Input disabled={disabledInputs} />
                                </Form.Item>
                            </Col>

                            <Col xl={11} lg={18} span={24}>
                                <Form.Item
                                    label={t("Comment")}
                                    name="Comment"
                                >

                                    <TextArea
                                        disabled={disabledInputs}
                                        rows={1}
                                    />

                                </Form.Item>
                            </Col>
                            <Col md={12} lg={4}>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("regularClass")}: </div><div className={classes.value}>{TotalHours1}</div>
                                </div>
                            </Col>
                            <Col md={12} lg={4}>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("Обучение на дому")}: </div><div className={classes.value}>{TotalHours2}</div>
                                </div>
                            </Col>
                        </Row>
                    </Form>

                    <div className={classes.buttons}>
                        <Button
                            onClick={fillTableHandler}
                            disabled={tableData?.filter(item => item.Status !== 3).length > 0}
                        >{t("fill")}</Button>
                        <Button onClick={clearTableHandler}>{t("Tozalash")}</Button>
                    </div>

                    <Tabs defaultActiveKey="1">
                        <TabPane tab={t("regularClass")} key="1">
                            {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : */}
                            <Table
                                boardered
                                rowClassName={setRowClassName}
                                // className="main-table inner-table"
                                dataSource={tableData?.filter(item => item.Status !== 3)}
                                columns={regularClassTable}
                                components={components}
                                loading={tableLoading}
                                pagination={{
                                    ...pagination,
                                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                                }}
                                summary={records => tableSummaryHandler(records)}
                                scroll={{
                                    x: "max-content",
                                    // y: '80vh'
                                }}
                            />
                        </TabPane>
                        {tablesTeachingAtHome.length > 0 && (
                            <TabPane tab={t("Обучение на дому")} key="2">
                                {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : */}
                                <Table
                                    boardered
                                    rowClassName={setRowClassName}
                                    // className="main-table inner-table"
                                    dataSource={tablesTeachingAtHome.filter(item => item.Status !== 3)}
                                    columns={regularClassTable}
                                    components={components}
                                    loading={tableLoading}
                                    pagination={{
                                        ...pagination,
                                        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                                    }}
                                    summary={records => tableTeachingAtHomeSummaryHandler(records)}
                                    scroll={{
                                        x: "max-content",
                                        // y: '80vh'
                                    }}
                                />
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
export default UpdateBLHoursGrid;