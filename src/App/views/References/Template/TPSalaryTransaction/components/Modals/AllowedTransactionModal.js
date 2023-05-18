import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../../../../helpers/notifications';
import AllowedTransactionServices from '../../../../../../../services/References/Global/AllowedTransaction/AllowedTransaction.services';

const AllowedTransactionModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
        },
        {
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            sorter: true,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 300,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("AccDb"),
            dataIndex: "AccDb",
            key: "AccDb",
            sorter: true,
        },
        {
            title: t("AccCr"),
            dataIndex: "AccCr",
            key: "AccCr",
            sorter: true,
        },
        {
            title: t("MemorialOrderNumber"),
            dataIndex: "MemorialOrderNumber",
            key: "MemorialOrderNumber",
            sorter: true,
            width: 150,
        },
        {
            title: t("DisplayName"),
            dataIndex: "DisplayName",
            key: "DisplayName",
            sorter: true,
            width: 200,
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [rowData, setRowData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                AllowedTransactionServices.GetList(),
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
            title={t("Allowed Transaction")}
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

export default AllowedTransactionModal;