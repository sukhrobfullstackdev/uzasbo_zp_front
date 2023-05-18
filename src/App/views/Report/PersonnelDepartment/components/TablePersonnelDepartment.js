import React, { useEffect } from 'react';
import { Space, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setListPagination } from '../_redux/personnelDepartmentSlice';
import { useHistory } from 'react-router-dom';
import { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import classes from "../../../References/Organizational/Employee/Employee.module.scss";
import { Notification } from '../../../../../helpers/notifications';

const TablePersonnelDepartment = ({tableData, total}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const loading = useSelector((state) => state.personnelDepartmentList?.listBegin);
    const pagination = useSelector((state) => state.personnelDepartmentList?.paginationData);

    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const columns = [
        {
            title: t("DocReception"),
            dataIndex: "DocumentID",
            key: "DocumentID",
            sorter: true,
            width: 120
        },
        {
            title: t("Code"),
            dataIndex: "employeeID",
            key: "employeeID",
            sorter: true,
            width: 100,
            render: (record, fullRecord) => {
                if (fullRecord?.DateOfDismissal !== null) {
                    return (
                        <div className="text-danger">{record}</div>
                    )
                } else {
                    return (
                        <div className="">{record}</div>
                    )
                }
            }
        },
        {
            title: t("personnelNumber"),
            dataIndex: "PersonnelNumber",
            key: "PersonnelNumber",
            sorter: true,
            width: 100,
            render: (record, fullRecord) => {
                if (fullRecord?.DateOfDismissal !== null) {
                    return (
                        <div className="text-danger">{record}</div>
                    )
                } else {
                    return (
                        <div className="">{record}</div>
                    )
                }
            }
        },
        {
            title: t("FullName"),
            dataIndex: "FullName",
            key: "FullName",
            sorter: true,
            width: 250  ,
            render: record => <div className="ellipsis-1">{record}</div>
        },
        {
            title: t("Phone"),
            dataIndex: "PhoneNumber",
            key: "PhoneNumber",
            sorter: true,
            width: 150
        },
        {
            title: t("PositionName"),
            dataIndex: "ListOfPosition",
            key: "ListOfPosition",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-1">{record}</div>
        },
        {
            title: t("isCheckedPerson"),
            dataIndex: "IsChecked",
            key: "IsChecked",
            sorter: true,
            align: 'center',
            width: 110,
            render: record => record ?
                <CheckCircleOutlined className={classes['valid-person-icon']} /> :
                <QuestionCircleOutlined className={classes['invalid-person-icon']} />
        },
        // {
        //     title: t("Sum"),
        //     dataIndex: "Sum",
        //     key: "Sum",
        //     width: 100,
        //     sorter: true,
        // },
        {
            title: t("DepartmentName"),
            dataIndex: "DepartmentName",
            key: "DepartmentName",
            width: 150,
            sorter: true,
            render: record => <div className="ellipsis-1">{record}</div>
        },
        {
            title: t("EnrolmentType"),
            dataIndex: "EnrolmentType",
            key: "EnrolmentType",
            width: 150,
            sorter: true,
        },
        {
            title: t("DateOfReception"),
            dataIndex: "DateOfReception",
            key: "DateOfReception",
            width: 100,
            sorter: true,
        },
        {
            title: t("DateOfDismissal"),
            dataIndex: "DateOfDismissal",
            key: "DateOfDismissal",
            width: 100,
            sorter: true,
        },
        {
            title: t("Rate"),
            dataIndex: "Rate",
            key: "Rate",
            width: 100,
            sorter: true,
        },
        {
            title: t("TeachingLoad"),
            dataIndex: "TeachingLoad",
            key: "TeachingLoad",
            width: 100,
            sorter: true,
        },
        {
            title: t("WorkLoad"),
            dataIndex: "WorkLoad",
            key: "WorkLoad",
            width: 100,
            sorter: true,
        },
        {
            title: t("WorkSchedule"),
            dataIndex: "WorkSchedule",
            key: "WorkSchedule",
            width: 150,
            sorter: true,
        },
        {
            title: t("personalAccount"),
            dataIndex: "Code",
            key: "Code",
            width: 120,
            sorter: true,
        },
        {
            title: t("INPSCode"),
            dataIndex: "INPSCode",
            key: "INPSCode",
            width: 120,
            sorter: true,
        },
        {
            title: t("PlasticCardUzCard"),
            dataIndex: "PlasticCardNumber",
            key: "PlasticCardNumber",
            width: 120,
            sorter: true,
        },
        {
            title: t("PlasticCardHumo"),
            dataIndex: "PlasticCardNumberHumo",
            key: "PlasticCardNumberHumo",
            width: 120,
            sorter: true,
        },
        // {
        //     title: t("actions"),
        //     key: "action",
        //     align: "center",
        //     fixed: 'right',
        //     width: 80,
        //     render: (record) => {
        //         return (
        //             <Space size="middle">
        //                 <Tooltip title={t("approve")}>
        //                     <span onClick={() => console.log(record.ID)}>
        //                         <i className="feather icon-printer action-icon" />
        //                     </span>
        //                 </Tooltip>
        //             </Space>
        //         );
        //     },
        // },
    ];

    function handleTableChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
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

    return (
        <>
            <Table
                bordered
                size='middle'
                columns={columns}
                dataSource={tableData}
                loading={loading || confirmLoading}
                onChange={handleTableChange}
                rowKey={(record) => record.DocumentID}
                rowClassName="table-row"
                className="main-table"
                showSorterTooltip={false}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={{
                    pageSize: Math.ceil(tableData?.length / 10) * 10,
                    total: total,
                    current: pagination.PageNumber,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
                // footer={(record) => {
                //     return (
                //         <div style={{ textAlign: 'end' }}>{t('total')}: {record?.length}</div>
                //     )
                // }}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => {
                            history.push(`Employee/edit/${record.employeeID}`);
                        },
                    };
                }}
            />
        </>
    );
};

export default TablePersonnelDepartment;