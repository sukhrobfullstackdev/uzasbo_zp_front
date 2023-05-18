import { Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';

// import { Notification } from '../../../../../helpers/notifications';
import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const { Option } = Select;

const ExperienceContWork = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const calcKindList = useSelector((state) => state.ExperienceContWorkList);

    let tableData = calcKindList.listSuccessData?.rows;
    let total = calcKindList.listSuccessData?.total;
    let pagination = calcKindList?.paginationData;
    let filter = calcKindList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter]);

    const getList = (values) => {
        dispatch(setListFilter({
            ID: values?.ID,
            [`${filterType}`]: values?.Search,
        }));
    };

    const [filterType, setFilterType] = useState(calcKindList.filterType);

    function filterTypeHandler(value) {
        setFilterType(value);
    };

    const onSearch = (Search) => {

        filterForm.validateFields()
            .then(values => {
                console.log(values);
                dispatch(setListFilterType({
                    filterType: filterType,
                }));
                getList(values);
            });
    };

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    return (
        <Card title={t("ExperienceContWork")}>
            <Fade>
                <Form
                    className='table-filter-form'
                    form={filterForm}
                    onFinish={onFinish}
                    initialValues={{
                        ID: filter?.ID,
                        Search: filter?.Search,
                    }}
                >
                    <div className="main-table-filter-elements">
                        <Form.Item name="filterType">
                            <Select
                                allowClear
                                style={{ width: 180, marginBottom: 0 }}
                                placeholder={t("Filter Type")}
                                onChange={filterTypeHandler}
                            >
                                <Option value="ID">{t("id")}</Option>
                                <Option value="Search">{t("name")}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="Search">
                            <Input.Search
                                placeholder={t("name")}
                                enterButton
                                onSearch={onSearch}
                            />
                        </Form.Item>

                        {adminViewRole && (
                            <Form.Item>
                                <Button type="primary" disabled>
                                    <Link to={`${match.path}/add`}>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </Form.Item>
                        )}
                    </div>
                </Form>
            </Fade>

            <Fade>
                <TableData tableData={tableData} total={total} match={match} />
            </Fade>
        </Card>
    )
}

export default React.memo(ExperienceContWork);