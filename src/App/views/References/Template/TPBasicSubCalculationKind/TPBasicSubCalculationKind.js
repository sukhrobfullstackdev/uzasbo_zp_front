import { Button, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import UpdateTPBasicSubCalculationKindModal from './UpdateTPBasicSubCalculationKindModal';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const { Option } = Select;

const TPBasicSubCalculationKind = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const tpBasicSubcalcKindList = useSelector((state) => state.tpBasicSubcalcKindList);

    let tableData = tpBasicSubcalcKindList.listSuccessData?.rows;
    let total = tpBasicSubcalcKindList.listSuccessData?.total;
    let pagination = tpBasicSubcalcKindList?.paginationData;
    let filter = tpBasicSubcalcKindList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter]);

    const getList = (values) => {
        dispatch(setListFilter({
            ID: values?.ID,
            OrgTypeID: values?.OrgTypeID,
            Search: values?.Search,
        }));
    };

    // const [filterType, setFilterType] = useState(tpSubcalcKindList.filterType);
    const [loader, setLoader] = useState(true);
    const [orgTypeList, setOrgTypeList] = useState([]);
    const [updateModal, setUpdateModal] = React.useState(false);
    const [rowItem, setRowItem] = React.useState(null);

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

    const handleRefresh = () => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    };

    const openUpdateModal = (id) => {
        setUpdateModal(true);
        setRowItem(id);
    };

    return (
        <Card title={t("TPBasicSubCalculationKind")}>
            <Fade>
                <div className="table-top">
                    <Form
                        className='table-filter-form'
                        form={filterForm}
                        onFinish={onFinish}
                        initialValues={{
                            ID: filter?.ID,
                            OrgTypeID: filter?.OrgTypeID,
                            Search: filter?.Search,
                        }}
                    >
                        <div className="form-elements">
                            <Form.Item name="OrgTypeID">
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("OrgType")}
                                    style={{ width: 150 }}
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
                                <Button type="primary" onClick={() => openUpdateModal({ ID: 0 })} >
                                    <span>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </span>
                                </Button>
                            )}

                        </div>
                    </Form>
                </div>
            </Fade>

            <Fade>
                <TableData
                    tableData={tableData} total={total} match={match}
                    reduxList={tpBasicSubcalcKindList}
                    openUpdateModal={openUpdateModal}
                />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={updateModal}
                timeout={300}
            >
                <UpdateTPBasicSubCalculationKindModal
                    visible={updateModal}
                    data={rowItem}
                    fetch={handleRefresh}
                    onCancel={() => {
                        setUpdateModal(false);
                    }}
                />
            </CSSTransition>
        </Card>
    )
}

export default React.memo(TPBasicSubCalculationKind);