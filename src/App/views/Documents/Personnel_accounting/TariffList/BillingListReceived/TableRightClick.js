import React from "react"
// import { Link } from "react-router-dom";
// import { Modal } from "antd";
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import { FileZipOutlined } from '@ant-design/icons';

const TableRightClick = (props) => {
  const { t } = useTranslation();

  // const deleteModal = (id) => {
  //   Modal.confirm({
  //     title: 'sure to Delete document whose id is ' + id,
  //     icon: <ExclamationCircleOutlined />,
  //     okText: 'ok',
  //     cancelText: 'cancel',
  //     onOk: () => {
  //       props.deleteRow(id);
  //     },
  //   });
  // }

  return (props.visible &&
    <ul className='right-click-popup' style={{ left: `${props.x - 275}px`, top: `${props.y - 105}px` }}>

      <li onClick={() => this.handleArchieve(props.record.ID)}>
        <FileZipOutlined style={{ color: "#007bff", cursor: "pointer", fontSize: 16, marginRight: 10 }} />
        {t("Archive")}
      </li>
      <li onClick={() => props.SendHeader(props.record.ID)}>
        <i className="far fa-paper-plane action-icon" />
        {t('sendRow')}
      </li> 
     
    </ul>
  )
}
export default TableRightClick;