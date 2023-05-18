import React, { useState } from "react";
import { Table, Space, Dropdown, Menu, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useHistory, Link, useParams } from "react-router-dom";

import { setListPagination } from "../_redux/getListSlice";

const GetListTable = ({ tableData, total, _, tableList, match }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  // const params = useParams;

  const [loading] = useState(false);

  let storeLoading = tableList.listBegin;
  let pagination = tableList.paginationData;
  const adminViewRole = JSON.parse(
    localStorage.getItem("userInfo")
  ).Roles.includes("LimitBySubCalculationKindManage");
  // console.log(
  //   JSON.parse(localStorage.getItem("userInfo")).Roles.includes(
  //     "LimitBySubCalculationKindManage"
  //   ),
  //   "adminRole"
  // );
  // console.log(match, "match");

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      width: 80,
      sorter: (a, b) => a.code - b.code,
    },
    {
      title: t("name"),
      dataIndex: "Name",
      key: "Name",
      width:300,
      sorter: true,
    },
    {
      title: t("NormativeAct"),
      dataIndex: "NormativeAct",
      key: "NormativeAct",
      width: 200,
      sorter: true,
      render: (record) => <div className="ellipsis-2">{record}</div>,
    },
    {
      title: t("Subcalculation"),
      dataIndex: "Subcalculation",
      key: "Subcalculation",
      width: 200,
      sorter: true,
    },
    {
      title: t("LimitType"),
      dataIndex: "LimitType",
      key: "LimitType",
      sorter: true,
    },
    {
      title: t("LimitPeriod"),
      dataIndex: "LimitPeriod",
      key: "LimitPeriod",
      // width: "20%",
      sorter: true,
    },
    {
      title: t("LimitOperType"),
      dataIndex: "LimitOperType",
      key: "LimitOperType",
      width: 150,
      sorter: true,
    },
    {
      title: t("LimitValue"),
      dataIndex: "LimitValue",
      key: "LimitValue",
      width: "10%",
      sorter: true,
    },
    {
      title: t("actions"),
      key: "action",
      fixed: "right",
      align: "center",
      width: 80,
      render: (record) => {
        return (
          <Space size="middle">
            {adminViewRole && (
              <Tooltip title={t("Edit")}>
                <Link to={`${match.path}/edit/${record.ID}`}>
                  <i
                    className="feather icon-edit action-icon"
                    aria-hidden="true"
                  />
                </Link>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

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
  };

  const onTableRow = (record) => {
    return {
      onDoubleClick: () => {
        history.push(`${location.pathname}/edit/${record.ID}`);
      },
    };
  };

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
          y: "50vh",
        }}
        pagination={{
          pageSize: tableData?.length,
          total: total,
          current: pagination.PageNumber,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
        }}
      />
    </>
  );
};

export default GetListTable;
