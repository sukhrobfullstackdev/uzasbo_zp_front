import { Button, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import SubCalculationKindServices from '../../../../../services/References/Organizational/SubCalculationKind/SubCalculationKind.services';
import Card from "../../../../components/MainCard";
import GetFromTPSubCalcKindModal from './components/Modals/GetFromTPSubCalcKindModal';
import TableData from './components/TableData';
import { getListStartAction, setListFilter } from './_redux/getListSlice';

const { Option } = Select;

const SubCalculationKind = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    const TotalRequestReceivingCash = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');

    const subalcKindList = useSelector((state) => state.subalcKindList);

    let tableData = subalcKindList.listSuccessData?.rows;
    let total = subalcKindList.listSuccessData?.total;
    let pagination = subalcKindList?.paginationData;
    let filter = subalcKindList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter, dispatch]);

    const getList = (values) => {
        if (values.OrgID?.toString().length === 9) {
            SubCalculationKindServices.getOrganizationIDbyINN(values.OrgID)
                .then(res => {
                    // console.log(res.data[0].ID);
                    dispatch(setListFilter({
                        OrgID: res.data[0].ID,
                        ID: values?.ID,
                        Search: values?.Search,
                        State: values?.State,
                        TaxItem: values?.TaxItem,
                        CalculationTypeID: values?.CalculationTypeID,
                    }));
                    filterForm.resetFields();

                }).catch(err => {
                    Notification('error', err);
                })
        } else {
            dispatch(setListFilter({
                OrgID: values?.OrgID,
                ID: values?.ID,
                Search: values?.Search,
                State: values?.State,
                TaxItem: values?.TaxItem,
                CalculationTypeID: values?.CalculationTypeID,
            }));
        }
    };

    const [loader, setLoader] = useState(true);
    const [taxList, setTaxList] = useState([]);
    const [calcTypeList, setCalcTypeList] = useState([]);
    const [status, setStatus] = useState([]);

    const [getFromTPSubCalcKindModal, setGetFromTPSubCalcKindModal] = useState(false);
    const [getFromTPSubCalcKindParams, setGetFromTPSubCalcKindParams] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [taxLs, calcTypeList, statusLs] = await Promise.all([
                HelperServices.GetTaxItemList(),
                HelperServices.GetAllCalculationType(),
                HelperServices.getStateList(),
            ]);
            setTaxList(taxLs.data);
            setCalcTypeList(calcTypeList.data);
            setStatus(statusLs.data);
        }
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, []);

    const onSearch = (Search) => {
        filterForm.validateFields()
            .then(values => {
                getList(values);
            });
    };

    const onFinish = (values) => {
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

    const refreshSubHandler = () => {
        SubCalculationKindServices.refreshSub()
            .then(res => {
                if (res.status === 200) {
                    Notification('success', t('edited'));
                    // const { pagination, filterData } = this.state;
                    // this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                Notification('error', err);
                //   this.setState({ loading: false });
            });
    };

    const openGetFromTPSubCalcKindModal = (params) => {
        setGetFromTPSubCalcKindModal(true);
        setGetFromTPSubCalcKindParams(params);
    };

    return (
        <Card title={t("SubCalculationKind")}>
            <Fade>
                <Form
                    className='table-filter-form'
                    form={filterForm}
                    onFinish={onFinish}
                    initialValues={{
                        OrgID: filter?.OrgID || null,
                        ID: filter?.ID,
                        Search: filter?.Search,
                        State: filter?.State,
                        TaxItem: filter?.TaxItem,
                        CalculationTypeID: filter?.CalculationTypeID,
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        {adminViewRole &&
                            <Form.Item
                                // label={t("orgId")}
                                name="OrgID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("required"),
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '7rem' }}
                                    placeholder={t("orgId")}
                                    onPressEnter={onSearch}
                                />
                            </Form.Item>
                        }

                        <Form.Item
                            name="ID"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder={t('ID')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="CalculationTypeID"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("type")}
                                style={{ width: 150, marginBottom: 0 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {calcTypeList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.DisplayName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="Search">
                            <Input.Search
                                placeholder={t("name")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        <Form.Item name="TaxItem">
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("TaxItem")}
                                style={{ width: 150, marginBottom: 0 }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {taxList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.ItemShortName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="State">
                            <Select
                                allowClear
                                style={{ width: 120, marginBottom: 0 }}
                                placeholder={t("State")}
                            >
                                {status.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* <Button type="primary" htmlType="submit" onClick={handleRefresh}>
                                <i className="feather icon-refresh-ccw" />
                            </Button> */}

                        {adminViewRole &&
                            // <Tooltip title={t('refreshSub')}>
                            <Form.Item>
                                <Button type="primary" onClick={refreshSubHandler}>
                                    {t('refreshSub')}
                                    {/* <i className="fas fa-redo" /> */}
                                </Button>
                            </Form.Item>
                            // </Tooltip>
                        }
                        <Form.Item>
                            <Button
                                type="primary"
                                onClick={() => openGetFromTPSubCalcKindModal({
                                    OrganizationID: filter?.OrgID,
                                })}
                            >
                                {t('getFromTemplate')}
                                {/* <i className="fas fa-redo" /> */}
                            </Button>
                        </Form.Item>

                        {/* {TotalRequestReceivingCash && (
                            <Form.Item>
                                <Button
                                    type="primary"
                                    // disabled={tableData?.length === 0}
                                >
                                    <Link to={`${match.path}/add`}>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </Form.Item>
                        )} */}

                    </div>
                </Form>

            </Fade>

            <Fade>
                <TableData tableData={tableData} total={total} match={match} />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={getFromTPSubCalcKindModal}
                timeout={300}
            >
                <GetFromTPSubCalcKindModal
                    visible={getFromTPSubCalcKindModal}
                    params={getFromTPSubCalcKindParams}
                    handleRefresh={handleRefresh}
                    // onSelect={onSelectParent}
                    onCancel={() => {
                        setGetFromTPSubCalcKindModal(false);
                    }}
                />
            </CSSTransition>
        </Card>
    )
}

export default React.memo(SubCalculationKind);