import { Button, Col, Form, Input, Modal, Row, Select, Space, Spin, Table, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Notification } from '../../../../../../../helpers/notifications';
import HelperServices from '../../../../../../../services/Helper/helper.services';
import SalaryTransactionTable from '../../../TPSalaryTransaction/components/SalaryTransactionTable';
import TPSalaryTransactionServices from "./../../../../../../../services/References/Template/TPSalaryTransaction/TPSalaryTransaction.services";

const { Option } = Select;

const TPSalaryTransactionModal = (props) => {
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
            title: t("OrgType"),
            dataIndex: 'OrgType',
            key: 'OrgType',
            width: 100,
            sorter: (a, b) => a.OrgType.localeCompare(b.OrgType),
        },
        {
            title: t("TypeName"),
            dataIndex: 'TypeName',
            key: 'TypeName',
            width: 100,
            sorter: (a, b) => a.TypeName.localeCompare(b.TypeName),
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
            TPSalaryTransactionServices.GetList(),
        ]);
        setTableData(tableData.data);
        setFilteredTableData(tableData.data.rows);
        setTableLoading(false);
    };

    useEffect(() => {
        setTableLoading(true);
        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params]);

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
                width={992}
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
                        placeholder="Search..."
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
                    onSelect={onSelect}
                    refresh={() => {
                        setTableLoading(true);
                        fetchData().catch(err => {
                            Notification('error', err);
                            setTableLoading(false);
                        });
                    }}
                    onCancel={() => {
                        setNewSalaryTransactionModal(false);
                    }}
                />
            </CSSTransition>
        </div>
    )
}

export default TPSalaryTransactionModal;

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
    // console.log(props);
    const { t } = useTranslation();
    const history = useHistory();
    const [addForm] = Form.useForm();

    const [tableLoading, setTableLoading] = useState(true);
    const [selectedData, setSelectedData] = useState([]);
    const [calcType, setCalcType] = useState([]);
    const [orgTypeList, setOrgTypeList] = useState([]);
    const [Tables, setTables] = useState([]);
    // const [filteredTableData, setFilteredTableData] = useState([]);
    // const [rowData, setRowData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [selectedData, calcType, orgTypeList] = await Promise.all([
                TPSalaryTransactionServices.getById(props.params.ID),
                HelperServices.GetAllCalculationType(),
                HelperServices.GetAllOrganizationType(),
            ]);
            // console.log(selectedData.data);
            setSelectedData(selectedData.data);
            selectedData.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(selectedData.data.Tables);
            setCalcType(calcType.data);
            setOrgTypeList(orgTypeList.data);
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
        TPSalaryTransactionServices.postData({ ...selectedData, ID: props.params.ID, ...values })
            .then((res) => {
                if (res.status === 200) {
                    setTableLoading(false);
                    props.onCancel();
                    props.refresh();
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setTableLoading(false);
            });
    };

    const editTPSalaryTransactionTableData = (data) => {
        setTables(data);
    };

    return (
        <Modal
            width={900}
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
                        <Col md={8}>
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
                        <Col md={8}>
                            <Form.Item
                                label={t("OrganizationType")}
                                name="OrganizationTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("OrganizationTypeID")}
                                    // style={{ width: '100%' }}
                                    showSearch
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
                        </Col>
                        <Col md={8}>
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
                    <Tabs type="card"
                    // onChange={callback}
                    >
                        <TabPane tab={t("Используемый вид расчета")} key="2">
                            <SalaryTransactionTable
                                data={Tables}
                                editSubCalcKindTableData={editTPSalaryTransactionTableData}
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </Spin>
        </Modal>
    )
}