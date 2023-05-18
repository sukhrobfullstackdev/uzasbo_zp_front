import React, { useEffect, useState } from 'react'
import { Button, Card, Form,Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link, useLocation } from 'react-router-dom';

import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';
import TableData from './components/TableData';

const { Option } = Select;

const AppointQualCategory = ({match}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();

    const appointQualCategoryList = useSelector((state) => state.appointQualCategoryList);

    let tableData = appointQualCategoryList.listSuccessData?.rows;
    let total = appointQualCategoryList.listSuccessData?.total;
    let pagination = appointQualCategoryList?.paginationData;
    let filter = appointQualCategoryList?.filterData;

    const [filterType, setFilterType] = useState(appointQualCategoryList.filterType);
    const [filterValue, setFilterValue] = useState(appointQualCategoryList.filterData[`${filterType}`]);

    function filterTypeHandler(value) {
        setFilterType(value);
    };


    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter]);

    const onSearch = (Search) => {
        dispatch(setListFilterType({
            filterType: filterType,
        }));
        dispatch(setListFilter({
            [filterType]: Search,
        }));
    };

    return (
        <Card title={t("AppointQualCategory")}>
            <Fade>
                <div className="table-top">
                    <Form
                        className='table-filter-form'
                        // onFinish={onFinish}
                        initialValues={{
                            filterType: filterType,
                            search: filterValue,
                        }}
                    >
                        <div className="main-table-filter-elements">
                            <Form.Item
                                name="filterType"
                            // label={t("Filter Type")}
                            >
                                <Select
                                    value={filterType}
                                    allowClear
                                    style={{ width: 180 }}
                                    placeholder={t("Filter Type")}
                                    onChange={filterTypeHandler}
                                >
                                    <Option value="ID">{t('id')}</Option>
                                    <Option value="Year">{t('Year')}</Option>
                                    <Option value="Code">{t('Code')}</Option>
                                    <Option value="Search">{t('Search')}</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                // label={t("search")}
                                name="Search"
                            >
                                <Input.Search
                                    className="table-search"
                                    placeholder={t("search")}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>

                            <Button
                                type="primary"
                            // onClick={handleClearParams}
                            >
                                <i className="feather icon-refresh-ccw" />
                            </Button>

                            <Button type="primary" disabled>
                                <Link to={`${location.pathname}/add`}>
                                    {t("add-new")}&nbsp;
                                    <i className="feather icon-plus" aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                    </Form>
                </div>
            </Fade>

            <Fade>
                <TableData tableData={tableData} total={total} match={match} />
            </Fade>
        </Card>
    )
}

export default AppointQualCategory; 