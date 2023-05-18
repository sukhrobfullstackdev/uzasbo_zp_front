import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Space, InputNumber, Input, Tabs, Spin, Col, Row, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';

import MaternityLeaveRequestServices from '../../../../../services/Documents/Payroll/MaternityLeaveRequest/MaternityLeaveRequest.services';
import HelperServices from "./../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../helpers/notifications";
import MainCard from "../../../../components/MainCard";
import months from '../../../../../helpers/months';
import TabData1 from './components/TabData1';
import TabData2 from './components/TabData2'

const { Option } = Select;
const currentDate = moment();
const month = currentDate.format('MM');
const year = currentDate.format('YYYY');


const UpdateMaternityLeaveRequest = (props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const { TabPane } = Tabs;

    const [mainForm] = Form.useForm();
    const docId = props.match.params.id ? props.match.params.id : 0;

    const [maternityLeaveRequestList, setMaternityLeaveRequest] = useState([])
    const [functionalItemOfExpenseList, setFunctionalItemOfExpenseList] = useState([]);
    const [chapterToPositionOwnerList, setChapterToPositionOwnerList] = useState([]);
    const [TotalEmployee, setTotalEmployee] = useState([]);
    const [TotalSickSum, setTotalSickSum] = useState([]);
    const [tabData2, setTabData2] = useState([]);
    const [requestSum, setRequestSum] = useState([]);
    const [existSum, setExistSum] = useState([]);
    const [disableInput, setDisableInput] = useState(false);
    // console.log(requestSum);

    const [loader, setLoader] = useState(true);

    let CalculationTable = {}
    // console.log(CalculationTable);
    const [tabData1, setTabData1] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [maternityLeaveRequestList, funcItemCodeList, chapterList] = await Promise.all([
                MaternityLeaveRequestServices.getById(docId),
                HelperServices.getFunctionalItemOfExpenseList(),
                HelperServices.getChapterToPositionOwnerList(),

            ]);
            setMaternityLeaveRequest(maternityLeaveRequestList.data);
            setFunctionalItemOfExpenseList(funcItemCodeList.data);
            setChapterToPositionOwnerList(chapterList.data);
            setTabData2(maternityLeaveRequestList.data.EmployeeTable);
            setTotalSickSum(maternityLeaveRequestList.data.CalculationTable.TotalSickSum);
            setTotalEmployee(maternityLeaveRequestList.data.CalculationTable.TotalEmployee);
            setLoader(false);
            if (maternityLeaveRequestList.data.ID !== 0) {
                setDisableInput(true);
            }
            if (maternityLeaveRequestList.data.ID !== 0) {
                maternityLeaveRequestList.data.EmployeeTable.Status = 1;
            }

            // console.log(maternityLeaveRequestList.data.CalculationTable);
            mainForm.setFieldsValue({
                ...maternityLeaveRequestList.data,

                Year: maternityLeaveRequestList.data.Year === 0 ? year : maternityLeaveRequestList.data.Year,
                Month: maternityLeaveRequestList.data.Month === 0 ? month : maternityLeaveRequestList.data.MonthName,
                FunctionalItemID: maternityLeaveRequestList.data.FunctionalItemID === 0 ? null : maternityLeaveRequestList.data.FunctionalItemID,
                ChapterID: maternityLeaveRequestList.data.ChapterID === 0 ? null : maternityLeaveRequestList.data.ChapterID,
                Date: moment(maternityLeaveRequestList.data.Date, 'DD.MM.YYYY'),
                // RequestSum: maternityLeaveRequestList.data.ID === 0 ? maternityLeaveRequestList.data.CalculationTable.TotalSickSum : maternityLeaveRequestList.data.CalculationTable.RequestSum
                RequestSum: maternityLeaveRequestList.data.CalculationTable.RequestSum
            });

        }
        fetchData().catch(err => {
            Notification('error', err);
        });
    }, [docId, mainForm]);



    const fillTableHandler = async () => {
        setLoader(true);
        mainForm.validateFields()
            .then((values) => {
                MaternityLeaveRequestServices.postDataFillTableData(values)
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                        if (res.status === 200) {
                            mainForm.setFieldsValue({
                                // ...res.data,
                                TotalSickSum:res.data.CalculationTable.TotalSickSum,
                                TotalEmployee:res.data.CalculationTable.TotalEmployee,
                                RequestSum:res.data.CalculationTable.TotalSickSum
                              })
                            setLoader(false);
                            setTotalSickSum(res.data.CalculationTable.TotalSickSum);
                            setTotalEmployee(res.data.CalculationTable.TotalEmployee);
                            setRequestSum(res.data.CalculationTable.TotalSickSum)
                            setTabData2(res.data.EmployeeTable);
                            setTabData1(res.data.CalculationTable)
                            setDisableInput(true)
                        }
                    })
                    .catch(err => {
                        Notification('error', err);
                        setLoader(false);
                    })
            })
            .catch(err => {
                Notification('error', err);
            })
    }
    const saveAllHandler = (key) => {
        mainForm.validateFields()
            .then((values) => {
                console.log(values);
                values.CalculationTable = tabData1;
                values.CalculationTable.RequestSum = requestSum
                values.CalculationTable.ExistSum = existSum
                
                // console.log(values.EmployeeTable);
                // const index = tabData2.map((item) => key === item.Status);
                // console.log(index);
                // console.log(index);
                // if (tabData2.Status === 0) {
                    
            
                //   } 
                // .catch (errInfo) {
                //   console.log("Validate Failed:", errInfo);
                //   setTableLoading(false);
                // }
                
                // values.EmployeeTable.Status = 1;
                values.EmployeeTable = tabData2;
                setLoader(true);

                if (values?.EmployeeTable?.length === 0) {
                    setLoader(false);
                    Notification('error', t('error'));
                } else {
                    MaternityLeaveRequestServices.postData(values)
                        .then(res => {
                            if (res.status === 200) {
                                Notification("success", t("saved"));
                                setLoader(false);
                                history.push('/MaternityLeaveRequest');
                            }
                        })
                        .catch(err => {
                            // console.log(err);
                            Notification("error", err);
                            setLoader(false);
                        })
                }


            })
    }

    // const existSum = []

    // const changeSum = (e) => {
    //     console.log(typeof +e.target.value);
    //     CalculationTable.IncludingSum = e.target.value
    //     setIncludingSum(e.target.value)
    //     // setExisttSum(CalculationTable.ExistSum)
    //     setMaternityLeaveRequest({ ...maternityLeaveRequestList, CalculationTable: CalculationTable })
    //     let requestSum = `${TotalSickSum - existSum - +e.target.value}`
    //     console.log(requestSum, 'requestSum', TotalSickSum);
    //     setRequestSum(requestSum)

    const handleInputChange1 = (event) => {
        CalculationTable.ExistSum = event.target.value
        setExistSum(event.target.value)
        let requestSum = TotalSickSum - +event.target.value
        // setRequestSum(requestSum)
        mainForm.setFieldsValue({
            // RequestSum: CalculationTable.RequestSum === 0? TotalSickSum : requestSum
            RequestSum: requestSum
        })
    };

    return (
        <Fade>
            <MainCard title={t("RequestSickList")}>
                <Spin spinning={loader} size='large'>

                    <Form
                        onFinish={fillTableHandler}
                        className='table-filter-form'
                        form={mainForm}
                    >
                        <Space
                            size='middle'
                            align='start'
                        >
                            <Form.Item
                                label={t('Number')}
                                name='Number'
                            >
                                <Input placeholder={t('Number')} disabled />
                            </Form.Item>
                            <Form.Item name="Date">
                                <DatePicker format="DD.MM.YYYY" disabled={disableInput} />
                            </Form.Item>
                            <Form.Item
                                label={t('Year')}
                                name='Year'
                            >
                                <InputNumber placeholder={t('Year')} disabled={disableInput} />
                            </Form.Item>

                            <Form.Item
                                label={t("Month")}
                                name="Month"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("Month")}
                                    style={{ width: 170 }}
                                    optionFilterProp="children"
                                    disabled={disableInput}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {months.map(item => <Option key={item.id} value={item.id}>{t(item.name)}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("razDep")}
                                name="FunctionalItemID"

                            >
                                <Select
                                    // placeholder={t("OrganizationFunctionalItem")}
                                    style={{ width: 150 }}
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                    disabled={disableInput}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {functionalItemOfExpenseList.map(item =>
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Code}
                                        </Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("Chapter")}
                                name="ChapterID"

                            >
                                <Select
                                    // placeholder={t("Chapter")}
                                    style={{ width: 120 }}
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                    disabled={disableInput}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {chapterToPositionOwnerList.map(item =>
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Code}
                                        </Option>)
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={fillTableHandler} disabled={disableInput}>{t("fill")}</Button>
                            </Form.Item>
                        </Space>

                        <Tabs defaultActiveKey="1" style={{ width: '100%' }}>
                            <TabPane tab={t('PersonnelDepartment')} key="2">
                                <TabData2 tableData={tabData2} />
                            </TabPane>

                            <TabPane tab={t('orderCollection')} key="3">
                                <TabData1 tableData={tabData1} />
                                {/* <Form
                                    form={mainForm}
                                    style={{ width: '100%' }}
                                >
                                    
                                    <Row gutter={[24, 0]} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <Col xl={10} lg={12}>
                                            <Form.Item
                                                label={t('TotalEmployee')}
                                                name='Total'
                                            >
                                                <Input defaultValue={TotalEmployee} placeholder={t('TotalEmployee')} disabled />
                                            </Form.Item>

                                            <Form.Item
                                                label={t('IncludingSum')}
                                                name='IncludingSum'
                                            >
                                                <Input defaultValue={0} placeholder={t('IncludingSum')} disabled />
                                            </Form.Item>
                                        </Col>

                                        <Col xl={10} lg={12}>
                                            <Form.Item
                                                label={t('TotalSickSum')}
                                                name='TotalSickSum'
                                            >
                                                <Input defaultValue={TotalSickSum} placeholder={t('TotalSickSum')} disabled />
                                            </Form.Item>
                                            
                                            <Form.Item
                                                label={t('ExistSum')}
                                                name='ExistSum'
                                            >
                                                <Input defaultValue={maternityLeaveRequestList.CalculationTable?.ExistSum} onChange={handleInputChange1} placeholder={t('ExistSum')} />
                                            </Form.Item>
                                            
                                            <Form.Item
                                                label={t('RequestSum')}
                                                name='RequestSum'
                                            >
                                                <Input defaultValue={requestSum} placeholder={t('RequestSum')} disabled />
                                            </Form.Item>
                                        </Col>

                                    </Row>
                                </Form> */}


                            </TabPane>
                        </Tabs>
                    </Form>
                    <Space size='middle' className='btns-wrapper'>
                        <Button
                            onClick={saveAllHandler}
                            type="primary"
                        >
                            {t("save")}
                        </Button>
                        <Button
                            type="danger"
                            onClick={() => {
                                history.goBack();
                                Notification("warning", t("not-saved"));
                            }}>
                            {t("back")}
                        </Button>

                    </Space>
                </Spin>
            </MainCard>
        </Fade >
    );
};

export default UpdateMaternityLeaveRequest;