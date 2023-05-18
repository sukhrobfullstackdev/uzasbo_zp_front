import React, { useEffect, useState } from 'react'
import { Spin, Statistic } from 'antd'
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import DashboardServices from '../../../services/Dashboard/dashboard.services';
import { setListFilter } from '../../../App/views/Report/PersonnelDepartment/_redux/personnelDepartmentSlice';

const EmployeStatistics = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [statistics, setStatistics] = useState({ Verified: 0, Unverified: 0 });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const statistics = await DashboardServices.getVerifiedPersonList();
        setStatistics(statistics.data[0]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getChecked = () => {
        dispatch(setListFilter({
            isChecked: 'true',
        }));
    };

    const getNotChecked = () => {
        dispatch(setListFilter({
            isChecked: 'false',
        }));
    };

    return (
        <Spin spinning={loading} size="large" >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link style={{ flex: 1, textAlign: 'center' }} to={`/PersonnelDepartment`}>
                    <Statistic
                        valueStyle={{ color: 'dodgerblue' }}
                        title={t("totalEmployees")}
                        value={statistics.TotalWorking}
                        prefix={<i className="feather icon-users mr-1" />}
                    />
                </Link>
                <Link
                    style={{ flex: 1, textAlign: 'center' }}
                    onClick={getChecked}
                    to={`/PersonnelDepartment`}
                >
                    <Statistic
                        valueStyle={{ color: 'lightseagreen' }}
                        title={t("checkedEmployees")}
                        value={statistics.Verified}
                        prefix={<i className="feather icon-check-circle mr-1" />}
                    />
                </Link>
                <Link
                    style={{ flex: 1, textAlign: 'center' }}
                    onClick={getNotChecked}
                    to={`/PersonnelDepartment`}
                >
                    <Statistic
                        valueStyle={{ color: '#DC143C' }}
                        title={t("notCheckedEmployees")}
                        value={statistics.Unverified}
                        prefix={<i className="feather icon-help-circle mr-1" />}
                    />
                </Link>
            </div>
        </Spin >
    )
}

export default EmployeStatistics;