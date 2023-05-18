import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, Select, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';
import { CloseCircleFilled } from '@ant-design/icons';

import Card from "../../../../components/MainCard";
import classes from "./Employee.module.scss";
import { getListStartAction, setListFilter, setListFilterType } from './_redux/EmployeeSlice';
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';
import TableEmployees from './components/TableEmployees';
import { CSSTransition } from 'react-transition-group';
import PhoneNumCleanerModal from './components/Modals/PhoneNumCleanerModal';
import EmployeeServices from '../../../../../services/References/Organizational/Employee/employee.services';
import CheckedCleanerModal from './components/Modals/CheckedCleanerModal';

const { Option } = Select;

const Employees = ({ match }) => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    // only for super admin linked via UserID
    // const superAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).UserID === 22412;
    const OrgTypeID = JSON.parse(localStorage.getItem('userInfo')).OrgTypeID;

    const dispatch = useDispatch();
    const employeeList = useSelector((state) => state.employeeList);


    let tableData = employeeList.listSuccessData?.rows;
    let total = employeeList.listSuccessData?.total;
    let pagination = employeeList?.paginationData;
    let filter = employeeList?.filterData;

    const [employeeTypeList, setEmployeeTypeList] = useState([]);
    const [print, setPrint] = useState(false);
    const [phoneNumCleanerModalVisible, setPhoneNumCleanerModalVisible] = useState(false);
    const [checkedCleanerModalVisible, setCheckedCleanerModalVisible] = useState(false);

    const [employeeType, setEmployeeType] = useState(employeeList.filterData.EmployeeTypeID);
    const [filterType, setFilterType] = useState(employeeList.filterType || 'FullName');
    const [filterValue, setFilterValue] = useState(employeeList.filterData[`${filterType}`]);

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter, dispatch]);

    useEffect(() => {
        HelperServices.getEmployeeTypeList()
            .then((response) => {
                setEmployeeTypeList(response.data);
            })
            .catch((err) => {
                Notification('error', err);
            });
    }, []);

    function filterTypeHandler(value) {
        setFilterType(value);
    };

    function employeeTypeHandler(value) {
        setEmployeeType(value);
    };

    const getList = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        dispatch(setListFilter({
            EmployeeTypeID: values?.employeeType,
            [filterType]: values?.search,
            IsNotCheckedHemis: values?.IsNotCheckedHemis,
            IsNotChecked: values?.IsNotChecked,
        }));
    }

    const onSearch = (search) => {
        setFilterValue(search);
        filterForm.validateFields()
            .then(values => {
                getList(values)
            })
    };

    const onFinish = (values) => {
        getList(values)

        if (print) {
            EmployeeServices.printList({
                PageNumber: 1, PageLimit: 10,
                EmployeeTypeID: values?.employeeType, [filterType]: values?.search,
                IsNotChecked: values?.IsNotChecked,
            })
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "employee.xlsx");
                    document.body.appendChild(link);
                    link.click();
                });
        }
    };

    const openPhoneNumCleanerModal = () => {
        setPhoneNumCleanerModalVisible(true);
    };

    const closePhoneNumCleanerModal = (values) => {
        if (values.ID) {
            setPhoneNumCleanerModalVisible(false);
            HelperServices.PhoneNumberCleaner(values.ID)
                .then(res => {
                    if (res.status === 200) {
                        Notification('success', t('edited'));
                        dispatch(
                            getListStartAction({
                                ...pagination,
                                ...filter,
                            })
                        );
                        return res;
                    }
                    throw Error('Server Error');
                })
                .catch(err => {
                    Notification('error', err);
                })
        } else {
            setPhoneNumCleanerModalVisible(false);
        }
    };

    const openCheckedCleanerModal = () => {
        setCheckedCleanerModalVisible(true);
    };

    const closeCheckedCleanerModal = (values) => {
        if (values.ID) {
            setCheckedCleanerModalVisible(false);
            EmployeeServices.ChangeStatusByAdmin(values.ID)
                .then(res => {
                    if (res.status === 200) {
                        Notification('success', t('edited'));
                        dispatch(
                            getListStartAction({
                                ...pagination,
                                ...filter,
                            })
                        );
                        return res;
                    }
                    throw Error('Server Error');
                })
                .catch(err => {
                    Notification('error', err);
                })
        } else {
            setCheckedCleanerModalVisible(false);
        }
    };

    const handleIsNotChecked = () => {
        filterForm.validateFields()
            .then(values => {
                getList(values)
            })
    }
    const handleIsNotCheckedHemis = () => {
        filterForm.validateFields()
            .then(values => {
                getList(values)
            })
    }

    return (
        <Card title={t("Employee")}>
            <Fade>
                <Form
                    className={classes.FilterForm}
                    onFinish={onFinish}
                    form={filterForm}
                    initialValues={{
                        filterType: filterType,
                        search: filterValue,
                        employeeType: employeeType,
                    }}
                >
                    <div className="main-table-filter-elements">
                        <Form.Item
                            name="filterType"
                        // label={t("Filter Type")}
                        >
                            <Select
                                allowClear
                                style={{ width: 180 }}
                                placeholder={t("Filter Type")}
                                onChange={filterTypeHandler}
                            >
                                <Option value="ID">{t('id')}</Option>
                                <Option value="INPSCode">{t('INPSCode')}</Option>
                                <Option value="PlasticCardNumber">{t('plasticCardNumber')}</Option>
                                <Option value="INN">{t('inn')}</Option>
                                <Option value="PersonnelNumber">{t('personnelNumber')}</Option>
                                <Option value="FullName">{t('fullname')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            // label={t("search")}
                            name="search"
                        >
                            <Input.Search
                                enterButton
                                placeholder={t('search')}
                                onSearch={onSearch}
                                className={classes['input-search']}
                            />
                        </Form.Item>

                        <Form.Item name="employeeType">
                            <Select
                                allowClear
                                style={{ width: 120 }}
                                placeholder={t("EmpType")}
                                onChange={employeeTypeHandler}
                            >
                                {employeeTypeList.map((employeeType) => (
                                    <Option key={employeeType.ID} value={employeeType.ID}>
                                        {employeeType.DisplayName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => setPrint(false)}
                            >
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => setPrint(true)}
                            >
                                <i className="feather icon-printer" />
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Tooltip title={t("add-new")}>
                                <Button type="primary">
                                    <Link to={`${match.path}/add`}>
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </Tooltip>
                        </Form.Item>

                        {adminViewRole &&
                            <Form.Item>
                                <Button
                                    type="primary"
                                    onClick={openPhoneNumCleanerModal}
                                >
                                    <i className="fas fa-phone-slash" />
                                </Button>
                            </Form.Item>
                        }
                        {adminViewRole &&
                            <Form.Item>
                                <Button
                                    type="primary"
                                    onClick={openCheckedCleanerModal}
                                >
                                    <CloseCircleFilled style={{ position: 'relative', bottom: '2px' }} />
                                </Button>
                            </Form.Item>
                        }
                        <Form.Item
                            name="IsNotChecked"
                            valuePropName="checked"
                        >
                            <Checkbox
                                onChange={handleIsNotChecked}
                            >
                                {t("IsNotChecked")}
                            </Checkbox>
                        </Form.Item>
                        {(OrgTypeID === 9 || OrgTypeID === 15) && (
                            <Form.Item
                                name="IsNotCheckedHemis"
                                valuePropName="checked"
                            >
                                <Checkbox
                                    onChange={handleIsNotCheckedHemis}
                                >
                                    {t("IsNotCheckedHemis")}
                                </Checkbox>
                            </Form.Item>
                        )}
                    </div>
                </Form>
            </Fade>
            <Fade>
                <TableEmployees tableData={tableData} total={total} match={match} OrgTypeID={OrgTypeID} />
            </Fade>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={phoneNumCleanerModalVisible}
                timeout={300}
            >
                <PhoneNumCleanerModal
                    visible={phoneNumCleanerModalVisible}
                    onCancel={closePhoneNumCleanerModal}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={checkedCleanerModalVisible}
                timeout={300}
            >
                <CheckedCleanerModal
                    visible={checkedCleanerModalVisible}
                    onCancel={closeCheckedCleanerModal}
                />
            </CSSTransition>
        </Card>
    )
}

export default Employees;