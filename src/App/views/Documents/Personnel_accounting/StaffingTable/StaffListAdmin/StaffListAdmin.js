import React from 'react'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Checkbox, DatePicker, Form, Input, Select } from "antd";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import Card from "../../../../../components/MainCard";
import { getListStartAction, setListFilter } from './_redux/getListSlice';
import TableData from './components/TableData';
import { useState } from 'react';
import HelperServices from '../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../helpers/notifications';
import StaffListServices from '../../../../../../services/Documents/Personnel_accounting/StaffingTable/StaffList/StaffList.services';

const { Option } = Select;

const StaffListAdmin = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const reduxList = useSelector((state) => state.staffListAdmin);
    const StaffListAdminView = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('StaffListAdminView');

    let tableData = reduxList.listSuccessData?.rows;
    let total = reduxList.listSuccessData?.total;
    let pagination = reduxList?.paginationData;
    let filter = reduxList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const getList = (values) => {
        dispatch(setListFilter({
            ...values
        }));
    };

    const [regionList, setRegionList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [statusList, setStatusList] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const regionList = await HelperServices.getRegionList()
            const statusList = await HelperServices.getStatusList()
            setRegionList(regionList.data)
            setStatusList(statusList.data)
        }

        fetchData().catch(err => {
            Notification('error', err)
        })
    }, [])

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                values.Year = values.Year.format("YYYY");
                getList(values);
            });
    };

    const onFinish = (values) => {
        values.Year = values.Year.format("YYYY");
        getList(values);
    };

    const refresh = () => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }

    const regionChangeHandler = (id) => {
        filterForm.setFieldsValue({ RegionID: null });
        HelperServices.getDistrictList(id)
            .then(res => {
                setDistrictList(res.data)
            })
            .catch((err) => Notification('error', err));
    }

    const handlePrint = () => {
        setConfirmLoading(true);
        filterForm.validateFields()
            .then(values => {
                values.Year = values.Year.format("YYYY");
                StaffListServices.Print1(values)
                    .then((res) => {
                        if (res.status === 200) {
                            console.log(new Blob([res.data]))
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "Print1.xlsx");
                            document.body.appendChild(link);
                            link.click();

                            setConfirmLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setConfirmLoading(false);
                    })
            })
    }

    return (
        <Card title={t("StaffListAdmin")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        Year: moment().add({ year: 1 })
                    }}
                >
                    <div className='main-table-filter-elements'>
                        <Form.Item name="OblastID">
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("region")}
                                style={{ width: 150 }}
                                optionFilterProp="children"
                                onChange={regionChangeHandler}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {regionList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="RegionID">
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("district")}
                                style={{ width: 150 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {districtList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="StatusID">
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("status")}
                                style={{ width: 150 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {statusList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.DisplayName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="Year"
                        // label={t("StartYear")}
                        >
                            <DatePicker format="YYYY" picker="year" />
                        </Form.Item>

                        <Form.Item name="FunctionalItem">
                            <Input.Search
                                // style={{ width: '100%' }}
                                placeholder={t("FunctionalItem")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="AllOrganizations" valuePropName="checked">
                            <Checkbox >{t("AllOrganizations")}</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="main-table-filter-element">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>

                        <Button
                            type="primary"
                            loading={confirmLoading}
                            onClick={handlePrint}
                            className="main-table-filter-element"
                        >
                            <i className="feather icon-printer" />
                        </Button>

                        {/* <Button type="primary" className="main-table-filter-element">
                            <Link to={`${match.path}/add`}>
                                {t("add-new")}&nbsp;
                                <i className="feather icon-plus" aria-hidden="true" />
                            </Link>
                        </Button> */}
                    </div>
                </Form>
            </Fade>
            <Fade>
                <TableData
                    tableData={tableData} total={total} match={match}
                    reduxList={reduxList} refresh={refresh} adminRole={StaffListAdminView}
                />
            </Fade>
        </Card>
    )
}

export default React.memo(StaffListAdmin)