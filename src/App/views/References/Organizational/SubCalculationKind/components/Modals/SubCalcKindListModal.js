import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Notification } from '../../../../../../../helpers/notifications';
import SubCalculationKindServices from '../../../../../../../services/References/Organizational/SubCalculationKind/SubCalculationKind.services';

const SubCalcKindListModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();
    const subalcKindList = useSelector((state) => state.subalcKindList);
    let OrgID = subalcKindList?.filterData.OrgID;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 180,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("CalculationType"),
            dataIndex: "CalculationType",
            key: "CalculationType",
            sorter: true,
        },
        {
            title: t("TaxItem"),
            dataIndex: "TaxItem",
            key: "TaxItem",
            sorter: true,
        },
        {
            title: t("CalculationMethod"),
            dataIndex: "CalculationMethod",
            key: "CalculationMethod",
            sorter: true,
        },
        {
            title: t("Salary Transaction"),
            dataIndex: "SalaryTransaction",
            key: "SalaryTransaction",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("StateName"),
            dataIndex: "StateName",
            key: "StateName",
            sorter: true,
        },
        {
            title: t("ParentName"),
            dataIndex: "ParentName",
            key: "ParentName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("TPOwnerID"),
            dataIndex: "TPOwnerID",
            key: "TPOwnerID",
            sorter: true,
        },
        {
            title: t("TPOwnerName"),
            dataIndex: "TPOwnerName",
            key: "TPOwnerName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("ShortNameRus"),
            dataIndex: "ShortNameRus",
            key: "ShortNameRus",
            sorter: true,
        },
        {
            title: t("ShortNameUzb"),
            dataIndex: "ShortNameUzb",
            key: "ShortNameUzb",
            sorter: true,
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [rowData, setRowData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                SubCalculationKindServices.getListByOrgID({ OrgID: OrgID }),
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

export default SubCalcKindListModal;