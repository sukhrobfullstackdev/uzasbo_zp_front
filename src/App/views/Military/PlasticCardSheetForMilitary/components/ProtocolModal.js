import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { useTranslation } from "react-i18next";

import HelperServices from "../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../helpers/notifications";

const ProtocolModal = (props) => {
  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const tableDt = await HelperServices.GetFileLogForPayrollOfPlasticCardSheetForMilitary({ DocumentID: props.id });
      setTableData(tableDt.data);
      setTableLoading(false);
    }
    fetchData().catch(err => {
      // console.log(err);
      setTableLoading(false);

      Notification('error', err);
    });
  }, [props.id, props.tableId]);

  const columns = [
    // {
    //   title: t('status'),
    //   dataIndex: "status",
    //   width: 110,
    // },
    {
      title: t('Description'),
      dataIndex: "Description",
    },
    {
      title: t('id'),
      dataIndex: "ID",
      width: 110,
    },
    {
      title: t('DateOfCreated'),
      dataIndex: "DateOfCreated",
      width: 120,
    },
  ];

  return (
    <Modal
      title={t("protocol")}
      visible={props.visible}
      cancelText={t("cancel")}
      onCancel={props.onCancel}
      width={900}
      okButtonProps={{ style: { display: 'none' } }}
    >
      <Table
        bordered
        size='middle'
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        rowKey={(record) => record.ID}
        pagination={false}
        rowClassName="table-row"
        scroll={{
          x: "50vh",
          y: "50vh",
        }}
      />
    </Modal >
  )
}

export default ProtocolModal;