import { Button, Form, Input, InputNumber } from 'antd';
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { CSSTransition } from 'react-transition-group';

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import UpdateTaxReliefModal from './UpdateTaxReliefModal';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const TaxRelief = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const reduxList = useSelector((state) => state.taxReliefList);

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
    }, [pagination, filter, dispatch]);

    const getList = (values) => {
        dispatch(setListFilter({
            ID: values?.ID,
            OrgTypeID: values?.OrgTypeID,
            Search: values?.Search,
        }));
    };

    const [updateModal, setUpdateModal] = React.useState(false);
    const [rowItem, setRowItem] = React.useState(null);



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
        <Card title={t("TaxRelief")}>
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
                <TableData
                    tableData={tableData} total={total} match={match}
                    openUpdateModal={openUpdateModal}
                    reduxList={reduxList}
                />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={updateModal}
                timeout={300}
            >
                <UpdateTaxReliefModal
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

export default React.memo(TaxRelief);