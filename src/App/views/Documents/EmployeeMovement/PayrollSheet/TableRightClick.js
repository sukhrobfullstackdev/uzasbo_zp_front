import React from "react"
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const TableRightClick = (props) => {
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

  // const notAcceptModal = (id) => {
  //   Modal.confirm({
  //     title: 'sure to decline document whose id is ' + id,
  //     icon: <ExclamationCircleOutlined />,
  //     okText: 'ok',
  //     cancelText: 'cancel',
  //     onOk: () => {
  //       props.notAccept(id);
  //     },
  //   });
  // }

  return (props.visible &&
    <ul className='right-click-popup' style={{ left: `${props.x - 275}px`, top: `${props.y - 105}px` }}>
      <li>
        <Link to={`${props.parentPath}/edit/${props.record.ID}`} style={{ display: 'block' }}>
          <i className='feather icon-edit action-icon' aria-hidden="true" />
          Edit
        </Link>
      </li>
      <li onClick={() => deleteModal(props.record.ID)}>
        <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
        Delete
      </li>
      {/* <li onClick={() => props.accept(props.record.ID)}>
        <i className="far fa-check-circle action-icon" />
        Accept
      </li>
      <li onClick={() => notAcceptModal(props.record.ID)}>
        <i className="far fa-times-circle action-icon" />
        NotAccept
      </li> */}
    </ul>
  )
}
export default TableRightClick;