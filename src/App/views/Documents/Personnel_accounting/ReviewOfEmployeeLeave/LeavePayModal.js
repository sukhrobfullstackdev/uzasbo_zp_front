import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Table, Space, DatePicker, Button, Tag } from "antd";
import { useTranslation } from "react-i18next";
import moment from 'moment';

import LeavePayServices from "../../../../../services/Documents/Payroll/LeavePay/LeavePay.services";
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 50,
}

const LeavePayModal = props => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();

  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [tableLoading, setTableLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [filterType, setFilterType] = useState('');
  const [rowId, setRowId] = useState(null);

  useEffect(() => {
    const fetchInitial = (params = {}) => {
      let pageNumber = params.pagination.current,
        pageLimit = params.pagination.pageSize,
        sortColumn = params.sortField,
        orderType = params.sortOrder

      const date = {
        EndDate: moment().add(30, "days").format("DD.MM.YYYY"),
        StartDate: moment().subtract(30, "days").format("DD.MM.YYYY"),
      };

      LeavePayServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, {}, {})
        .then((res) => {
          setTableLoading(false);
          setTableData(res.data.rows);
          setTablePagination({
            ...params.pagination,
            total: res.data.total,
          })
        })
        .catch((err) => {
          setTableLoading(false);
          Notification('error', err);
        });
    };
    fetchInitial({ pagination: defaultPagination });
  }, [])

  const handleTableChange = (pagination, filters, sorter) => {
    fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    },
      filterData
    );
  };

  const fetch = (params = {}, filterFormValues) => {
    setTableLoading(true);
    let filter = {};

    if (filterType) {
      filter[filterType] = filterFormValues.Search ? filterFormValues.Search : '';
    }

    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    const date = {
      EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().add(30, "days").format("DD.MM.YYYY"),
      StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(30, "days").format("DD.MM.YYYY"),
    };

    LeavePayServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
      .then((res) => {
        setTableLoading(false);
        setTableData(res.data.rows);
        setTablePagination({
          ...params.pagination,
          total: res.data.total,
        })
      })
      .catch((err) => {
        setTableLoading(false);
        Notification('error', err);
        // console.log(err);
      });
  };

  const search = () => {
    const filterValues = filterForm.getFieldsValue();
    setTableLoading(true);
    setFilterData(filterValues);
    fetch({ pagination: defaultPagination }, filterValues);
  };

  const filterTypeHandler = (type) => {
    setFilterType(type);
  };

  const setRowClassName = (record) => {
    return record.ID === rowId ? 'table-row clicked-row' : 'table-row';
  }

  const closeModalHandler = () => {
    props.getModalData(rowId);
    props.onCancel();
  }

  const onRowHandler = (record) => {
    return {
      onDoubleClick: () => {
        props.getModalData(record.ID);
        props.onCancel();
      },
      onClick: () => {
        setRowId(record.ID);
      },
    };
  }

  const onFilterFormFinish = values => {
    setTableLoading(true);
    setFilterData(values);
    fetch({ pagination: defaultPagination }, values);
  }

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      render: (_, record) => {
        if (record.StatusID === 2) {
          return record.ID;
        } else {
          return <span style={{ color: 'red' }}>{record.ID}</span>
        }
      }
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      key: "Date",
      sorter: true,
    },
    {
      title: t("BeginDate"),
      dataIndex: "BeginDate",
      key: "BeginDate",
      sorter: true,
    },
    {
      title: t("endDate"),
      dataIndex: "EndDate",
      key: "EndDate",
      sorter: true,
      width: 100
    },
    {
      title: t("personnelNumber"),
      dataIndex: "PersonnelNumber",
      key: "PersonnelNumber",
      sorter: true,
      width: 110
    },
    {
      title: t("FullName"),
      dataIndex: "FullName",
      key: "FullName",
      sorter: true,
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      sorter: true,
      render: (_, record) => {
        if (record.StatusID === 2) {
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
      title: t("SubcName"),
      dataIndex: "SubcName",
      key: "SubcName",
      sorter: true,
      // width: 100
    },
    {
      title: t("Sum"),
      dataIndex: "Sum",
      align: 'right',
      key: "Sum",
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("DivName"),
      dataIndex: "DivName",
      key: "DivName",
      sorter: true,
      width: 150
    },
    {
      title: t("DprName"),
      dataIndex: "DprName",
      key: "DprName",
      sorter: true,
    },
    {
      title: t("SettleCode"),
      dataIndex: "SettleCode",
      key: "SettleCode",
      sorter: true,
    },
    {
      title: t("Comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
    },
  ];

  return (
    <Modal
      title={t("LeavePay")}
      visible={props.visible}
      okText={t("select")}
      cancelText={t("cancel")}
      onOk={closeModalHandler}
      onCancel={props.onCancel}
      width={1200}
    >
      <Form
        layout="vertical"
        form={filterForm}
        onFinish={onFilterFormFinish}
        initialValues={{
          EndDate: moment().add(30, "days"),
          StartDate: moment().subtract(30, "days"),
        }}
      >
        <Space size='middle' align="end">
          <Form.Item name="filterType">
            <Select
              allowClear
              style={{ width: 180 }}
              placeholder={t("filterType")}
              onChange={filterTypeHandler}
            >
              <Option value="ID">{t('id')}</Option>
              <Option value="PersonnelNumber">{t('personnelNumber')}</Option>
              <Option value="Search">{t('FullName')}</Option>
            </Select>
          </Form.Item>

          <Form.Item name="Search">
            <Input.Search
              enterButton
              placeholder={t("search")}
              onSearch={search}
            />
          </Form.Item>

          <Form.Item
            name="StartDate"
            label={t("startDate")}>
            <DatePicker format="DD.MM.YYYY" />
          </Form.Item>

          <Form.Item
            name="EndDate"
            label={t("endDate")}>
            <DatePicker format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <i className="feather icon-refresh-ccw" />
            </Button>
          </Form.Item>
        </Space>
      </Form>

      <Table
        bordered
        size='middle'
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        onChange={handleTableChange}
        rowKey={(record) => record.ID}
        rowClassName={setRowClassName}
        showSorterTooltip={false}
        onRow={(record) => onRowHandler(record)}
        scroll={{
          x: "max-content",
          y: "40vh",
        }}
        pagination={{
          ...tablePagination,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
        }}
      />
    </Modal >
  )
}

export default LeavePayModal;