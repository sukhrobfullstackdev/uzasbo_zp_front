import React, { useEffect } from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListStartAction, setListFilter, } from './_redux/changeDocStatusSlice';
import { Fade } from "react-awesome-reveal";

import Card from "../../../../components/MainCard";
import { Button, Form, Input, InputNumber, Select } from 'antd';
import TableChangeDocStatus from './components/TableChangeDocStatus';
import { CSSTransition } from 'react-transition-group';
import UpdateDocStatusModal from './UpdateDocStatusModal';
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';

const { Option } = Select;

const ChangeDocStatus = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const docStatusList = useSelector((state) => state.changeDocSatus);

    let tableData = docStatusList.listSuccessData?.rows;
    let total = docStatusList.listSuccessData?.total;
    let pagination = docStatusList?.paginationData;
    let filter = docStatusList?.filterData;

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
            ...values
        }));
    };

    const [regionList, setRegionList] = useState([])
    const [currentDistrictList, setCurrentDistrictList] = useState([])
    const [districtID, setDistrictID] = useState(null)
    const [updateModal, setUpdateModal] = useState(false)
    const [rowItem, setRowItem] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            if (regionList.length === 0) {
                const regionList = await HelperServices.getRegionList()
                setRegionList(regionList.data)
            }

            if (districtID) {
                const currentDistrictList = await HelperServices.getDistrictList(districtID);
                setCurrentDistrictList(currentDistrictList.data)
            }
        }

        fetchData().catch(err => {
            Notification('error', err)
        })
    }, [regionList, districtID])

    const handleSelectRegion = (e) => {
        setDistrictID(e)
    }

    const onSearch = (Search) => {
        filterForm.validateFields()
            .then(values => {
                getList(values);
            });
    };

    const onFinish = (values) => {
        getList(values);
    }

    // function handleClearParams() {
    //     getList({});
    // };

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
        <Card title={t("changeDocumentStatus")}>
            <Fade>
                <div className="table-top">
                    <Form
                        form={filterForm}
                        onFinish={onFinish}
                        className='table-filter-form'
                        initialValues={{
                            ...filter,
                        }}
                    >
                        <div className="main-table-filter-elements">
                            <Form.Item name="oblastid">
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("region")}
                                    style={{ width: 150 }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onSelect={handleSelectRegion}
                                >
                                    {regionList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="regionid">
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("district")}
                                    style={{ width: 150 }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {currentDistrictList.map((item) => (
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
                                    maxLength={9}
                                    onPressEnter={onSearch}
                                />
                            </Form.Item>

                            <Form.Item name="orgid">
                                <InputNumber
                                    // style={{ width: '100%' }}
                                    placeholder={t("orgId")}
                                    onPressEnter={onSearch}
                                />
                            </Form.Item>

                            <Form.Item name="documentid">
                                <InputNumber
                                    style={{ width: '8rem' }}
                                    placeholder={t("DocumentID")}
                                    onPressEnter={onSearch}
                                />
                            </Form.Item>

                            <Form.Item
                                // label={t("search")}
                                name="Search">
                                <Input.Search
                                    className="table-search"
                                    placeholder={t("search")}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>

                            {/* <Button
                                type="primary"
                                onClick={handleClearParams}
                            >
                                <i className="feather icon-refresh-ccw" />
                            </Button> */}
                            {adminViewRole && (
                                <Button type="primary" onClick={() => openUpdateModal({ ID: 0 })} >
                                    <span>
                                        <i className="feather icon-plus" aria-hidden="true" />
                                    </span>
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </Fade>
            <Fade>
                <TableChangeDocStatus tableData={tableData} total={total} openUpdateModal={openUpdateModal} />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={updateModal}
                timeout={300}
            >
                <UpdateDocStatusModal
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

export default ChangeDocStatus;