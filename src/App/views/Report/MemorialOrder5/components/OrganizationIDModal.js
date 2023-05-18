import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import OrganizationServices from '../../../../../services/Documents/Admin/Organization/Organization.services';

const OrganizationIDModal = (props) => {
    // console.log(props);
    const { params } = props.params
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
            title: t("OrgFullName"),
            dataIndex: 'OrgFullName',
            key: 'OrgFullName',
            width: 250,
            sorter: (a, b) => a.OrgFullName.localeCompare(b.OrgFullName),
            render: record => <div className="ellipsis-2">{record}</div>
        },
    ];

    const [tableLoading, setTableLoading] = useState(false);
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
        setTableLoading(true);
        const [tableData] = await Promise.all([
            OrganizationServices.GetList({
                Name: Name,
                ...params,
                ...TableParams,
            }),
        ]);
        setTableData(tableData.data);
        setTableLoading(false);
    };

    useEffect(() => {
        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params, Name, TableParams]);

    const onSearch = (event) => {
        setName(event);
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
            width={768}
            title={t("Organization")}
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
                    placeholder={t("search")}
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
                                ID: record.ID, NameValue: record.OrgFullName,
                                id: props.params.ID, Name: props.params.Name,
                            });
                            props.onCancel();
                        },
                        onClick: () => {
                            setRowData({
                                ID: record.ID, NameValue: record.OrgFullName,
                                id: props.params.ID, Name: props.params.Name,
                            });
                        },
                    };
                }}
            />
        </Modal>
    )
}

export default React.memo(OrganizationIDModal);