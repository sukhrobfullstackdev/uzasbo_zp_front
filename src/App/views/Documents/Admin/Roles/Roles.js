import { Button, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";

import Card from "../../../../components/MainCard";
import TableRoles from './components/TableRoles';
import { getListStartAction, setListFilter, setListFilterType, setListPagination } from './_redux/rolesSlice';
import AddRoleModal from "./components/AddRoleModal";

const { Option } = Select;

const Roles = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const rolesList = useSelector((state) => state.rolesList);

    let tableData = rolesList.listSuccessData?.rows;
    let total = rolesList.listSuccessData?.total;
    let pagination = rolesList?.paginationData;
    let filter = rolesList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const [filterType, setFilterType] = useState(rolesList.filterType || 'Search');
    const [filterValue, setFilterValue] = useState(rolesList.filterData[`${filterType}`]);

    function filterTypeHandler(value) {
        setFilterType(value);
    }

    const onSearchChange = (event) => {
        setFilterValue(event.target.value)
    }

    const onSearch = (Search) => {
        dispatch(setListFilterType({
            filterType: filterType,
        }));
        dispatch(setListFilter({
            [filterType]: Search,
        }));
    };

    function handleClearParams() {
        setFilterType(null);
        setFilterValue('');
        dispatch(setListFilterType({
            filterType: null,
        }));
        dispatch(setListFilter({}));
    };

    return (
        <Card title={t("roles")}>
            <Fade>
                <div className='table-filter-form'>
                    <div className="main-table-filter-elements" style={{ marginBottom: 32 }}>
                        <div className="mb-4 mb-sm-0">
                            <Select
                                value={filterType}
                                allowClear
                                style={{ width: 180, marginBottom: 0 }}
                                placeholder={t("Filter Type")}
                                onChange={filterTypeHandler}
                            >
                                <Option value="id">{t('id')}</Option>
                                <Option value="Search">{t('Name')}</Option>
                            </Select>
                        </div>
                        <div className="mb-3 mb-sm-0">
                            <Input.Search
                                className="table-search"
                                placeholder={t("search")}
                                enterButton
                                onSearch={onSearch}
                                onChange={onSearchChange}
                                value={filterValue}
                            />
                        </div>

                        <Button
                            type="primary"
                            onClick={handleClearParams}
                        >
                            <i className="feather icon-refresh-ccw" />
                        </Button>

                        <AddRoleModal />
                    </div>
                </div>
            </Fade>
            <Fade>
                <TableRoles tableData={tableData} total={total} />
            </Fade>
        </Card>
    )
}

export default Roles;