import { Button, Input, Modal, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

import { Notification } from '../../../../../../../helpers/notifications';
import CalculationKindServices from "./../../../../../../../services/References/Global/CalculationKind/CalculationKind.services";

const CalcKindListModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: (a, b) => a.ID - b.ID,
            width: 80,

        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 300,
        },
        {
            title: t("CalculationType"),
            dataIndex: "CalculationType",
            key: "CalculationType",
            sorter: true,
            width: 200,
        },
        {
            title: t("CalculationMethod"),
            dataIndex: "CalculationMethod",
            key: "CalculationMethod",
            sorter: true,
            width: 200,
        },
        {
            title: t("Formula"),
            dataIndex: "Formula",
            key: "Formula",
            sorter: true,
            width: 120,
        },
        {
            title: t("NormativeAct"),
            dataIndex: "NormativeAct",
            key: "NormativeAct",
            sorter: true,
            width: 120,
        },
        {
            title: t("InheritPercentage"),
            dataIndex: "InheritPercentage",
            key: "InheritPercentage",
            sorter: true,
            width: 120,
            render: (record) => {
                if (record) {
                    return t("yes");
                } else {
                    return t("no");
                }
            },
        },
        {
            title: t("AllowEditChild"),
            dataIndex: "AllowEditChild",
            key: "AllowEditChild",
            sorter: true,
            width: 120,
            render: (record) => {
                if (record) {
                    return t("yes");
                } else {
                    return t("no");
                }
            },
        },
        {
            title: t("Status"),
            dataIndex: "State",
            key: "State",
            width: 120,
            render: (status) => {
                if (status === "Актив") {
                    return (
                        <Tag color="#87d068" key={status}>
                            {status}
                        </Tag>
                    );
                } else if (status === "Пассив") {
                    return (
                        <Tag color="#f50" key={status}>
                            {status}
                        </Tag>
                    );
                }
            },
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [rowData, setRowData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                CalculationKindServices.getList(),
            ]);
            // console.log(tableData.data);
            setTableData(tableData.data.rows);
            setFilteredTableData(tableData.data.rows);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, []);

    const onSearch = (event) => {
        const filteredTable = tableData.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
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
    }

    return (
        <Modal
            width={1190}
            title={t("SubCalculationKind")}
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
            <Input
                placeholder="Search..."
                onChange={onSearch}
            />
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
                                ID: record.ID, NameValue: record.Name, key: props.params.key,
                                id: props.params.ID, Name: props.params.Name, RecordID: props.params.RecordID
                            });
                            props.onCancel();
                        },
                        onClick: () => {
                            setRowData({
                                ID: record.ID, NameValue: record.Name, key: props.params.key,
                                id: props.params.ID, Name: props.params.Name, RecordID: props.params.RecordID
                            });
                        },
                    };
                }}
            />
        </Modal>
    )
}

export default CalcKindListModal;