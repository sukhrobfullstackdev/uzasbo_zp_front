import React from "react"
import { Link } from "react-router-dom";
// import { Modal } from "antd";
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

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
      {/* <li>
        <Link to={`${props.parentPath}/edit/${props.record.ID}`} style={{ display: 'block' }}>
          <i className='feather icon-edit action-icon' aria-hidden="true" />
          {t('Edit')}
        </Link>
      </li> */}
      {/* <li onClick={() => props.accept(props.record.ID)}>
        <i className="far fa-check-circle action-icon" />
        {t("Accept")}
      </li> */}
      <li onClick={() => props.accept(props.record.ID)}>
        <i className="far fa-check-circle action-icon" />
        {t("Accept")}
      </li>
      <li onClick={() => props.notAccept(props.record.ID)}>
        <i className="far fa-check-circle action-icon" />
        {t("NotAccept")}
      </li>
      {/* <li onClick={() => deleteModal(props.record.ID)}>
        <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
        {t('Delete')}
      </li> */}
    </ul>
  )
}
export default TableRightClick;