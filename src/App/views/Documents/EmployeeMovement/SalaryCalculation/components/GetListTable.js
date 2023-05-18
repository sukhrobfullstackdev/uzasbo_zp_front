import React, { useCallback, useState } from 'react'
import { Space, Table, Tag, Tooltip, Menu, Dropdown } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from "react-router-dom";

import { setListPagination, setListFilter, getListStartAction } from '../_redux/getListSlice';
import { Notification } from '../../../../../../helpers/notifications';
import SalaryCalculationServices from '../../../../../../services/Documents/EmployeeMovement/SalaryCalculation/SalaryCalculation.services'
import classes from "../SalaryCalculation.module.css";
import TableContextMenu from './TableContextMenu';
import { CSSTransition } from 'react-transition-group';
import ChangeStatusModal from './ChangeStatusModal';

const GetListTable = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const tableList = useSelector((state) => state.salaryCalcGetList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;

  const filterData = tableList?.filterData;
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const [loading, setLoading] = useState(false);
  const [tableContextMenu, setTableContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [statusID, setStatusID] = useState(null);

  const recalcMemOrder = useCallback((id) => {
    setLoading(true);
    SalaryCalculationServices.recalcMemOrder(id)
      .then(res => {
        setLoading(false);
        getListStartAction({
          ...tablePagination,
          ...tableFilterData,
        })
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      });
  }, [tableFilterData, tablePagination])

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 8) {
          return record.ID;
        }
        return <span style={{ color: 'red' }}>{record.ID}</span>
      }
    },
    {
      title: t("number"),
      dataIndex: "Number",
      key: "Number",
      sorter: true,
      width: 80
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      key: "Date",
      sorter: true,
      width: 100
    },
    {
      title: t("SubcName"),
      dataIndex: "SubcName",
      key: "SubcName",
      sorter: true,
      width: 250,
      className: classes.SubcName,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("SettleCode"),
      dataIndex: "SettleCode",
      key: "SettleCode",
      sorter: true,
      width: 100
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      sorter: true,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 9) {
          return (
            <Tag color='#87d068'>
              {record.Status}
            </Tag>
          );
        }
        return (
          <Tag color='#f50'>
            {record.Status}
          </Tag>
        );
      }
    },
    {
      title: t("DivName"),
      dataIndex: "DivName",
      key: "DivName",
      sorter: true,
      width: 200,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("Comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
      width: 150,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("DateOfModified"),
      dataIndex: "DateOfModified",
      key: "DateOfModified",
      sorter: true,
    },
    ...props.adminViewRole ? [{
      title: t("scholarship"),
      dataIndex: "IsScholarship",
      key: "IsScholarship",
      sorter: true,
      width: 120,
      render: record => <span>{record === null ? '' : record.toString()}</span>
    }] : [],
    {
      title: t("actions"),
      key: "action",
      align: "center",
      fixed: 'right',
      render: (record) => {
        return (
          <Space size="middle">
            <Dropdown
              placement='bottom'
              overlay={<Menu items={[
                ...props.adminViewRole ? [
                  {
                    key: 'recalcMemOrder',
                    label: (
                      <span onClick={() => recalcMemOrder(record.ID)}>
                        <i className="feather icon-refresh-cw action-icon"></i>
                        {t("recalcMemOrder")}
                      </span>
                    ),
                  }] : [],
                ...props.superAdminViewRole || props.OrganizationTypeID ? [
                  {
                    key: 'ChangeOutSum',
                    label: (
                      <span onClick={() => changeOutSum(record.ID)}>
                        <i className="feather icon-book action-icon"></i>
                        {t("ChangeOutSum")}
                      </span>
                    ),
                  }] : [],
                ...props.superAdminViewRole ? [
                  {
                    key: 'changeStatus',
                    label: (
                      <span onClick={() => openChangeStatusModalHandler({
                        id: record.ID,
                        status: record.StatusID,
                      })}>
                        <i className="feather icon-check-square action-icon"></i>
                        {t('changeStatus')}
                      </span>
                    ),
                  }] : [],
                ...props.superAdminViewRole ? [
                  {
                    key: 'changeType',
                    label: (
                      <span onClick={() => openChangeStatusModalHandler({
                        id: record.ID,
                      })}>
                        <i className="feather icon-hash action-icon"></i>
                        {t('changeType')}
                      </span>
                    ),
                  }] : [],
              ]} />}
            >
              <i className='feather icon-list action-icon' aria-hidden="true" />
            </Dropdown>

            <Dropdown
              overlay={<Menu onClick={(e) => printByType(e, record.ID)}
              >
                <Menu.Item key="FIO">
                  {t('FIO')}
                </Menu.Item>
                <Menu.Item key="FIOByDepartment">
                  {t('FIOByDepartment')}
                </Menu.Item>
                {/* <Menu.Item key="FIOByDepartmentNewSheet">
                                {t('FIOByDepartmentNewSheet')}
                                </Menu.Item> */}
                <Menu.Item key="Number">
                  {t('Numbersc')}
                </Menu.Item>
                <Menu.Item key="NumberByDepartment">
                  {t('NumberByDepartment')}
                </Menu.Item>
                {/* <Menu.Item key="NumberByDepartmentNewSheet">
                                {t('NumberByDepartmentNewSheet')}
                                </Menu.Item>*/}
                <Menu.Item key="TotalBySubCalculation">
                  {t('TotalBySubCalculation')}
                </Menu.Item>
                <Menu.Item key="MemOrder5">
                  {t('MemOrder5')}
                </Menu.Item>
                {/* <Menu.Item key="EmployeeReport">
                                {t('EmployeeReport')}
                                </Menu.Item> */}
              </Menu>}
              placement="bottom"
            >
              <i className='feather icon-printer action-icon' aria-hidden="true" />
            </Dropdown>
            <Tooltip title={t('send')}>
              <span onClick={() => sendHandler(record.ID)}>
                <i className="far fa-share-square action-icon"></i>
              </span>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const changeSholarshipHandler = id => {
    setLoading(true);
    SalaryCalculationServices.changeScholarship(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('edited'));
          dispatch(setListFilter(filterData));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  }

  const changeOutSum = (id) => {
    SalaryCalculationServices.changeOutSum(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('edited'));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  }

  const printByType = (e, id) => {
    setLoading(true);
    SalaryCalculationServices.printType(id, e.key)
      .then((res) => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "print.xlsx");
          document.body.appendChild(link);
          link.click();
          dispatch(setListFilter(filterData));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  const sendHandler = (id) => {
    setLoading(true);
    SalaryCalculationServices.send(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('edited'));
          dispatch(setListFilter(filterData));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false)
      });
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { field, order } = sorter;
    dispatch(
      setListPagination({
        OrderType: order?.slice(0, -3),
        SortColumn: field,
        PageNumber: pagination.current,
        PageLimit: pagination.pageSize,
      })
    );
  }

  const onTableRow = (record) => {
    return {
      onDoubleClick: () => {
        history.push(`${location.pathname}/edit/${record.ID}`);
      },
      onContextMenu: event => {
        console.log(event);
        event.preventDefault();
        if (!tableContextMenu.visible) {
          document.addEventListener(`click`, function onClickOutside() {
            setTableContextMenu({
              ...tableContextMenu,
              visible: false
            });
            document.removeEventListener(`click`, onClickOutside);
          });

          document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
            setTableContextMenu({
              ...tableContextMenu,
              visible: false
            });
            document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
          })
        }
        setTableContextMenu({
          record,
          visible: true,
          x: event.clientX,
          y: event.clientY
        });
      }
    };
  }

  // change status modal
  const openChangeStatusModalHandler = (values) => {
    setStatusModalVisible(true);
    setRowId(values.id);
    setStatusID(values.status);
  }

  const closeChangeStatusModalHandler = (values) => {
    setStatusModalVisible(false);
  }

  const closeChangeStatusModalOkHandler = (values) => {
    setStatusModalVisible(false);
    setTimeout(() => {
      dispatch(setListPagination(userListPagination));
    }, 50);
  }
  // change status modal

  return (
    <>
      <Table
        bordered
        size="middle"
        rowClassName="table-row"
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={storeLoading || loading}
        onChange={handleTableChange}
        rowKey={(record) => record.ID}
        showSorterTooltip={false}
        onRow={(record) => onTableRow(record)}
        scroll={{
          x: "max-content",
          y: '50vh'
        }}
        pagination={{
          pageSize: Math.ceil(tableData?.length / 10) * 10,
          total: total,
          current: userListPagination.PageNumber,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
        }}
      />
      <TableContextMenu
        {...tableContextMenu}
        // deleteRow={this.deleteRowHandler}
        // accept={this.acceptHandler}
        // notAccept={this.declineHandler}
        parentPath={location.pathname}
        sendDoc={sendHandler}
      />
      {/* change status modal added here */}
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={statusModalVisible}
        timeout={300}
      >
        <ChangeStatusModal
          visible={statusModalVisible}
          id={rowId}
          statusID={statusID}
          onCancel={closeChangeStatusModalHandler}
          onOk={closeChangeStatusModalOkHandler}
        />
      </CSSTransition>
    </>
  )
}

export default GetListTable;