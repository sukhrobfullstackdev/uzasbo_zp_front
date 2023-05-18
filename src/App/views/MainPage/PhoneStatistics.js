import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Spin, Statistic } from 'antd';

import { setListFilter } from '../../../App/views/Report/PersonnelDepartment/_redux/personnelDepartmentSlice';
import DashboardServices from '../../../services/Dashboard/dashboard.services';
import { Notification } from '../../../helpers/notifications';

const PhoneStatistics = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [statistics, setStatistics] = useState({
    WithPhoneNumber: 0, WithoutPhoneNumber: 0, Total: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const statistics = await DashboardServices.getPhoneNumberList();
    setStatistics(statistics.data[0]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData().catch(err => {
      setLoading(false);
      Notification('error', err);
    });
  }, []);

  // const getChecked = () => {
  //   dispatch(setListFilter({
  //     showWithoutPhoneNumber: false,
  //   }));
  // };

  const getNotChecked = () => {
    dispatch(setListFilter({
      showWithoutPhoneNumber: true,
    }));
  };

  return (
    <Spin spinning={loading} size="large" >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{ flex: 1, textAlign: 'center' }}
        // to={`/PersonnelDepartment`}
        >
          <Statistic
            valueStyle={{ color: 'dodgerblue' }}
            title={t("totalEmployees")}
            value={statistics.TotalWorking}
            prefix={<i className="feather icon-users mr-1" />}
          />
        </div>
        <div
          style={{ flex: 1, textAlign: 'center' }}
        // onClick={getChecked}
        // to={`/PersonnelDepartment`}
        >
          <Statistic
            valueStyle={{ color: 'lightseagreen' }}
            title={t("Сотрудники с тел. номерами")}
            value={statistics.WithPhoneNumber}
            prefix={<i className="feather icon-check-circle mr-1" />}
          />
        </div>
        <Link
          style={{ flex: 1, textAlign: 'center' }}
          onClick={getNotChecked}
          to={`/PersonnelDepartment`}
        >
          <Statistic
            valueStyle={{ color: '#DC143C' }}
            title={t("Сотрудники без тел. номера")}
            value={statistics.WithoutPhoneNumber}
            prefix={<i className="feather icon-help-circle mr-1" />}
          />
        </Link>
      </div>
    </Spin >
  )
}

export default PhoneStatistics;