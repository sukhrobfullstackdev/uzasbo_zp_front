import React, { useState, useEffect } from 'react';
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, InputNumber, Switch, Space, Tabs, Table } from "antd";
import moment from 'moment';

import Card from "../../../../components/MainCard";
import BasicEducationalPlanServices from "../../../../../services/References/Organizational/BasicEducationalPlan/BasicEducationalPlan.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../helpers/notifications";
import classes from './BasicEducationalPlan.module.css';
import BasicEducationalPlanTable from './components/BasicEducationalPlanTable';
import ApiServices from "./../../../../../services/api.services";

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

const UpdateBasicEducationalPlan = (props) => {
    const [loader, setLoader] = useState(true);
    const [basicEducationalPlan, setBasicEducationalPlan] = useState([])

    const [salaryCalcTable, setSalaryCalcTable] = useState([]);
    const [Tables, setTables] = useState([]);
    const [salaryCalcFilterValues, setSalaryCalcFilterValues] = useState({});
    const [salaryCalcTablePagination, setSalaryCalcTablePagination] = useState({
        salaryCalcTablePagination: {
            current: 1,
            pageSize: 50
        }
    });
    const [salaryCalcTableLoading, setSalaryCalcTableLoading] = useState(false);

    const [isFinallyCalculation, setIsFinallyCalculation] = useState(false);
    const [subCalcId, setSubCalcId] = useState(null);
    const [mainFormValuesChanged, setMainFormValuesChanged] = useState(false);
    const [BLHGType, setBLHGType] = useState([]);
    const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            const [slrCalc, blhgList] = await Promise.all([
                BasicEducationalPlanServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getBLHGTypeList()
            ]);

            // console.log(slrCalc.data.Tables);
            setBasicEducationalPlan(slrCalc.data)
            slrCalc.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(slrCalc.data.Tables);
            setBLHGType(blhgList.data);

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...slrCalc.data,
                    Date: moment(slrCalc.data.Date, 'DD.MM.YYYY'),
                });
            } else {
                mainForm.setFieldsValue({
                    ...slrCalc.data,
                    Date: moment(slrCalc.data.Date, 'DD.MM.YYYY'),
                    BLHGTypeID: null,
                });
            }
            setLoader(false);
        }

        fetchData().catch(err => {
            Notification('error', err);
            // console.log(err);
        });
    }, [props.match.params.id, mainForm]);

    const onMainFormFinish = (values) => {
        values.Date = values.Date.format("DD.MM.YYYY");
        // console.log({
        //     ...basicEducationalPlan, ...values,
        //     Tables: Tables,
        // });
        setLoader(true);
        BasicEducationalPlanServices.update({
            ...basicEducationalPlan, ...values,
            Tables: Tables,
        })
            .then((res) => {
                if (res.status === 200) {
                    history.push(`/BasicEducationalPlan`);
                    Notification('success', t('success-msg'));
                    setLoader(false);
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    }

    // const onMainFormFinishFailed = (errorInfo) => {
    //   Notification('error', errorInfo);
    //   // console.log(errorInfo);
    // }

    const onMainFormValuesChange = () => {
        setMainFormValuesChanged(true);
    }

    // const getModalData = (name, id) => {
    //     setSubCalcId(id);
    //     mainForm.setFieldsValue({ SubCalculationKindName: name });
    // };

    const switchChangeHandler = (e) => {
        setIsFinallyCalculation(e);
    }

    // const handleSalaryCalcTableChange = (pagination, filters, sorter) => {
    //     fetchSalaryCalcTableData({
    //         sortField: sorter.field,
    //         sortOrder: sorter.order,
    //         pagination,
    //         ...filters,
    //     }, salaryCalcFilterValues);
    // };

    // const fetchSalaryCalcTableData = (params = {}, filterValues) => {
    //     setSalaryCalcTableLoading(true);
    //     let pageNumber = params.pagination.current,
    //         pageLimit = params.pagination.pageSize,
    //         sortColumn = params.sortField,
    //         orderType = params.sortOrder

    //     BasicEducationalPlanServices.getSalaryCalculationTableData(docId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 setSalaryCalcTable(res.data.rows);
    //                 setSalaryCalcTableLoading(false);
    //                 setLoader(false);
    //                 setSalaryCalcTablePagination({
    //                     salaryCalcTablePagination: {
    //                         ...params.pagination,
    //                         total: res.data.total,
    //                     },
    //                 });
    //             }
    //         })
    //         .catch((err) => {
    //             Notification('error', err);
    //             setLoader(false);
    //             setSalaryCalcTableLoading(false);
    //         });
    // };

    // const salaryCalcTableFilterHandler = (filterValues) => {
    //     const { salaryCalcTablePagination: pagination } = salaryCalcTablePagination;
    //     setSalaryCalcFilterValues(filterValues);
    //     fetchSalaryCalcTableData({ pagination }, filterValues);
    // }

    // const fill`Handler = async () => {
    //     const values = await mainForm.validateFields()
    //     try {
    //         setSalaryCalcTableLoading(true);
    //         values.ID = docId;
    //         values.SubCalculationKindID = subCalcId;
    //         values.Date = values.Date.format("DD.MM.YYYY");
    //         const updateSalaryCalc = await BasicEducationalPlanServices.calculate(values, mainFormValuesChanged);
    //         if (updateSalaryCalc.status === 200) {
    //             setDocId(updateSalaryCalc.data);
    //             const { salaryCalcTablePagination: pagination } = salaryCalcTablePagination;
    //             fetchSalaryCalcTableData({ pagination }, {});
    //         }
    //     } catch (error) {
    //         // console.log(error);
    //         Notification('error', error);
    //         setSalaryCalcTableLoading(false);
    //     }
    // }`

    const salaryCalcColumns = [
        {
            title: t("Code"),
            dataIndex: "Code",
            width: 80,
            sorter: true
        },
        {
            title: t("Subjects"),
            dataIndex: "SubjectsName",
            width: 180,
            sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("FirstClass"),
            dataIndex: "Class1",
            width: 120,
            sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("SecondClass"),
            dataIndex: "Class2",
            width: 120,
            sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("ThirdClass"),
            dataIndex: "Class3",
            width: 80,
            sorter: true
        },
        {
            title: t("FourthClass"),
            dataIndex: "Class4",
            width: 120,
            sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("FivethClass"),
            dataIndex: "Class5",
            width: 100,
            sorter: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("SixthClass"),
            dataIndex: "Class6",
            width: 100,
            sorter: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("SeventhClass"),
            dataIndex: "Class7",
            width: 100,
            sorter: true,
            className: classes['out-sum'],
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("EighthClass"),
            dataIndex: "Class8",
            width: 110,
            sorter: true
        },
        {
            title: t("NinethClass"),
            dataIndex: "Class9",
            width: 110,
            sorter: true
        },
        {
            title: t("TenthClass"),
            dataIndex: "Class10",
            width: 100,
            sorter: true
        },
        {
            title: t("ElevnthClass"),
            dataIndex: "Class11",
            width: 90,
            sorter: true
        },
        {
            title: t("TotalWeeklyHours"),
            dataIndex: "TotaWeeklylHours",
            width: 150,
            sorter: true
        },

    ];

    const { salaryCalcTablePagination: slrCalcTablePagination } = salaryCalcTablePagination;

    let fillBtnVisible = true;
    if (basicEducationalPlan.StatusID === 2 || basicEducationalPlan.StatusID === 6 || basicEducationalPlan.StatusID === 8 || basicEducationalPlan.StatusID === 12) {
        fillBtnVisible = false;
    }

    const editTableData = (data) => {
        setTables(data);
    };

    const getAllSubjects = (id) => {
        console.log(id);
        setLoader(true);
        ApiServices.get(`SubjectsInBLHGT/GetAllSubjectsInBLHGTList`, {
            params: {
                Date: mainForm.getFieldValue(['Date']).format("DD.MM.YYYY"),
                BLHGTypeID: id,
                ForBillingList: false,
                TeachingAtHome: mainForm.getFieldValue(['TeachingAtHome']),
            }
        }).then((res => {
            res.data.map((table) => {
                table.key = Math.random();
                table.Class1 = 0;
                table.Class2 = 0;
                table.Class3 = 0;
                table.Class4 = 0;
                table.Class5 = 0;
                table.Class6 = 0;
                table.Class7 = 0;
                table.Class8 = 0;
                table.Class9 = 0;
                table.Class10 = 0;
                table.Class11 = 0;
                return table;
            })
            setTables(res.data);
            setLoader(false);
        })).catch((err => {
            Notification('error', err);
            setLoader(false);
        }))
    }

    const handleTotalHours = (totalHours) => {
        mainForm.setFieldsValue({
            TotalHours: totalHours,
        });
    }

    return (
        <Fade>
            <Card title={t("BasicEducationalPlan")}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        form={mainForm}
                        id="mainForm"
                        onFinish={onMainFormFinish}
                        // onFinishFailed={onMainFormFinishFailed}
                        onValuesChange={onMainFormValuesChange}
                    >
                        <Row gutter={[15, 0]}>

                            <Col span={12} xl={3} lg={6}>
                                <Form.Item
                                    label={t("Date")}
                                    name="Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}>
                                    <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} placeholder={t("date")} />
                                </Form.Item>
                            </Col>

                            <Col span={12} xl={2}>
                                <Form.Item
                                    label={t("StartYear")}
                                    name="StartYear"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("inputValidData")
                                        },
                                    ]}
                                >
                                    <InputNumber placeholder={t("StartYear")} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12} xl={2}>
                                <Form.Item
                                    label={t("EndYear")}
                                    name="EndYear"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("inputValidData")
                                        },
                                    ]}
                                >
                                    <InputNumber disabled placeholder={t("EndYear")} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={12} xl={2} lg={12}>
                                <Form.Item
                                    label={t("TotalHours")}
                                    name="TotalHours"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("inputValidData"),
                                        },
                                    ]}
                                >
                                    <InputNumber disabled style={{ width: "100%" }} placeholder={t("TotalHours")} />
                                </Form.Item>
                            </Col>

                            <Col span={24} xl={8} lg={12}>
                                <Form.Item
                                    label={t("Comment")}
                                    name="Comment"
                                    rules={[
                                        {
                                            required: true,
                                            message: t('inputValidData'),
                                        },
                                    ]}
                                >
                                    <TextArea rows={1} placeholder={t("Comment")} />
                                </Form.Item>
                            </Col>

                            <Col span={24} xl={3} lg={6}>
                                <Form.Item
                                    label={t("BLHGType")}
                                    name="BLHGTypeID"
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder={t("BLHGType")}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onSelect={getAllSubjects}
                                    >
                                        {BLHGType.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12} xl={2} lg={12}>
                                <Space>
                                    <Form.Item
                                        label={t("TeachingAtHome")}
                                        name="TeachingAtHome"
                                        valuePropName="checked"
                                    >
                                        <Switch onChange={switchChangeHandler} />
                                    </Form.Item>
                                </Space>
                            </Col>

                            {/* <Col xl={24} lg={24}>
                                <Space size='middle' className='btns-wrapper'>
                                    {fillBtnVisible &&
                                        <Button
                                            type="primary"
                                            onClick={fillHandler}>
                                            {t("fill1")}
                                        </Button>
                                    }
                                </Space>
                            </Col> */}
                        </Row>
                    </Form>

                    {/* <Tabs defaultActiveKey="1"> */}
                    {/* <TabPane tab={t('Sample')} key="1"> */}
                    {/* <Form
                                className='inner-table-filter-form'
                                onFinish={salaryCalcTableFilterHandler}
                            >
                                <Space size='middle'>
                                    <Form.Item
                                        label={t('PrsNum')}
                                        name="PersonNumber"
                                    >
                                        <InputNumber style={{ width: 100 }} min={0} placeholder={t('PrsNum')} />
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
                                </Space>
                            </Form> */}
                    <BasicEducationalPlanTable
                        data={Tables}
                        editTableData={editTableData}
                        handleTotalHours={handleTotalHours}
                    />
                    {/* <Table
                        bordered
                        size='middle'
                        rowClassName="table-row"
                        className="main-table"
                        dataSource={salaryCalcTable}
                        columns={salaryCalcColumns}
                        loading={salaryCalcTableLoading}
                        rowKey={(record) => record.ID}
                        // onChange={handleSalaryCalcTableChange}
                        showSorterTooltip={false}
                        pagination={{
                            ...slrCalcTablePagination,
                            showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                        }}
                        scroll={{
                            x: "max-content",
                            y: '75vh'
                        }}
                    /> */}
                    {/* </TabPane> */}
                    {/* <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane> */}
                    {/* </Tabs> */}

                    <Space size='middle' className='btns-wrapper'>
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
                            htmlType="submit"
                            form="mainForm"
                            type="primary"
                        >
                            {t("save")}
                        </Button>
                    </Space>
                </Spin>
            </Card>
        </Fade>
    );
};

export default UpdateBasicEducationalPlan;