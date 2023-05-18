import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Form, Button, Select } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import MainCard from "../../../../components/MainCard";

const { Option } = Select;

const SubAcc = ({ match }) => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const dispatch = useDispatch();

    const tableList = useSelector((state) => state.SubAccList);

    let tableData = tableList.listSuccessData?.rows;
    let total = tableList.listSuccessData?.total;
    let pagination = tableList?.paginationData;
    let filter = tableList?.filterData;

    const [filterType, setFilterType] = useState(tableList?.filterType);

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const filterTypeHandler = (value) => {
        setFilterType(value);
    }

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        dispatch(setListFilter({
            [values?.filterType]: values?.Search
        }));
    };

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                onFinish(values);
            })
    };

    return (
        <MainCard title={t("SubAcc")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        ...filter,
                        filterType: filterType,
                    }}
                >
                    <div className="main-table-filter-wrapper">
                        <Form.Item
                            name="filterType"
                        >
                            <Select
                                allowClear
                                style={{ width: 180, marginBottom: 0 }}
                                placeholder={t("Filter Type")}
                                onChange={filterTypeHandler}
                            >
                                <Option value="ID">{t('id')}</Option>
                                <Option value="Search">{t('name')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="Search"
                        >
                            <Input.Search
                                placeholder={t("search")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>
                        
                    </div>
                </Form>
            </Fade>
            <Fade>
                <GetListTable
                    tableData={tableData} total={total} match={match}
                    tableList={tableList}
                />
            </Fade>
        </MainCard >
    )
}

export default React.memo(SubAcc);