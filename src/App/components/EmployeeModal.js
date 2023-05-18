import React, { Component } from "react";
import { Modal, Form, Select, Input, Table, Space } from "antd";
import { withTranslation } from "react-i18next";

//import HelperServices from "../../../services/Helper/helper.services";
import  EmployeeServices from "../../../services/References/Organizational/Employee/employee.services";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 50,
}

class EmployeeModal extends Component {
  state = {
    tableData: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    filterParam: '',
    filterType: '',
    empData: {}
  };
  empFormRef = React.createRef();

  componentDidMount() {
    const { pagination, filterParam } = this.state;
    this.fetch({ pagination }, filterParam);
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    },
      this.state.filterParam
    );
  };

  fetch = (params = {}, filterValue) => {
    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder,
      filterType = this.state.filterType;

      EmployeeServices.GetWorkingEmployeesNoParameterList(pageNumber, pageLimit, sortColumn, orderType, this.props.divisionId, this.props.departmentId, filterType, filterValue)
      .then((res) => {
        this.setState({
          loading: false,
          tableData: res.data.rows,
          pagination: {
            ...params.pagination,
            total: res.data.total,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  search = (value) => {
    this.setState({ loading: true, filterParam: value.trim() });
    this.fetch({ pagination: defaultPagination }, value.trim());
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  setRowClassName = (record) => {
    return record.EnrolmentDocumentID === this.state.rowId ? 'table-row clicked-row' : 'table-row';
  }

  closeModalHandler = () => {
    const { name, id, enrolmentDocumentID } = this.state.empData
    this.props.getModalData(name, id, enrolmentDocumentID);
    this.props.onCancel();
  }

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t('EnrolmentDocumentID'),
        dataIndex: "EnrolmentDocumentID",
        key: "EnrolmentDocumentID",
        sorter: true,
      },
      {
        title: t('personnelNumber'),
        dataIndex: "PersonnelNumber",
        key: "PersonnelNumber",
        sorter: true,
        width: 250
      },
      {
        title: t('FullName'),
        dataIndex: "FullName",
        key: "FullName",
        sorter: true,
      },
      {
        title: t('PositionName'),
        dataIndex: "PositionName",
        key: "PositionName",
        sorter: true,
      },
      {
        title: t("SettleCode"),
        dataIndex: "SettleCode",
        key: "SettleCode",
        sorter: true,
      },
      {
        title: t("EnrolmentType"),
        dataIndex: "EnrolmentType",
        key: "EnrolmentType",
        sorter: true,
      },
      {
        title: t("DateOfReception"),
        dataIndex: "DateOfReception",
        key: "DateOfReception",
        sorter: true,
        width: 150
      },
      {
        title: t("DateOfDismissal"),
        dataIndex: "DateOfDismissal",
        key: "DateOfDismissal",
        sorter: true,
        width: 150
      },
      {
        title: t("Division"),
        dataIndex: "Division",
        key: "Division",
        sorter: true,
        width: 120,
        render: record => <div className="ellipsis-2">{record}</div>
      },
      {
        title: t("DepartmentName"),
        dataIndex: "DepartmentName",
        key: "DepartmentName",
        sorter: true,
        width: 120
      },
      {
        title: t("WorkScheduleName"),
        dataIndex: "WorkScheduleName",
        key: "WorkScheduleName",
        sorter: true,
      },
    ];

    const { tableData, pagination, loading } = this.state;

    return (
      <Modal
        title={t("Employee")}
        visible={this.props.visible}
        okText={t("select")}
        cancelText={t("cancel")}
        onOk={this.closeModalHandler}
        onCancel={this.props.onCancel}
        width={1200}
      >
        <Form
          ref={this.empFormRef}
        >
          <Space size='middle'>
            <Form.Item name="filterType">
              <Select
                allowClear
                style={{ width: 180 }}
                placeholder={t("filterType")}
                onChange={this.filterTypeHandler}
              >
                <Option value="FullName">{t("name")}</Option>
                <Option value="PersonnelNumber">{t("personnelNumber")}</Option>
              </Select>
            </Form.Item>

            <Form.Item name="Search">
              <Input.Search
                enterButton
                placeholder={t("search")}
                onSearch={this.search}
              />
            </Form.Item>
          </Space>
        </Form>

        <Table
          bordered
          size='middle'
          className="main-table"
          columns={columns}
          dataSource={tableData}
          loading={loading}
          onChange={this.handleTableChange}
          rowKey={(record) => record.EnrolmentDocumentID}
          rowClassName={this.setRowClassName}
          scroll={{
            x: "max-content",
            y: "40vh",
          }}
          pagination={{
            ...pagination,
            showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                this.props.getModalData(record.FullName, record.ID, record.EnrolmentDocumentID);
                this.props.onCancel();
              },
              onClick: () => {
                this.setState({
                  rowId: record.EnrolmentDocumentID,
                  empData: {
                    name: record.FullName,
                    id: record.ID,
                    enrolmentDocumentId: record.EnrolmentDocumentID
                  }
                });
              },
            };
          }}
        />
      </Modal >
    )
  }
}

export default withTranslation()(EmployeeModal);