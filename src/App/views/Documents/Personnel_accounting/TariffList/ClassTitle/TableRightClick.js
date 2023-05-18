import React from "react"
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

const TableRightClick = (props) => {
  const { t } = useTranslation();

  const deleteModal = (id) => {
    Modal.confirm({
      title: 'sure to Delete document whose id is ' + id,
      icon: <ExclamationCircleOutlined />,
      okText: 'ok',
      cancelText: 'cancel',
      onOk: () => {
        props.deleteRow(id);
      },
    });
  }

  return (props.visible &&
    <ul className='right-click-popup' style={{ left: `${props.x - 275}px`, top: `${props.y - 105}px` }}>
      <li>
        <Link to={`${props.parentPath}/edit/${props.record.ID}`} style={{ display: 'block' }}>
          <i className='feather icon-edit action-icon' aria-hidden="true" />
          {t('Edit')}
        </Link>
      </li>
      {/* <li>
        <Link
          style={{ display: 'block' }}
          to={`${props.parentPath}/add?id=${props.record.ID}&IsClone=true`}
        >
          <i className="far fa-clone action-icon" />
          {t("clone")}
        </Link>
      </li> */}
      <li onClick={() => props.openProtocolModal(props.record.ID, props.record.TableID)}>
        <i className="far fa-comment action-icon" />
        {t('protocols')}
      </li>
      <li onClick={() => props.printRow(props.record.ID, props.record.TableID)}>
        <i className='feather icon-printer action-icon' aria-hidden="true" />
        {t('print')}
      </li>
      <li onClick={() => props.printForm(props.record.ID)}>
        <i className='feather icon-printer action-icon' aria-hidden="true" />
        {t('printForm')}
      </li>
      <li onClick={() => props.sendRow(props.record.ID)}>
        <i className="far fa-paper-plane action-icon" />
        {t('sendRow')}
      </li>
      <li onClick={() => props.accept(props.record.ID)}>
        <i className="far fa-check-circle action-icon" />
        {t("Accept")}
      </li>
      <li onClick={() => props.notAccept(props.record.ID)}>
        <i className="far fa-times-circle action-icon" />
        {t("NotAccept")}
      </li>
      <li onClick={() => deleteModal(props.record.ID)}>
        <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
        {t('Delete')}
      </li>
    </ul>
  )
}
export default TableRightClick;