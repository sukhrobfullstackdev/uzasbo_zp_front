import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Form, Button, Select, Input } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import MainCard from "../../../../components/MainCard";
import { CSSTransition } from "react-transition-group";
import UpdatePosQualAmountModal from "./components/UpdatePosQualAmountModal";


const PositionQualificationAmount = ({ match }) => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const dispatch = useDispatch();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    const [updateModal, setUpdateModal] = useState(false);
    const [rowItem, setRowItem] = React.useState(null);

    const tableList = useSelector((state) => state.PosQualcAmountList);

    let tableData = tableList.listSuccessData?.rows;
    let total = tableList.listSuccessData?.total;
    let pagination = tableList?.paginationData;
    let filter = tableList?.filterData;


    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const onFinish = (values) => {
        dispatch(setListFilter({
            Search: values?.Search
        }));
    };

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                console.log(values);
                onFinish(values);
            })
    };

    const openModal = (id) => {
        setUpdateModal(true);
        setRowItem(id);
    }

    const closeModal = () => {
        setUpdateModal(false);
    }

    const handleRefresh = () => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    };

    return (
        <MainCard title={t("PositionQualificationAmount")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                       ID: filter?.ID,
                       Search: filter?.Search,
                    }}
                >
                    <div className="main-table-filter-wrapper">

                        <Form.Item
                            name="Search"
                        >
                            <Input.Search
                                placeholder={t("search")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        <Form.Item>
                            {adminViewRole && (
                                <Button
                                    type="primary"
                                    onClick={() => openModal({ID: 0})}
                                >
                                    {t("add-new")}&nbsp;
                                    <i className="fa fa-plus" aria-hidden="true" />
                                </Button>
                            )}
                        </Form.Item>


                    </div>
                </Form>
            </Fade>
            <Fade>
                <GetListTable
                    tableData={tableData} total={total} match={match}
                    tableList={tableList} onClick={openModal}
                />
            </Fade>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={updateModal}
                timeout={300}
            >
                <UpdatePosQualAmountModal
                    visible={updateModal}
                    data={rowItem}
                    fetch={handleRefresh}
                    onCancel={closeModal}
                />
            </CSSTransition>
        </MainCard >
    )
}

export default React.memo(PositionQualificationAmount);