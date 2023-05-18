import { Button, Form, Input } from 'antd';
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

// import { Notification } from '../../../../../helpers/notifications';
import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import UpdateStaffPositionAmountModal from "./UpdateStaffPositionAmountModal";
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const StaffPositionAmount = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const reduxList = useSelector((state) => state.staffPositionAmountList);

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

    const [updateModal, setUpdateModal] = React.useState(false);
    const [rowItem, setRowItem] = React.useState(null);

    const onSearch = (Search) => {
        filterForm.validateFields()
            .then(values => {
                console.log(values);
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
        <Card title={t("StaffPositionAmount")}>
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
                                    placeholder={t("Code")}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>

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
                </div>
            </Fade>

            <Fade>
                <TableData
                    tableData={tableData} reduxList={reduxList}
                    total={total} match={match}
                    openUpdateModal={openUpdateModal}
                />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={updateModal}
                timeout={300}
            >
                <UpdateStaffPositionAmountModal
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

export default React.memo(StaffPositionAmount);