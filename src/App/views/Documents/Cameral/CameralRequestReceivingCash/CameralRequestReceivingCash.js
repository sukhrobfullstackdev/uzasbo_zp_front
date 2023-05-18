import React, { Component } from "react";
import { Table, Input, Form, Button, Select, InputNumber, Switch } from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import CameralRequestReceivingCashServices from "../../../../../services/Documents/Cameral/CameralRequestReceivingCash/CameralRequestReceivingCash.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";
// import classes from "./EmployeeDismissal.module.css";

const { Option } = Select;
const currentDate = moment();
const year = currentDate.format('YYYY');
const defaultPagination = {
    current: 1,
    pageSize: 10,
}

class CameralRequestReceivingCash extends Component {
    filterForm = React.createRef();

    state = {
        data: [],
        oblasts: [],
        regions: [],
        chapters: [],
        filterData: {},
        loading: false,
        filterType: ''
    };

    fetchData = async () => {
        try {
            const orgList = await HelperServices.getRegionList();
            const chaptersList = await CameralRequestReceivingCashServices.getChapterList()
            this.setState({ oblasts: orgList.data, chapters: chaptersList.data })
        } catch (err) {
            Notification('error', err);
            // console.log(err);
        }
    }

    componentDidMount() {
        this.fetchData();

    }

    handleOblast = (id) => {
        HelperServices.getDistrictList(id)
            .then(response => {
                this.setState({ regions: response.data })
            })
    }

    fetch = (params = {}, filterFormValues) => {
        // console.log(filterFormValues)

        this.setState({ loading: true });


        CameralRequestReceivingCashServices.getList(filterFormValues)
            .then((data) => {
                this.setState({
                    loading: false,
                    data: data.data,
                });
            })
            .catch((err) => {
                Notification('error', err);
            });
    };

   

    search = () => {
        const filterValues = this.filterForm.current.getFieldsValue();
        this.setState({ loading: true, filterData: filterValues });
        this.fetch({ pagination: defaultPagination }, filterValues);
    };

    // onFinish = (filterFormValues) => {
    //     // console.log(filterFormValues);
    //     this.setState({ loading: true, filterData: filterFormValues });
    //     this.fetch({ pagination: defaultPagination }, filterFormValues);
    //     this.print({ pagination: defaultPagination }, filterFormValues);
    // };

    onFinish = (filterFormValues) => {
        if (this.state.print) {
           
              
                this.setState({ loading: true });
                CameralRequestReceivingCashServices.print(filterFormValues)
                    .then(response => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", "CameralRequestReceivingCash.xlsx");
                        document.body.appendChild(link);
                        link.click();
                        this.setState({ loading: false });
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification('error', err)
                        this.setState({ loading: false });
                    })
            
        } else {
            this.setState({ loading: true, filterData: filterFormValues });
            this.fetch({ pagination: defaultPagination }, filterFormValues);
        }

        // this.print({ pagination: defaultPagination }, filterFormValues);
    };

    filterTypeHandler = (type) => {
        this.setState({ filterType: type });
    };



    render() {
        const { t } = this.props;
        const columns = [
            {
                title: t("ID"),
                dataIndex: "ID",
                key: "ID",
                sorter: true,
                width: 100
            },
            {
                title: t("OrgINN"),
                dataIndex: "OrgINN",
                key: "OrgINN",
                sorter: true,
                width: 100
            },
            {
                title: t("OrgName"),
                dataIndex: "OrgName",
                key: "OrgName",
                sorter: true,
                width: 160
            },
            {
                title: t("OblName"),
                dataIndex: "OblName",
                key: "OblName",
                sorter: true,
                width: 150
            },
            {
                title: t("RegName"),
                dataIndex: "RegName",
                key: "RegName",
                sorter: true,
                width: 100
            },

            {
                title: t("Date"),
                dataIndex: "Date",
                key: "Date",
                sorter: true,
                width: 100
            },
            {
                title: t("Charge"),
                dataIndex: "Charge",
                key: "Charge",
                sorter: true,
                width: 150
            },
            {
                title: t("EmpINN"),
                dataIndex: "EmpINN",
                key: "EmpINN",
                sorter: true,
                width: 160
            },
            {
                title: t("FullName"),
                dataIndex: "FullName",
                key: "FullName",
                sorter: true,
                width: 160
            },
            {
                title: t("PositionName"),
                dataIndex: "PositionName",
                key: "PositionName",
                sorter: true,
                width: 160
            },
            {
                title: t("BaseSum"),
                dataIndex: "BaseSum",
                key: "BaseSum",
                sorter: true,
                width: 160
            },
            {
                title: t("CalcSum"),
                dataIndex: "CalcSum",
                key: "CalcSum",
                sorter: true,
                width: 160
            },
            {
                title: t("Contribution"),
                dataIndex: "Contribution",
                key: "Contribution",
                sorter: true,
                width: 160
            },
            {
                title: t("Deduction"),
                dataIndex: "Deduction",
                key: "Deduction",
                sorter: true,
                width: 160
            },
            {
                title: t("FactDays"),
                dataIndex: "FactDays",
                key: "FactDays",
                sorter: true,
                width: 160
            },
            {
                title: t("FactHours"),
                dataIndex: "FactHours",
                key: "FactHours",
                sorter: true,
                width: 160
            },
            {
                title: t("PlanDays"),
                dataIndex: "PlanDays",
                key: "PlanDays",
                sorter: true,
                width: 160
            },
            {
                title: t("SettlementAccount"),
                dataIndex: "SettlementAccount",
                key: "SettlementAccount",
                sorter: true,
                width: 160
            },

        ];

        const { data, loading } = this.state;

        return (
            <Card title={t("CameralRequestReceivingCash")}>
                <Fade>
                    <div className="table-top">
                        <Form
                            ref={this.filterForm}
                            onFinish={this.onFinish}
                            className='table-filter-form'
                            initialValues={{
                                EndDate: moment().add(30, "days"),
                                StartDate: moment().subtract(30, "days"),
                                Year: year,
                                // Date: moment('DD.MM.YYYY'),
                            }}
                        >
                            <div className="main-table-filter-elements">

                                <Form.Item
                                    label={t('Year')}
                                    name='Year'
                                >
                                    <InputNumber placeholder={t('Year')} />
                                </Form.Item>
                                <Form.Item
                                    name="OblastID"
                                    label={t("region")}>
                                    <Select
                                        allowClear
                                        placeholder={t("region")}
                                        style={{ width: 200 }}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={this.handleOblast}
                                    >
                                        {this.state.oblasts.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="RegionID"
                                    label={t("District")}>
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder={t("District")}
                                        style={{ width: 200 }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {this.state.regions.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="ChapterID"
                                    label={t("Chapter")}>
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder={t("Chapter")}
                                        style={{ width: 200 }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {this.state.chapters.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={t('OrgINN')}
                                    name='OrgINN'
                                >
                                    <Input placeholder={t('OrgINN')} />
                                </Form.Item>

                                <Form.Item
                                    label={t('OnlyDifference')}
                                    name='OnlyDifference'
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>

                                <Button type="primary" htmlType="submit">
                                    <i className="feather icon-refresh-ccw" />
                                </Button>

                                {/* <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    <span onClick={() => this.print}>
                                        <i className="feather icon-printer" />
                                    </span>
                                </Button> */}

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => this.setState({ print: true })}
                                >
                                    {/* <span onClick={() => this.print}> */}
                                    <i className="feather icon-printer" />
                                    {/* </span> */}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Fade>
                <Fade>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        onChange={this.handleTableChange}
                        rowKey={(record) => record.ID}
                        rowClassName="table-row"
                        className="main-table"
                        showSorterTooltip={false}
                        scroll={{
                            //   x: "max-content",
                            y: '50vh'
                        }}
                    />
                </Fade>
            </Card>
        );
    }
}

export default withTranslation()(CameralRequestReceivingCash);
