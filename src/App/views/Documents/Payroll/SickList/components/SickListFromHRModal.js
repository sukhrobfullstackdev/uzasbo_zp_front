import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../../../helpers/notifications';

const SickListFromHRModal = (props) => {
  // console.log(props.params);
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
      title: t("FullName"),
      dataIndex: 'FullName',
      key: 'FullName',
      width: 250,
      sorter: (a, b) => a.FullName.localeCompare(b.FullName),
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("Seria"),
      dataIndex: 'Seria',
      key: 'Seria',
      width: 150,
      sorter: true,
      render: (_, record) => {
        if (record.IsClosed === true) {
          return record.Seria;
        } else {
          return <span style={{ color: 'red' }}>{record.Seria}</span>
        }
      }
    },
    {
      title: t("Number"),
      dataIndex: 'Number',
      key: 'Number',
      width: 150,
      sorter: true,
      render: (_, record) => {
        if (record.IsClosed === true) {
          return record.Number;
        } else {
          return <span style={{ color: 'red' }}>{record.Number}</span>
        }
      }
    },
    {
      title: t("IssueDate"),
      dataIndex: 'IssueDate',
      key: 'IssueDate',
      width: 150,
      sorter: true,
    },
    {
      title: t("BeginDate"),
      dataIndex: 'BeginDate',
      key: 'BeginDate',
      width: 150,
      sorter: true,
    },
    {
      title: t("EndDate"),
      dataIndex: 'EndDate',
      key: 'EndDate',
      width: 150,
      sorter: true,
    },
    {
      title: t("Diagnosis"),
      dataIndex: 'Diagnosis',
      key: 'Diagnosis',
      width: 250,
      sorter: (a, b) => a.Diagnosis.localeCompare(b.Diagnosis),
      render: record => <div className="ellipsis-2">{record}</div>
    },
  ];

  // const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    setTableData(props.params)
    setFilteredTableData(props.params)
  }, [props.params]);

  const onSearch = (event) => {
    const filteredTable = tableData.filter(model => model.Diagnosis.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredTableData(filteredTable);
  };

  const selectRow = () => {
    props.onSelect(rowData);
    // if (rowData !== null) {
    //   props.onCancel();
    // }
  };

  const setRowClassName = (record) => {
    return record.ID === rowData?.ID ? 'table-row clicked-row' : 'table-row';
  };

  // function handleTableChange(pagination, filters, sorter, extra) {
  //     // console.log('params', pagination, filters, sorter, extra);
  //     const { field, order } = sorter;
  //     setTableLoading(true);
  // };

  return (
    <Modal
      width={990}
      title={t("InformationfromMedicalInformationSystem")}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel}>
          {t("close")}
        </Button>,
        <Button
          key="select"
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
        dataSource={filteredTableData}
        // loading={tableLoading}
        // onChange={handleTableChange}
        rowKey={Math.random()}
        showSorterTooltip={false}
        pagination={false}
        scroll={{
          x: "max-content",
          y: "50vh",
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              if (record.IsClosed === true) {
                props.onSelect(record);
              } else {
                // Notification('error', t('Танланган касаллик варақаси ҳолати "ёпилган" ҳолатида эмас'))
              }
              // props.onCancel();
            },
            onClick: () => {
              if (record.IsClosed === true) {
                setRowData(record);
              } else {
                Notification('error', t('Танланган касаллик варақаси ҳолати "ёпилган" ҳолатида эмас'))
              }
            },
          };
        }}
      />
    </Modal>
  )
}

export default React.memo(SickListFromHRModal);