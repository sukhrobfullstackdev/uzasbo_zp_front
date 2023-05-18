import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, DatePicker, Form, InputNumber, Modal, Popconfirm, Row, Space, Table } from 'antd'
import { useTranslation } from 'react-i18next';
import moment from "moment";

import { Notification } from '../../../../../../helpers/notifications';
import PositionQualificationAmountServices from '../../../../../../services/References/Global/PositionQualificationAmount/PositionQualificationAmount.services';
import PosQualAmountHeader from './PosQualAmountHeader';
import HelperServices from '../../../../../../services/Helper/helper.services';

const EditableContext = React.createContext(null);

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const EditableRow = ({ index, ...props }) => {
    // console.log(props);
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    // console.log(dataIndex);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber style={{ width: '100%' }} ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };
    if (editable && dataIndex === 'NormativeAct') {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    return <td {...restProps}>{childNode}</td>;
};


const UpdatePosQualAmountModal = (props) => {
    // console.log(props.data);
    const { ID, Date } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loading, setLoading] = React.useState(true);
    const [tableData, setTableData] = React.useState([]);
    const [qualificationList, setQualificationList] = useState([]);
    const [dateString, setDateString] = React.useState(Date);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80,
        },
        {
            title: t("PositionQualificationName"),
            dataIndex: "PositionQualificationName",
            key: "PositionQualificationName",
            sorter: true,
            width: 200,
        },
        {
            title: t("Amount"),
            dataIndex: "Amount",
            key: "Amount",
            sorter: true,
            width: 200,
            editable: true,
        },
        {
            title: '',
            dataIndex: "",
            key: "",
            sorter: false,
            width: 50,
            render: (_, record) =>
                <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Popconfirm title={t("delete?")} onConfirm={() => handleDelete(record.key)}>
                        <i className="feather icon-trash-2 action-icon" />
                    </Popconfirm>
                </Space>
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const [tableData, qualificationList] = await Promise.all([
                PositionQualificationAmountServices.getById(props.data.ID),
                HelperServices.GetPositionQualificationList(),
            ]);
            tableData.data.Tables.map(row => {
                row.key = Math.random();
                return row;
            })
            setTableData(tableData.data.Tables);
            setQualificationList(qualificationList.data);
            setLoading(false);
        };
        fetchData().catch(err => {
            Notification('error', err);
            setLoading(false);
        });
    }, [props.data, mainForm]);

    const handleDelete = (key) => {
        setTableData(tableData.filter((item) => item.key !== key));
    };

    const addTableDataHandler = (data) => {
        console.log([data, ...tableData]);
        setTableData([data, ...tableData]);
    };

    const handleSave = (row) => {
        const newData = [...tableData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setTableData(newData);
        // editPerHistoryTableData(newData);
    };

    const newColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });

    const onChangeDate = (date, dateString) => {
        setDateString(dateString);
    }

    const onMainFormFinish = (values) => {
        console.log(values.Date);
        console.log({ ID, Date: dateString, Tables: tableData });
        PositionQualificationAmountServices.postData({ ID, Date: dateString, Tables: tableData })
            .then((res) => {
                // console.log(res.data);
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    return (
        <Modal
            width={768}
            title={t("PositionQualificationAmount")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    type="primary"
                    form='mainForm'
                    htmlType="submit"
                // onClick={selectRow}
                >
                    {t("save")}
                </Button>,
            ]}
        >
            <Form
                {...layout}
                form={mainForm}
                id="mainForm"
                onFinish={onMainFormFinish}
                initialValues={{
                    Date: Date ? moment(Date, "DD.MM.YYYY") : moment(),
                }}
            >
                <Row gutter={[15, 0]}>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("date")}
                            name="Date"
                            rules={[
                                {
                                    required: true,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD.MM.YYYY" className='datepicker'
                                onChange={onChangeDate}
                                placeholder={t('QuantityOfMinimalSalaries')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Table
                    bordered
                    size="middle"
                    columns={newColumns}
                    dataSource={tableData}
                    loading={loading}
                    rowKey={(record) => record.key}
                    rowClassName={() => 'editable-row'}
                    className="main-table"
                    showSorterTooltip={false}
                    scroll={{
                        x: "max-content",
                        y: '50vh'
                    }}
                    components={{
                        header: {
                            row: () => <PosQualAmountHeader
                                addData={addTableDataHandler}
                                qualificationList={qualificationList}
                            />
                        },
                        body: {
                            row: EditableRow,
                            cell: EditableCell,
                        },
                    }}
                    pagination={false}
                />
            </Form>
        </Modal>
    )
}

export default UpdatePosQualAmountModal;