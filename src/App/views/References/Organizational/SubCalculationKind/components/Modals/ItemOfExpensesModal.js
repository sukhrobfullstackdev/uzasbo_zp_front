import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import HelperServices from '../../../../../../../services/Helper/helper.services';

const ItemOfExpensesModal = (props) => {
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
            title: t("Code"),
            dataIndex: 'Code',
            key: 'Code',
            width: 150,
            sorter: (a, b) => a.Code.localeCompare(b.Code),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("OnlyCode"),
            dataIndex: 'OnlyCode',
            key: 'OnlyCode',
            width: 150,
            sorter: (a, b) => a.OnlyCode.localeCompare(b.OnlyCode),
            render: record => <div className="ellipsis-2">{record}</div>
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [rowData, setRowData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                HelperServices.GetItemOfExpensesList(),
            ]);
            setTableData(tableData.data);
            setFilteredTableData(tableData.data);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params]);

    const onSearch = (event) => {
        const filteredTable = tableData.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
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
            width={768}
            title={t("ItemOfExpensesName")}
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
                                ID: record.ID, NameValue: record.Code,
                                id: props.params.ID, Name: props.params.Name,
                            });
                            props.onCancel();
                        },
                        onClick: () => {
                            setRowData({ ID: record.ID, NameValue: record.Code,
                                id: props.params.ID, Name: props.params.Name });
                        },
                    };
                }}
            />
        </Modal>
    )
}

export default ItemOfExpensesModal;