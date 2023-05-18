import { Button, Input, Modal, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../../../../helpers/notifications';
import TPSubCalculationKindServices from "./../../../../../../../services/References/Template/TPSubCalculationKind/TPSubCalculationKind.services";

const SubCalcKindListModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();

    const columns = [
        {
            title: t("ID"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80
        },

        {
            title: t("Vish"),
            dataIndex: "Vish",
            key: "Vish",
            sorter: true,
            width: 250
        },
        {
            title: t("DpName"),
            dataIndex: "DpName",
            key: "DpName",
            sorter: true,
            width: 150
        },
        {
            title: t("SubCalcName"),
            dataIndex: "SubCalcName",
            key: "SubCalcName",
            sorter: true,
            width: 250
        },
        {
            title: t("NormativeAct"),
            dataIndex: "NormativeAct",
            key: "NormativeAct",
            sorter: true,
            width: 250

        },
        {
            title: t("ShortNameUzb"),
            dataIndex: "ShortNameUzb",
            key: "ShortNameUzb",
            sorter: true,
            width: 150

        }, {
            title: t("ShortNameRus"),
            dataIndex: "ShortNameRus",
            key: "ShortNameRus",
            sorter: true,
            width: 150

        },
        {
            title: t('Status'),
            dataIndex: 'Status',
            key: 'Status',
            width: '12%',
            render: (status) => {
                if (status === "Актив") {
                    return (<Tag color="#87d068" key={status}>{status}</Tag>)
                } else if (status === "Пассив") {
                    return (<Tag color="#f50" key={status}>{status}</Tag>)
                }
            }
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [rowData, setRowData] = useState(null);
    const [Name, setName] = useState(null);
    const [TableParams, setTableParams] = useState({
        OrderType: null,
        SortColumn: null,
        PageNumber: 1,
        PageLimit: 10,
    });

    const fetchData = async () => {
        const [tableData] = await Promise.all([
            TPSubCalculationKindServices.getList(
                {
                    Search: Name,
                    ...TableParams,
                }
            ),
        ]);
        // console.log(tableData.data);
        setTableData(tableData.data);
        setTableLoading(false);
    };

    useEffect(() => {
        setTableLoading(true);
        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [Name, TableParams]);

    const onSearch = (event) => {
        setName(event);
        setTableParams({
            PageNumber: 1,
            PageLimit: 10,
        });
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

    function handleTableChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        const { field, order } = sorter;
        setTableLoading(true);
        setTableParams({
            OrderType: order?.slice(0, -3),
            SortColumn: field,
            PageNumber: pagination.current,
            PageLimit: pagination.pageSize,
        });
    };

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Input.Search
                    className="table-search"
                    placeholder={t("SubCalcName")}
                    enterButton
                    onSearch={onSearch}
                />
            </div>
            <Table
                bordered
                size="middle"
                rowClassName={setRowClassName}
                className="main-table mt-4"
                columns={columns}
                dataSource={tableData?.rows}
                loading={tableLoading}
                onChange={handleTableChange}
                rowKey={record => record.ID}
                showSorterTooltip={false}
                pagination={{
                    total: tableData?.total,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
                scroll={{
                    x: "max-content",
                    y: "50vh",
                }}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => {
                            props.onSelect({
                                ID: record.ID, NameValue: record.SubCalcName, key: props.params.key,
                                id: props.params.ID, Name: props.params.Name, RecordID: props.params.RecordID
                            });
                            props.onCancel();
                        },
                        onClick: () => {
                            setRowData({
                                ID: record.ID, NameValue: record.SubCalcName, key: props.params.key,
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