import { Button, Modal, Table } from 'antd';
import React, {useState } from 'react'
import { useTranslation } from 'react-i18next';


const MethodsOfUseModal = (props) => {
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
    ];

    const [tableData, setTableData] = useState([
        {
            ID: 1,
            Name: 'Полностью',
        },
        {
            ID: 2,
            Name: 'За вычетом минимальной ЗП',
        },
    ]);
    const [rowData, setRowData] = useState(null);


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
            <Table
                bordered
                size="middle"
                rowClassName={setRowClassName}
                className="main-table mt-4"
                columns={columns}
                dataSource={tableData}
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
                                ID: record.ID, NameValue: record.Name,
                                id: props.params.ID, Name: props.params.Name,
                            });
                            props.onCancel();
                        },
                        onClick: () => {
                            setRowData({
                                ID: record.ID, NameValue: record.Name,
                                id: props.params.ID, Name: props.params.Name,
                            });
                        },
                    };
                }}
            />
        </Modal>
    )
}

export default MethodsOfUseModal;