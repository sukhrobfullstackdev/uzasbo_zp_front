import React from 'react'
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
// import { useLocation, useHistory, Link } from 'react-router-dom';

// import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData }) => {
    const { t } = useTranslation();
    // const dispatch = useDispatch();


    // let loading = reduxList?.listBegin;
    // let pagination = reduxList?.paginationData;

    // const [confirmLoading, setConfirmLoading] = React.useState(false);

    const calcDetailsTableColumns = [
        {
            title: t("FullName"),
            dataIndex: "EmployeeFullName",
            // width: 120,
            align: "center",
        },
        {
            title: t("code"),
            dataIndex: "OrganizationsSettlementAccountCode",
            // width: 100,
            align: "center",
            //   sorter: (a, b) => a.Month.length - b.Month.length,
        },
        {
            title: t("averageSalary"),
            dataIndex: "AvarageDailySum",
            width: 100,
            align: "right",
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("cashDay"),
            dataIndex: "SickDays",
            align: "center",
        },
        {
            title: t("Sum"),
            dataIndex: "SickSum",
            align: "right",
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
    ];


    // function handleTableChange(pagination, _, sorter) {
    //     const { field, order } = sorter;

    //     dispatch(
    //         setListPagination({
    //             OrderType: order?.slice(0, -3),
    //             SortColumn: field,
    //             PageNumber: pagination.current,
    //             PageLimit: pagination.pageSize,
    //         })
    //     );
    // };

    return (
        <>
            <Table
                bordered
                size='middle'
                rowClassName='table-row'
                className="main-table"
                showSorterTooltip={false}
                dataSource={tableData}
                columns={calcDetailsTableColumns}
                rowKey={(record) => record.ID}
                scroll={{
                    // x: "max-content",
                    y: '90vh'
                }}
            />

        </>
    )
}

export default TableData