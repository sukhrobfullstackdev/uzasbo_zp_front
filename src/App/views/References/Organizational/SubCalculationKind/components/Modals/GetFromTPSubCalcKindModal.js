import { Button, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../../../../helpers/notifications';
import SubCalculationKindServices from '../../../../../../../services/References/Organizational/SubCalculationKind/SubCalculationKind.services';

const GetFromTPSubCalcKindModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();

    const columns = [
        {
            title: t("Name"),
            dataIndex: 'Name',
            key: 'Name',
            width: 450,
            sorter: (a, b) => a.Name.localeCompare(b.Name),
            render: record => <div className="ellipsis-2">{record}</div>
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    // const [rowData, setRowData] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                SubCalculationKindServices.GetFromTPSubCalculationKind(),
            ]);
            setTableData(tableData.data);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows);
            setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record) => ({
            name: record.name,
        }),
    };

    const handleSync = async () => {
        setTableLoading(true);
        await selectedRows.map(row => {
            // console.log({
            //     OrganizationID: props.params.OrganizationID,
            //     tPSubCalculationKindID: row.ID,
            // });
            SubCalculationKindServices.SyncSubCalculationKind({
                OrganizationID: props.params.OrganizationID,
                tPSubCalculationKindID: row.ID,
            })
                .then((res) => {
                    if (res.status === 200) {
                        // Notification('success', t('success-msg'));
                    }
                })
                .catch((err) => {
                    Notification('error', err);
                });
            return null;
        })
        Notification('success', t('success-msg'));
        props.onCancel();
        props.handleRefresh();
        setTableLoading(false);
    };

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
                    // disabled={!rowData}
                    type="primary"
                    onClick={handleSync}
                >
                    {t("select")}
                </Button>,
            ]}
        >
            <div style={{ textAlign: 'center', fontSize: 16 }}>
                {t("resNewTypeCalc")}
            </div>
            <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
                {t("selReqTypeCalc")}
            </div>
            <Table
                bordered
                size="middle"
                rowClassName={'table-row'}
                className="main-table mt-4"
                columns={columns}
                dataSource={tableData}
                loading={tableLoading}
                rowKey={record => record.ID}
                showSorterTooltip={false}
                pagination={false}
                scroll={{
                    x: "max-content",
                    y: "50vh",
                }}
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
            />
        </Modal>
    )
}

export default GetFromTPSubCalcKindModal;