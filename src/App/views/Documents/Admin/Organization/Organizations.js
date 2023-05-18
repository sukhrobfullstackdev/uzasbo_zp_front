import { Button, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";

import Card from "../../../../components/MainCard";
import TableOrganizations from './components/TableOrganizations';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/organizationsSlice';
import OrganizationServices from "./../../../../../services/Organization/organization.services";
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from "./../../../../../services/Helper/helper.services";

const { Option } = Select;

const Organizations = ({ match }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();

    const organizationList = useSelector((state) => state.organizationList);

    let tableData = organizationList.listSuccessData?.rows;
    let total = organizationList.listSuccessData?.total;
    let pagination = organizationList?.paginationData;
    let filter = organizationList?.filterData;

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
            OblastID: values?.OblastID,
            ID: values?.ID,
            INN: values?.INN,
            Search: values?.Search,
        }));
    };

    const [syncLoading, setSyncLoading] = useState(false);
    const [regionList, setRegionList] = useState([])
    // const [filterType, setFilterType] = useState(organizationList.filterType);
    // const [filterValue, setFilterValue] = useState(organizationList.filterData[`${filterType}`]);

    useEffect(() => {
        const fetchData = async () => {
            const regionList = await HelperServices.getRegionList()
            setRegionList(regionList.data)
        }

        fetchData().catch(err => {
            Notification('error', err)
        })
    }, [])

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                getList(values);
            });
    };

    const onFinish = (values) => {
        // dispatch(setListFilterType({
        //     filterType: values?.filterType,
        // }));
        getList(values);
    };

    function handleClearParams() {
        // setFilterType(null);
        // setFilterValue('');
        // dispatch(setListFilterType({
        //     filterType: null,
        // }));
        dispatch(setListFilter({}));
    };

    const handleSyncOrganizations = () => {
        setSyncLoading(true);
        OrganizationServices.syncOrganizations()
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('edited'));
                    setSyncLoading(false);
                }
            })
            .catch((err) => {
                setSyncLoading(false);
                Notification('error', err);
            });
    };

    return (
        <Card title={t("Organization")}>
            <Fade>
                <Form
                    className='table-filter-form'
                    form={filterForm}
                    onFinish={onFinish}
                    initialValues={{
                        ID: filter?.ID,
                        INN: filter?.INN,
                        Search: filter?.Search,
                    }}
                >
                    <div className="main-table-filter-elements">

                        {/* <Form.Item name="OrgTypeID">
                                <Select
                                    value={filterType}
                                    allowClear
                                    style={{ width: 180 }}
                                    placeholder={t("Filter Type")}
                                    onChange={filterTypeHandler}
                                >
                                    <Option value="ID">{t('id')}</Option>
                                    <Option value="INN">{t('OrgINN')}</Option>
                                    <Option value="OrgFullName">{t('OrganizationName')}</Option>
                                </Select>
                            </Form.Item> */}

                        <Form.Item name="OblastID">
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("region")}
                                style={{ width: 150 }}
                                optionFilterProp="children"
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

                        <Form.Item name="ID">
                            <InputNumber
                                // style={{ width: '100%' }}
                                placeholder={t("id")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="INN">
                            <InputNumber
                                style={{ width: '8rem' }}
                                placeholder={t("INN")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="Search">
                            <Input.Search
                                placeholder={t("OrganizationName")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        {/* <Button type="primary" onClick={handleClearParams} >
                                <i className="feather icon-refresh-ccw" />
                            </Button> */}
                        <Form.Item>
                            <Button type="primary" icon={<i className="feather icon-refresh-cw" />} loading={syncLoading} onClick={handleSyncOrganizations} >
                                &nbsp;Sync
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Fade>
            <Fade>
                <TableOrganizations tableData={tableData} total={total} match={match} />
            </Fade>
        </Card>
    )
};

export default Organizations;