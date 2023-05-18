import React from "react"
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';

import classes from "./OrderToSendBusTrip.module.css"

const Popup = ({ record, visible, x, y, deleteRow, acceptRow, notAcceptRow }) => {
  function deleteModal(id) {
    Modal.confirm({
      title: 'sure to Delete document whose id is ' + id,
      icon: <ExclamationCircleOutlined />,
      okText: 'ok',
      cancelText: 'cancel',
      onOk: () => {
        deleteRow(id)
      },
      onCancel: () => console.log('cancel'),
    });
  }

  const notAcceptModal = (id) => {
    Modal.confirm({
      title: 'sure to decline document whose id is ' + id,
      icon: <ExclamationCircleOutlined />,
      okText: 'ok',
      cancelText: 'cancel',
      onOk: () => {
        notAcceptRow(id)
      },
      onCancel: () => console.log('cancel'),
    });
  }

  return (visible &&
    <ul className={classes.popup} style={{ left: `${x - 275}px`, top: `${y - 105}px` }}>
      <li>
        <Link to={`EmployeeMovement/edit/${record.ID}`}>
          <i
            className='feather icon-edit action-icon'
            aria-hidden="true"
          />Edit
        </Link>
      </li>
      <li onClick={() => deleteModal(record.ID)}>
        <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
        Delete
      </li>
      <li onClick={() => acceptRow(record.ID)}>
        <i className="far fa-check-circle action-icon" />
        Accept
      </li>
      <li onClick={() => notAcceptModal(record.ID)}>
        <i className="far fa-times-circle action-icon" />
        NotAccept
      </li>
    </ul>
  )
}
export default Popup