import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
// import { Link } from 'react-router-dom';

// import { Notification } from '../../../../../helpers/notifications';
import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { CSSTransition } from "react-transition-group";
import UpdateMinimalSalaryModal from "./components/UpdateMinimalSalaryModal";
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const MinimalSalary = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const reduxList = useSelector((state) => state.minSalList);
    const [updateModal, setUpdateMinSalModal] = useState(false)
    const [rowItem, setRowItem] = React.useState(null);

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
            Search: values?.Search,
        }));
    };



    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                getList(values);
            });
    };

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    const openModal = (id) => {
        setUpdateMinSalModal(true);
        setRowItem(id);
    }

    const closeModal = () => {
        setUpdateMinSalModal(false);
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
        <Card title={t("MinimalSalary")}>
            <Fade>
                <div className="table-top">
                    <Form
                        className='table-filter-form'
                        form={filterForm}
                        onFinish={onFinish}
                        initialValues={{
                            ID: filter?.ID,
                            Search: filter?.Search,
                        }}
                    >
                        <div className="form-elements">

                            <Form.Item name="Search">
                                <Input.Search
                                    placeholder={`${t("Search")}`}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>
                            {adminViewRole && (
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        onClick={() => openModal({ID: 0})}
                                    >
                                        {/* {t("add-new")}&nbsp; */}
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Button>
                                </Form.Item>
                            )}

                        </div>
                    </Form>
                </div>
            </Fade>

            <Fade>
                <TableData tableData={tableData} match={match}
                reduxList={reduxList} total={total} 
                onClick={openModal}
                 />
            </Fade>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={updateModal}
                timeout={300}
            >
                <UpdateMinimalSalaryModal
                    visible={updateModal}
                    data={rowItem}
                    fetch={handleRefresh}
                    onCancel={closeModal}
                />
            </CSSTransition>
        </Card>
    )
}

export default React.memo(MinimalSalary);