import { Button, Form, Input, InputNumber, Modal, Select, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import HelperServices from '../../../../../../services/Helper/helper.services';
import { getListStartAction, setListFilter, setListPagination } from '../../TPSubCalculationKind/_redux/getListSlice';

const { Option } = Select;

const TPSubCalculationKindModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();

    const columns = [
        {
            title: t("ID"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 60
        },

        {
            title: t("Vish"),
            dataIndex: "Vish",
            key: "Vish",
            sorter: true,
            width: 150
        },
        {
            title: t("DpName"),
            dataIndex: "DpName",
            key: "DpName",
            sorter: true,
            width: 150
        },
        {
            title: t("SubCalcName"),
            dataIndex: "SubCalcName",
            key: "SubCalcName",
            sorter: true,
            width: 150
        },
        {
            title: t("NormativeAct"),
            dataIndex: "NormativeAct",
            key: "NormativeAct",
            sorter: true,
            width: 150
        },
        {
            title: t("ShortNameUzb"),
            dataIndex: "ShortNameUzb",
            key: "ShortNameUzb",
            sorter: true,
            width: 80
        },
        {
            title: t("ShortNameRus"),
            dataIndex: "ShortNameRus",
            key: "ShortNameRus",
            sorter: true,
            width: 80
        },
        {
            title: t('Status'),
            dataIndex: 'Status',
            key: 'Status',
            width: '12%',
            render: (status) => {
                if (status === "Актив") {
                    return (<Tag color="#87d068" key={status}>{status}</Tag>)
                } else if (status === "Пассив") {
                    return (<Tag color="#f50" key={status}>{status}</Tag>)
                }
            }
        },
    ];

    const [rowData, setRowData] = useState(null);

    const tpSubcalcKindList = useSelector((state) => state.tpSubcalcKindList);
    let loading = tpSubcalcKindList?.listBegin;

    let tableData = tpSubcalcKindList.listSuccessData?.rows;
    let total = tpSubcalcKindList.listSuccessData?.total;
    let pagination = tpSubcalcKindList?.paginationData;
    let filter = tpSubcalcKindList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter, dispatch]);

    const [loader, setLoader] = useState(true);
    const [orgTypeList, setOrgTypeList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [orgTypeList] = await Promise.all([
                HelperServices.GetAllOrganizationType(),
            ]);
            setOrgTypeList(orgTypeList.data);
        }
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, []);

    const selectRow = () => {
        props.onSelect(rowData);
        if (rowData !== null) {
            props.onCancel();
        }
    };

    const setRowClassName = (record) => {
        return record.ID === rowData?.ID ? 'table-row clicked-row' : 'table-row';
    };

    const getList = (values) => {
        dispatch(setListFilter({
            ID: values?.ID,
            TypeID: values?.TypeID,
            Search: values?.Search,
        }));
    };

    function handleTableChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        const { field, order } = sorter;
        // console.log(field, order?.slice(0, -3));

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );

    };

    const onFinish = () => {
        filterForm.validateFields()
            .then(values => {
                getList(values);
            });
    };

    return (
        <Modal
            width={1190}
            title={t("SubCalculationKind")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    disabled={!rowData}
                    type="primary"
                    onClick={selectRow}
                >
                    {t("select")}
                </Button>,
            ]}
        >
            <Form
                className='table-filter-form'
                form={filterForm}
                // onFinish={onFinish}
                initialValues={{
                    ID: filter?.ID,
                    TypeID: filter?.TypeID,
                    Search: filter?.Search,
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form.Item name="TypeID" style={{ marginRight: 16 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder={t("OrgType")}
                            style={{ width: 150 }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {orgTypeList.map((item) => (
                                <Option key={item.ID} value={item.ID}>
                                    {item.DisplayName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        // label={t('id')}
                        name="ID"
                        style={{ marginRight: 16 }}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder={t('id')}
                            onPressEnter={onFinish}
                        />
                    </Form.Item>
                    <Form.Item
                        // label={t('name')}
                        name="Search"
                    >
                        <Input.Search
                            enterButton
                            onSearch={onFinish}
                            placeholder={t('name')}
                        />
                    </Form.Item>
                </div>
            </Form>

            <Table
                bordered
                size="middle"
                rowClassName={setRowClassName}
                className="main-table mt-4"
                columns={columns}
                dataSource={tableData}
                loading={loading}
                onChange={handleTableChange}
                rowKey={record => record.ID}
                showSorterTooltip={false}
                pagination={{
                    pageSize: Math.ceil(tableData?.length / 10) * 10,
                    total: total,
                    current: pagination.PageNumber,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
                scroll={{
                    x: "max-content",
                    y: "50vh",
                }}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => {
                            props.onSelect({
                                ID: record.ID, NameValue: record.Vish, Price: record.Price,
                                id: props.params.ID, Name: props.params.Name,
                            });
                            props.onCancel();
                        },
                        onClick: () => {
                            setRowData({
                                ID: record.ID, NameValue: record.Vish, Price: record.Price,
                                id: props.params.ID, Name: props.params.Name
                            });
                        },
                    };
                }}
            />
        </Modal>
    )
}

export default React.memo(TPSubCalculationKindModal);