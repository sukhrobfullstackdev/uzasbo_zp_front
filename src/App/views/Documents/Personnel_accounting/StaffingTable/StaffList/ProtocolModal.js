import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { useTranslation } from "react-i18next";

import HelperServices from "../../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../../helpers/notifications";

const ProtocolModal = (props) => {
  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const tableDt = await HelperServices.GetStaffListFileLog(props.id, props.tableId);
      setTableData(tableDt.data);
      setTableLoading(false);
    }
    fetchData().catch(err => {
      // console.log(err);
      Notification('error', err);
    });
  }, [props.id, props.tableId]);

  const columns = [
    {
      title: t('id'),
      dataIndex: "ID",
    },
    {
      title: t('status'),
      dataIndex: "Status",
    },
  ];

  return (
    <Modal
      title={t("protocol")}
      visible={props.visible}
      cancelText={t("cancel")}
      onCancel={props.onCancel}
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
        rowClassName="table-row"
        scroll={{
          x: "max-content",
          y: "40vh",
        }}
      />
    </Modal >
  )
}

export default ProtocolModal;