import { Button, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';

import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import SubCalculationKindServices from '../../../../../services/References/Organizational/SubCalculationKind/SubCalculationKind.services';
import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const { Option } = Select;

const TPSubCalculationKind = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const tpSubcalcKindList = useSelector((state) => state.tpSubcalcKindList);

    let tableData = tpSubcalcKindList.listSuccessData?.rows;
    let total = tpSubcalcKindList.listSuccessData?.total;
    let pagination = tpSubcalcKindList?.paginationData;
    let filter = tpSubcalcKindList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter, dispatch]);

    const getList = (values) => {
        dispatch(setListFilter({
            ID: values?.ID,
            TypeID: values?.TypeID,
            Search: values?.Search,
        }));
    };

    // const [filterType, setFilterType] = useState(tpSubcalcKindList.filterType);
    const [loader, setLoader] = useState(true);
    const [orgTypeList, setOrgTypeList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [orgTypeList] = await Promise.all([
                HelperServices.GetAllOrganizationType(),
            ]);
            setOrgTypeList(orgTypeList.data);
        }
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, []);

    // function filterTypeHandler(value) {
    //     setFilterType(value);
    // };

    const onSearch = (Search) => {
        filterForm.validateFields()
            .then(values => {
                // console.log(values);
                // dispatch(setListFilterType({
                //     filterType: filterType,
                // }));
                getList(values);
            });
    };

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    // const handleRefresh = () => {
    //     dispatch(
    //         getListStartAction({
    //             ...pagination,
    //             ...filter,
    //         })
    //     );
    // };

    return (
        <Card title={t("SubCalculationKind")}>
            <Fade>
                <Form
                    className='table-filter-form'
                    form={filterForm}
                    onFinish={onFinish}
                    initialValues={{
                        ID: filter?.ID,
                        TypeID: filter?.TypeID,
                        Search: filter?.Search,
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        <Form.Item name="TypeID">
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("OrgType")}
                                style={{ width: 150, marginBottom: 0 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {orgTypeList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.DisplayName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* <Form.Item name="filterType">
                                <Select
                                    allowClear
                                    style={{ width: 180 }}
                                    placeholder={t("Filter Type")}
                                    onChange={filterTypeHandler}
                                >
                                    <Option value="Search">{t("name")}</Option>
                                    <Option value="Type">{t("type")}</Option>
                                </Select>
                            </Form.Item> */}

                        <Form.Item name="ID">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder={t("id")}
                                onPressEnter={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="Search">
                            <Input.Search
                                placeholder={t("name")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        {/* <Button type="primary" htmlType="submit" onClick={handleRefresh}>
                                <i className="feather icon-refresh-ccw" />
                            </Button> */}

                        {adminViewRole && (
                            <Form.Item>
                                <Button type="primary" disabled={tableData?.length === 0}>
                                    <Link to={`${match.path}/add`}>
                                        {t("add-new")}&nbsp;
                                        <i className="feather icon-plus" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </Form.Item>
                        )}

                    </div>
                </Form>
            </Fade>

            <Fade>
                <TableData tableData={tableData} total={total} match={match} />
            </Fade>
        </Card>
    )
}

export default React.memo(TPSubCalculationKind);