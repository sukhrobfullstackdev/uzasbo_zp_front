import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Form, Input, Radio, Select } from "antd";
import { Fade } from "react-awesome-reveal";
import Card from "../../../components/MainCard";
import { useDispatch, useSelector } from 'react-redux';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/personnelDepartmentSlice';
import TablePersonnelDepartment from './components/TablePersonnelDepartment';
// import PersonnelDepartmentServices from '../../../../services/Report/PersonnelDepartment/PersonnelDepartment.services';
// import SubDepartmentServices from '../../../../services/References/Organizational/SubDepartment/SubDepartment.services';
import HelperServices from '../../../../services/Helper/helper.services';
import { Notification } from '../../../../helpers/notifications';
import PersonnelDepartmentServices from "./../../../../services/Report/PersonnelDepartment/PersonnelDepartment.services";

const { Option } = Select;

const PersonnelDepartment = ({ match, location }) => {
    // console.log(location?.state?.isChecked);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();

    const personnelDepartmentList = useSelector((state) => state.personnelDepartmentList);

    let tableData = personnelDepartmentList.listSuccessData?.rows;
    let total = personnelDepartmentList.listSuccessData?.total;
    let pagination = personnelDepartmentList?.paginationData;
    let filter = personnelDepartmentList?.filterData;

    const [filterType, setFilterType] = useState(personnelDepartmentList.filterType || 'Search');
    //const [filterValue, setFilterValue] = useState(personnelDepartmentList.filterData[`${filterType}`]);
    // const filterValue = personnelDepartmentList.filterData[`${filterType}`];

    const [divisionList, setDivisionList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [orgSettleAccList, setOrgSettleAccList] = useState([]);
    const [enrolmentTypeList, setEnrolmentTypeList] = useState([]);

    const [confirmLoading, setConfirmLoading] = React.useState(false);


    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    useEffect(() => {
        async function fetchData() {
            try {
                const divisionLs = await HelperServices.GetDivisionList();
                const orgSettleAccList = await HelperServices.getOrganizationsSettlementAccountList();
                const enrolmentTypeList = await HelperServices.GetEnrolmentTypeList();
                setDivisionList(divisionLs.data);
                setOrgSettleAccList(orgSettleAccList.data);
                setEnrolmentTypeList(enrolmentTypeList.data);

            } catch (err) {
                Notification('error', err);
            }
        }
        fetchData();
    }, []);

    const getList = (values) => {
        dispatch(setListFilter({
            showWorking: values?.showWorking,
            showWithoutPhoneNumber: values?.showWithoutPhoneNumber,
            isChecked: values?.isChecked,
            showall: values?.showall,
            DivisionID: values?.DivisionID,
            DepartmentID: values?.DepartmentID,
            EnrolmentTypeID: values?.EnrolmentTypeID,
            OrganizationsSettlementAccountID: values?.OrganizationsSettlementAccountID,
            [values?.filterType]: values?.Search,
        }));
    };

    function filterTypeHandler(value) {
        setFilterType(value);
    };

    const divisionHandler = async (value) => {
        const departmentLs = await HelperServices.getDepartmentList(value);
        setDepartmentList(departmentLs.data);
    };


    const showWorkingHandler = () => {

        setTimeout(() => {
            filterForm.validateFields()
                .then(values => {
                    getList(values);
                })
        }, 0)
    };

    function showWithoutPhoneNumberHandler() {
        setTimeout(() => {
            filterForm.validateFields()
                .then(values => {
                    getList(values);
                })
        }, 0)
    };

    function isCheckedHandler() {
        setTimeout(() => {
            filterForm.validateFields()
                .then(values => {
                    getList(values);
                })
        }, 0)
        filterForm.setFieldsValue({
            showall: null
        })
    };
    function isShowallHandler() {
        setTimeout(() => {
            filterForm.validateFields()
                .then(values => {
                    getList(values);
                })
        }, 0)
        filterForm.setFieldsValue({
            isChecked: null
        })
    };

    const onSearch = (search) => {
        filterForm.validateFields()
            .then(values => {
                dispatch(setListFilterType({
                    filterType: filterType,
                }));
                getList(values);
            })
    };

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    const handlePrint = () => {
        setConfirmLoading(true);
        PersonnelDepartmentServices.printList({
            ...pagination,
            ...filter,
        })
            .then((res) => {
                if (res.status === 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Personnel.xlsx");
                    document.body.appendChild(link);
                    link.click();
          
                    setConfirmLoading(false);
                  }
            }).catch((err) => {
                Notification('error', err);
                setConfirmLoading(false);
            })
    };

    return (
        <Card title={t("PersonnelDepartment")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        filterType: filterType,
                        // search: filterValue,
                        showWorking: filter.showWorking,
                        showWithoutPhoneNumber: filter.showWithoutPhoneNumber,
                        isChecked: filter.isChecked || '',
                        showall: filter.showall || null,
                    }}
                >
                    <div className="main-table-filter-elements">
                        <Form.Item
                            name="showWorking"
                            valuePropName="checked"
                        >
                            <Checkbox onChange={showWorkingHandler}>
                                {t("Не показать уволь. сотр.")}
                            </Checkbox>
                        </Form.Item>
                        <Form.Item
                            name="showWithoutPhoneNumber"
                            valuePropName="checked"
                        >
                            <Checkbox onChange={showWithoutPhoneNumberHandler}>
                                {t("Сотрудники без тел. номера")}
                            </Checkbox>
                        </Form.Item>
                    </div>
                    <div className="main-table-filter-elements">
                        <Form.Item
                            name="showall"  >
                            <Radio.Group onChange={isShowallHandler}     >
                                <Radio value={true}>{t("Show all")}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="isChecked"  >
                            <Radio.Group onChange={isCheckedHandler}>
                                <Radio value={'true'}>{t("Show checked")}</Radio>
                                <Radio value={'false'}>{t("Show not checked")}</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div className="main-table-filter-elements">
                        <Form.Item
                            name="filterType"
                        >
                            <Select
                                allowClear
                                style={{ width: 180 }}
                                placeholder={t("Filter Type")}
                                onChange={filterTypeHandler}
                            >
                                <Option value="PersonnelNumber">{t('personnelNumber')}</Option>
                                <Option value="Search">{t('FullName')}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="Search">
                            <Input.Search
                                enterButton
                                placeholder={t("search")}
                                onSearch={onSearch}
                            />
                        </Form.Item>
                        <Form.Item
                            name="DivisionID"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("Division")}
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                onChange={divisionHandler}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {divisionList?.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="DepartmentID"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("Department")}
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {departmentList?.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="OrganizationsSettlementAccountID"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("personalAccount")}
                                style={{ width: 230 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {orgSettleAccList?.map(item => <Option key={item.ID}
                                    value={item.ID}>{item.Code}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="EnrolmentTypeID"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("EnrolmentType")}
                                style={{ width: 230 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {enrolmentTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                            </Select>
                        </Form.Item>

                        <Button type="primary" htmlType="submit" className="main-table-filter-element">
                            <i className="feather icon-refresh-ccw" />
                        </Button>
                        <Button type="primary" loading={confirmLoading} onClick={handlePrint} className="main-table-filter-element">
                            <i className="feather icon-printer" />
                        </Button>
                    </div>
                </Form>
            </Fade >

            <Fade>
                <TablePersonnelDepartment
                    tableData={tableData}
                    total={total} match={match}
                />
            </Fade>
        </Card>
    );
};

export default React.memo(PersonnelDepartment);