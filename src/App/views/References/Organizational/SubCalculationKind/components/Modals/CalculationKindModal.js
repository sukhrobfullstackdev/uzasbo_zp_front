import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import CalculationKindServices from "./../../../../../../../services/References/Global/CalculationKind/CalculationKind.services";

const CalculationKindModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: 'ID',
            key: 'ID',
            width: 100,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t("Name"),
            dataIndex: 'Name',
            key: 'Name',
            width: 150,
            sorter: (a, b) => a.Name.localeCompare(b.Name),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("CalculationType"),
            dataIndex: 'CalculationType',
            key: 'CalculationType',
            width: 150,
            sorter: (a, b) => a.CalculationType.localeCompare(b.CalculationType),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("CalculationMethod"),
            dataIndex: 'CalculationMethod',
            key: 'CalculationMethod',
            width: 150,
            sorter: (a, b) => a.CalculationMethod.localeCompare(b.CalculationMethod),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Formula"),
            dataIndex: 'Formula',
            key: 'Formula',
            width: 150,
            sorter: (a, b) => a.Formula.localeCompare(b.Formula),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("NormativeAct"),
            dataIndex: 'NormativeAct',
            key: 'NormativeAct',
            width: 150,
            sorter: (a, b) => a.NormativeAct.localeCompare(b.NormativeAct),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("InheritPercentage"),
            dataIndex: 'InheritPercentage',
            key: 'InheritPercentage',
            width: 150,
            sorter: (a, b) => a.InheritPercentage.localeCompare(b.InheritPercentage),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("AllowEditChild"),
            dataIndex: 'AllowEditChild',
            key: 'AllowEditChild',
            width: 150,
            sorter: (a, b) => a.AllowEditChild.localeCompare(b.AllowEditChild),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("State"),
            dataIndex: 'Price',
            key: 'State',
            width: 100,
            sorter: (a, b) => a.State.localeCompare(b.State),
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [rowData, setRowData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                CalculationKindServices.GetCalculationKindList(),
            ]);
            setTableData(tableData.data.rows);
            setFilteredTableData(tableData.data.rows);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params]);

    const onSearch = (event) => {
        const filteredTable = tableData.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setFilteredTableData(filteredTable);
        // console.log(filteredTable);
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
            width={768}
            title={t("CalculationKind")}
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
                                ID: record.ID, NameValue: record.Name, CalculationTypeID: record.CalculationTypeID,
                                id: props.params.ID, Name: props.params.Name,
                            });
                            props.onCancel();
                        },
                        onClick: () => {
                            setRowData({ ID: record.ID, NameValue: record.Name, CalculationTypeID: record.CalculationTypeID,
                                id: props.params.ID, Name: props.params.Name });
                        },
                    };
                }}
            />
        </Modal>
    )
}

export default CalculationKindModal;