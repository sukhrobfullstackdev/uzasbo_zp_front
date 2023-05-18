import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Form, Space, InputNumber, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

import classes from '../CalculationKind.module.css';
import CalculationTableHeader from './CalculationTableHeader';
import SubCalcKindListModal from './Modals/CalcKindListModal';
import MethodsOfUseModal from './Modals/MethodsOfUseModal';
import IncomOnMinimumRateModal from './Modals/IncomOnMinimumRateModal';

const EditableContext = React.createContext(null);

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

    const [subCalcKindListModal, setSubCalcKindListModal] = useState(false);
    const [calculationKindParams, setCalculationKindParams] = useState([]);
    const [methodsOfUseModal, setMethodsOfUseModal] = useState(false);
    const [methodsOfUseParams, setMethodsOfUseParams] = useState([]);
    const [incomOnMinimumRateModal, setIncomOnMinimumRateModal] = useState(false);
    const [incomOnMinimumRateParams, setIncomOnMinimumRateParams] = useState([]);

    const openSubCalcKindListModal = (params) => {
        setCalculationKindParams(params);
        setSubCalcKindListModal(true);
    };

    const openMethodsOfUseModal = (params) => {
        setMethodsOfUseParams(params);
        setMethodsOfUseModal(true);
    };

    const openIncomOnMinimumRateModal = (params) => {
        setIncomOnMinimumRateParams(params);
        setIncomOnMinimumRateModal(true);
    };

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

    const onSelect = (data) => {
        console.log(data);
        form.setFieldsValue({
            "UsedCalculationKindName": data.NameValue,
            "UsedCalculationKindID": data.ID,
        });
        handleSave({
            ...record,
            "UsedCalculationKindName": data.NameValue,
            "UsedCalculationKindID": data.ID,
        });
        setEditing(!editing);
    };

    const onSelectMethodIncom = (data) => {
        console.log(data);
        form.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID,
        });
        handleSave({
            ...record,
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID,
        });
        setEditing(!editing);
    };

    let childNode = children;
    ;
    if (editable && (dataIndex === 'QuantityOfMinimalSalaries')) {
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
    if (editable && dataIndex === 'MethodsOfUseName') {
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
                <Input
                    ref={inputRef} onPressEnter={save} readOnly className={'addonInput'}
                    onBlur={() => {
                        setTimeout(() => {
                            setEditing(!editing)
                        }, 150);
                    }}
                    addonAfter={
                        <div
                            onClick={() => openMethodsOfUseModal({
                                Name: 'MethodsOfUseName',
                                ID: 'MethodsOfUseID'
                            })}
                        >
                            <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                        </div>
                    }
                />
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
    if (editable && dataIndex === 'UsedCalculationKindName') {
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
                <Input
                    ref={inputRef} onPressEnter={save} readOnly className={'addonInput'}
                    onBlur={() => {
                        setTimeout(() => {
                            setEditing(!editing)
                        }, 150);
                    }}
                    addonAfter={
                        <div
                            onClick={() => openSubCalcKindListModal({
                                Name: 'UsedCalculationKindName',
                                ID: 'UsedCalculationKindID'
                            })}
                        >
                            <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                        </div>
                    }
                />
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
    if (editable && dataIndex === 'IncomOnMinimumRateName') {
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
                <Input
                    ref={inputRef} onPressEnter={save} readOnly className={'addonInput'}
                    onBlur={() => {
                        setTimeout(() => {
                            setEditing(!editing)
                        }, 150);
                    }}
                    addonAfter={
                        <div
                            onClick={() => openIncomOnMinimumRateModal({
                                Name: 'IncomOnMinimumRateName',
                                ID: 'IncomOnMinimumRateID'
                            })}
                        >
                            <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                        </div>
                    }
                />
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

    return <td {...restProps}>
        {childNode}
        <CSSTransition
            mountOnEnter
            unmountOnExit
            in={methodsOfUseModal}
            timeout={300}
        >
            <MethodsOfUseModal
                visible={methodsOfUseModal}
                params={methodsOfUseParams}
                onSelect={onSelectMethodIncom}
                onCancel={() => {
                    setMethodsOfUseModal(false);
                }}
            />
        </CSSTransition>
        <CSSTransition
            mountOnEnter
            unmountOnExit
            in={subCalcKindListModal}
            timeout={300}
        >
            <SubCalcKindListModal
                visible={subCalcKindListModal}
                params={calculationKindParams}
                onSelect={onSelect}
                onCancel={() => {
                    setSubCalcKindListModal(false);
                }}
            />
        </CSSTransition>
        <CSSTransition
            mountOnEnter
            unmountOnExit
            in={incomOnMinimumRateModal}
            timeout={300}
        >
            <IncomOnMinimumRateModal
                visible={incomOnMinimumRateModal}
                params={incomOnMinimumRateParams}
                onSelect={onSelectMethodIncom}
                onCancel={() => {
                    setIncomOnMinimumRateModal(false);
                }}
            />
        </CSSTransition>
    </td>;
};

const CalculationTypeTable = ({ data, editSubCalcKindTableData }) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100,
        },
        {
            title: t("QuantityOfMinimalSalaries"),
            dataIndex: "QuantityOfMinimalSalaries",
            key: "QuantityOfMinimalSalaries",
            width: 200,
            sorter: true,
            editable: true,
        },
        {
            title: t("MethodsOfUse"),
            dataIndex: "MethodsOfUseName",
            key: "MethodsOfUseName",
            width: 250,
            sorter: true,
            editable: true,
        },
        {
            title: t("UsedCalculationKindName"),
            dataIndex: "UsedCalculationKindName",
            key: "UsedCalculationKindName",
            width: 250,
            sorter: true,
            editable: true,
        },
        {
            title: t("IncomOnMinimumRate"),
            dataIndex: "IncomOnMinimumRateName",
            key: "IncomOnMinimumRateName",
            width: 250,
            sorter: true,
            editable: true,
        },
        {
            title: '',
            dataIndex: "",
            key: "",
            sorter: false,
            width: 50,
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
                        <span onClick={() => handleDelete(record.key)}>
                            <i className="feather icon-trash-2 action-icon" />
                        </span>
                    </Space>
                ) : null,
        },
    ];

    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(null);

    useEffect(() => {
        setDataSource(data);
    }, [data])

    const handleDelete = (key) => {
        setDataSource(dataSource.filter((item) => item.key !== key));
        editSubCalcKindTableData(dataSource);
    };

    const addTableDataHandler = (data) => {
        console.log([...dataSource, data]);
        setDataSource([data, ...dataSource]);
        editSubCalcKindTableData([data, ...dataSource]);
        // console.log(calcTypeTables);
    };

    const onChangeCalcFromInSum = (record) => {
        record.CalcFromInSum = !record.CalcFromInSum;
        dataSource.map(row => {
            if (row.key === record.key) {
                row = record;
            }
            return row;
        })
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        editSubCalcKindTableData(newData);
    };

    const components = {
        header: {
            row: () => <CalculationTableHeader
                bankList={[]}
                addData={addTableDataHandler}
            />
        },
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
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
    return (
        <div>
            <Table
                className={classes.editable}
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={newColumns}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={false}
            />
        </div>
    );
}

export default CalculationTypeTable;