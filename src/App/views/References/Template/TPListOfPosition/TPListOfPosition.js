import { Button, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { CSSTransition } from 'react-transition-group';

import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import UpdateTPListOfPositionModal from './UpdateTPListOfPositionModal';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const { Option } = Select;

const TPListOfPosition = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const tpListOfPosList = useSelector((state) => state.tpListOfPosList);

    let tableData = tpListOfPosList.listSuccessData?.rows;
    let total = tpListOfPosList.listSuccessData?.total;
    let pagination = tpListOfPosList?.paginationData;
    let filter = tpListOfPosList?.filterData;

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

    const [filterType, setFilterType] = useState(tpListOfPosList.filterType);
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

    function filterTypeHandler(value) {
        setFilterType(value);
    };

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
        <Card title={t("TPListOfPosition")}>
            <Fade>
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
                    <div className="main-table-filter-wrapper">
                        <Form.Item name="OrgTypeID">
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
                                    <Option value="ID">{t("id")}</Option>
                                    <Option value="Search">{t("name")}</Option>
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
                                <Button type="primary" onClick={() => openUpdateModal({ ID: 0 })} >
                                    <span>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </span>
                                </Button>
                            </Form.Item>
                        )}

                    </div>
                </Form>
            </Fade >

            <Fade>
                <TableData tableData={tableData} total={total} match={match} openUpdateModal={openUpdateModal} />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={updateModal}
                timeout={300}
            >
                <UpdateTPListOfPositionModal
                    visible={updateModal}
                    data={rowItem}
                    fetch={handleRefresh}
                    onCancel={() => {
                        setUpdateModal(false);
                    }}
                />
            </CSSTransition>
        </Card >
    )
}

export default React.memo(TPListOfPosition);