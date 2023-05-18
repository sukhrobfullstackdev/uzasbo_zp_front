import { Button, Checkbox, Col, Modal, Row, Space, Table, Spin } from "antd";
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../../../../helpers/notifications';
import SubCalculationKindServices from '../../../../../../../services/References/Organizational/SubCalculationKind/SubCalculationKind.services';

const LeavePayDataModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();

    const columns1 = [
        {
            title: t("choice"),
            dataIndex: 'IsSelected',
            key: 'IsSelected',
            width: 50,
            render: (record, fullRecord) => {
                return (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }} >
                        <Checkbox defaultChecked={record}
                            onChange={() => handleCheckRow({ id: fullRecord.ID, table: 1 })}
                        ></Checkbox>
                    </Space>
                )
            },
        },
        {
            title: t("Name"),
            dataIndex: 'Name',
            key: 'Name',
            width: 250,
            sorter: (a, b) => a.Name.localeCompare(b.Name),
            render: record => <div className="ellipsis-2">{record}</div>
        },
    ];

    const columns2 = [
        {
            title: t("choice"),
            dataIndex: 'IsSelected',
            key: 'IsSelected',
            width: 50,
            render: (record, fullRecord) => {
                return (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }} >
                        <Checkbox defaultChecked={record}
                            onChange={() => handleCheckRow({ id: fullRecord.ID, table: 2 })}
                        ></Checkbox>
                    </Space>
                )
            },
        },
        {
            title: t("Name"),
            dataIndex: 'Name',
            key: 'Name',
            width: 250,
            sorter: (a, b) => a.Name.localeCompare(b.Name),
            render: record => <div className="ellipsis-2">{record}</div>
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [tableData1, setTableData1] = useState([]);
    const [tableData2, setTableData2] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                SubCalculationKindServices.GetLoadLeavePayData(props.params),
            ]);
            // console.log(tableData.data === '');
            setTableData(tableData.data);
            setTableData1(tableData.data.Table1);
            setTableData2(tableData.data.Table2);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params]);

    const handleCheckRow = (params) => {
        if (params.table === 1) {
            let selectedRow = tableData.Table1.find(row => row.ID === params.id);
            selectedRow.IsSelected = !selectedRow.IsSelected;
            tableData.Table1.map(row => {
                if (row.ID === selectedRow.ID) {
                    row = selectedRow;
                }
                return row;
            });
        } else {
            let selectedRow = tableData.Table2.find(row => row.ID === params.id);
            selectedRow.IsSelected = !selectedRow.IsSelected;
            tableData.Table2.map(row => {
                if (row.ID === selectedRow.ID) {
                    row = selectedRow;
                }
                return row;
            });
        }
        setTableData(tableData);
    };

    const updateLeavePayData = () => {
        console.log({ ...tableData, ParentID: props.params.ParentID });
        setTableLoading(true);
        SubCalculationKindServices.UpdateSaveLeavePayData({ ...tableData, ParentID: props.params.ParentID })
            .then((res) => {
                if (res.status === 200) {
                    setTableLoading(false);
                    props.onCancel();
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setTableLoading(false);
            });
    };

    return (
        <Modal
            width={1190}
            title={t("settings")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    // disabled={!rowData}
                    type="primary"
                    onClick={updateLeavePayData}
                >
                    {t("apply")}
                </Button>,
            ]}
        >
            <Spin size='large' spinning={tableLoading}>
                {tableData === '' ?
                    (
                        <div style={{ textAlign: 'center', height: '8rem', fontSize: 18, fontWeight: 'bold' }}>
                            {t("Этот вид расчет настраивается только администраторам")}
                        </div>
                    ) : (
                        <Row gutter={[15, 0]}>
                            <Col md={tableData?.Table2?.length > 0 ? 12 : 24}>
                                <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                                    {/* {t("CalculationKind")}{' '}{t("Prize")} */}
                                    {props.params.Name}
                                </div>
                                <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
                                    {t("checkTypeCalcRelateSalaryPos")}
                                </div>
                                <Table
                                    bordered
                                    size="middle"
                                    rowClassName='table-row'
                                    className="main-table mt-4"
                                    columns={columns1}
                                    dataSource={tableData1}
                                    loading={tableLoading}
                                    rowKey={record => record.ID}
                                    showSorterTooltip={false}
                                    pagination={false}
                                    scroll={{
                                        x: "max-content",
                                        y: "50vh",
                                    }}
                                />
                            </Col>
                            {tableData?.Table2?.length > 0 && (
                                <Col md={12}>
                                    <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>&zwnj;</div>
                                    <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
                                        {t("checkTypeCalc12Premium")}
                                    </div>
                                    <Table
                                        bordered
                                        size="middle"
                                        rowClassName='table-row'
                                        className="main-table mt-4"
                                        columns={columns2}
                                        dataSource={tableData2}
                                        loading={tableLoading}
                                        rowKey={record => record.ID}
                                        showSorterTooltip={false}
                                        pagination={false}
                                        scroll={{
                                            x: "max-content",
                                            y: "50vh",
                                        }}
                                    />
                                </Col>
                            )}
                        </Row>
                    )}
            </Spin>
        </Modal>
    )
}

export default LeavePayDataModal;