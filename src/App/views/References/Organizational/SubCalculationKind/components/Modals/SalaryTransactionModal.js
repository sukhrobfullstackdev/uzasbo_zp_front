import { Button, Col, Form, Input, Modal, Row, Select, Space, Spin, Table, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Notification } from '../../../../../../../helpers/notifications';
import HelperServices from '../../../../../../../services/Helper/helper.services';
import salaryTransaction from '../../../../../../../services/References/Organizational/SalaryTransaction/SalaryTransaction.services';

const { Option } = Select;

const SalaryTransactionModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();
    const history = useHistory();

    const columns = [
        {
            title: t("id"),
            dataIndex: 'ID',
            key: "ID",
            width: 100,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t("Name"),
            dataIndex: 'Name',
            key: 'Name',
            width: 250,
            sorter: (a, b) => a.Name.localeCompare(b.Name),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("CalculationType"),
            dataIndex: 'CalculationType',
            key: 'CalculationType',
            width: 100,
            sorter: (a, b) => a.CalculationType.localeCompare(b.CalculationType),
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: "right",
            width: 60,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Edit")}>
                            <span onClick={() => addNewSalaryTransactionModal({ ID: record.ID })}>
                                <i className='feather icon-edit action-icon' aria-hidden="true" />
                            </span>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [rowData, setRowData] = useState(null);

    const [newSalaryTransactionModal, setNewSalaryTransactionModal] = useState(false);
    const [salaryTransactionParams, setSalaryTransactionParams] = useState(null);

    const fetchData = async () => {
        const [tableData] = await Promise.all([
            salaryTransaction.GetList({ OrgID: props.params.OrganizationID }),
        ]);
        setTableData(tableData.data);
        setFilteredTableData(tableData.data.rows);
        setTableLoading(false);
    };

    useEffect(() => {

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, []);

    const onSearch = (event) => {
        const filteredTable = tableData.rows.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setFilteredTableData(filteredTable);
        console.log(filteredTable);
    };

    const selectRow = () => {
        props.onSelect(rowData);
        if (rowData !== null) {
            props.onCancel();
        }
    };

    const setRowClassName = (record) => {
        return record.ID === rowData?.ID ? 'table-row clicked-row' : 'table-row';
    };

    const addNewSalaryTransactionModal = (params) => {
        setNewSalaryTransactionModal(true);
        setSalaryTransactionParams(params);
    };

    const onSelect = (data) => {
        console.log(data);
    };

    return (
        <div>
            <Modal
                width={768}
                title={t("SalaryTransaction")}
                visible={props.visible}
                onCancel={props.onCancel}
                footer={[
                    <Button key="back" onClick={props.onCancel}>
                        {t("close")}
                    </Button>,
                    <Button
                        disabled={!rowData}
                        type="primary"
                        onClick={selectRow}
                    >
                        {t("select")}
                    </Button>,
                ]}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Input
                        placeholder={t("search")}
                        onChange={onSearch}
                    />
                    <Button
                        type="primary"
                        onClick={() => addNewSalaryTransactionModal({ ID: 0 })}
                    >
                        {t("add-new")}&nbsp;
                        <i className="feather icon-plus" aria-hidden="true" />
                    </Button>
                </div>
                <Table
                    bordered
                    size="middle"
                    rowClassName={setRowClassName}
                    className="main-table mt-4"
                    columns={columns}
                    dataSource={filteredTableData}
                    loading={tableLoading}
                    rowKey={record => record.ID}
                    showSorterTooltip={false}
                    pagination={false}
                    scroll={{
                        x: "max-content",
                        y: "50vh",
                    }}
                    onRow={(record) => {
                        return {
                            onDoubleClick: () => {
                                props.onSelect({
                                    ID: record.ID, NameValue: record.Name,
                                    id: props.params.ID, Name: props.params.Name,
                                });
                                props.onCancel();
                            },
                            onClick: () => {
                                setRowData({
                                    ID: record.ID, NameValue: record.Name,
                                    id: props.params.ID, Name: props.params.Name
                                });
                            },
                        };
                    }}
                />
            </Modal>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={newSalaryTransactionModal}
                timeout={300}
            >
                <NewSalaryTransactionModal
                    visible={newSalaryTransactionModal}
                    params={salaryTransactionParams}
                    OrgID={props.params.OrganizationID}
                    fetchData={fetchData}
                    onSelect={onSelect}
                    onCancel={() => {
                        setNewSalaryTransactionModal(false);
                    }}
                />
            </CSSTransition>
        </div>
    )
}

export default SalaryTransactionModal;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { TabPane } = Tabs;

const NewSalaryTransactionModal = (props) => {
    console.log(props);
    const { t } = useTranslation();
    const history = useHistory();
    const [addForm] = Form.useForm();

    const [tableLoading, setTableLoading] = useState(true);
    const [selectedData, setSelectedData] = useState([]);
    const [calcType, setCalcType] = useState([]);
    // const [filteredTableData, setFilteredTableData] = useState([]);
    // const [rowData, setRowData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [selectedData, calcType] = await Promise.all([
                salaryTransaction.getById(props.params.ID),
                HelperServices.GetAllCalculationType(),
            ]);
            console.log(selectedData.data);
            setSelectedData(selectedData.data);
            setCalcType(calcType.data);
            setTableLoading(false);

            if (props.params.ID !== 0) {
                addForm.setFieldsValue({
                    ...selectedData.data,
                });
            }
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params.ID, addForm]);

    const onFinish = (values) => {
        // console.log({ ...selectedData, ID: props.params.ID, ...values });
        salaryTransaction.UpdateFromAdmin({ 
            ...selectedData, ID: props.params.ID, OrganizationID: props.OrgID, ...values
         })
            .then((res) => {
                if (res.status === 200) {
                    setTableLoading(false);
                    props.onCancel();
                    props.fetchData().catch(err => {
                        Notification('error', err);
                        setTableLoading(false);
                    });
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setTableLoading(false);
            });
    };

    return (
        <Modal
            width={768}
            style={{ marginTop: '80px' }}
            title={t("SalaryTransaction")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    htmlType="submit"
                    form="addForm"
                    type="primary"
                // onClick={selectRow}
                >
                    {t("add")}
                </Button>,
            ]}
        >
            <Spin spinning={tableLoading} size='large'>
                <Form
                    {...layout}
                    form={addForm}
                    id="addForm"
                    onFinish={onFinish}
                >
                    <Row gutter={[15, 0]}>
                        <Col xl={12} md={12}>
                            <Form.Item
                                label={t("Name")}
                                name="Name"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    placeholder={t("Name")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={12} md={12}>
                            <Form.Item
                                label={t("CalculationTypeName")}
                                name="CalculationTypeID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {calcType.map((calcType) => (
                                        <Option key={calcType.ID} value={calcType.ID}>
                                            {calcType.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Tabs type="card"
                    // onChange={callback}
                    >
                        <TabPane tab={t("Используемый вид расчета")} key="2">
                            <SalaryTransactionTable
                                data={Tables}
                                editSubCalcKindTableData={editTPSalaryTransactionTableData}
                            />
                        </TabPane>
                    </Tabs> */}
                </Form>
            </Spin>
        </Modal>
    )
}