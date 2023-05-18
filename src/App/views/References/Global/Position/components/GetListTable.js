import React, { useState } from 'react'
import { Table, Tag } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { useLocation, useHistory} from "react-router-dom";

import { setListPagination} from '../_redux/getListSlice';

const GetListTable = ({ tableData, total, match, tableList }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const [loading] = useState(false);

    let storeLoading = tableList.listBegin;
    let pagination = tableList.paginationData;

    const columns = [
        {
          title: t("id"),
          dataIndex: "ID",
          key: "ID",
          sorter: (a, b) => a.code - b.code,
          width: 100
        
        },
        {
          title: t("Code1"),
          dataIndex: "Code1",
          key: "Code1",
          sorter: true,
          width: 100
        },
        {
          title: t("Code2"),
          dataIndex: "Code2",
          key: "Code2",
          sorter: true,
          width: 100
        },
        {
          title: t("Code3"),
          dataIndex: "Code3",
          key: "Code3",
          sorter: true,
          width: 100
        },
        {
          title: t("TotalCode"),
          dataIndex: "TotalCode",
          key: "TotalCode",
          sorter: true,
          width: 150
        },
        {
          title: t("PositionCode"),
          dataIndex: "PositionCode",
          key: "PositionCode",
          sorter: true,
          width: 150
        },
        {
          title: t("PositionNameUzb"),
          dataIndex: "PositionNameUzb",
          key: "PositionNameUzb",
          sorter: true,
          render: record => <div className="ellipsis-2">{record}</div>,
          width: 300
        },
        {
          title: t("PositionNameRus"),
          dataIndex: "PositionNameRus",
          key: "PositionNameRus",
          sorter: true,
          render: record => <div className="ellipsis-2">{record}</div>,
          width: 300
        },
        {
          title: t("PositionCategoryID"),
          dataIndex: "PositionCategoryID",
          key: "PositionCategoryID",
          sorter: true,
          width: 100,
        },
        {
          title: t("PositionGroupType"),
          dataIndex: "PositionGroupType",
          key: "PositionGroupType",
          sorter: true,
          width: 150,
        },
        {
          title: t("Speciality"),
          dataIndex: "Speciality",
          key: "Speciality",
          sorter: true,
          width: 100,
        },
        {
          title: t("StateID"),
          dataIndex: "StateID",
          key: "StateID",
          width: 120,
          render: (status) => {
            if (status === 1) {
              return (
                <Tag color="#87d068" key={status}>
                  {t("active")}
                </Tag>
              );
            } else if (status === 2) {
              return (
                <Tag color="#f50" key={status}>
                  {t("passive")}
                </Tag>
              );
            }
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
    }

    const onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                history.push(`${location.pathname}/edit/${record.ID}`);
            },
        };
    }

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
                    pageSize: tableData?.length,
                    total: total,
                    current: pagination.PageNumber,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />
        </>
    )
}

export default GetListTable;