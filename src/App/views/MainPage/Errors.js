import React, { useState, useEffect } from 'react';
import { Collapse, Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';

import Card from '../../components/MainCard';
import DashboardServices from '../../../services/Dashboard/dashboard.services';
import { Notification } from '../../../helpers/notifications';

const { Panel } = Collapse;

const Errors = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [loading, setLoading] = useState(true);
  const [errorList, setErrorList] = useState([]);
  const [filteredErrorList, setFilteredErrorList] = useState([]);

  useEffect(() => {
    DashboardServices.getErrorList()
      .then(res => {
        setErrorList(res.data.rows);
        setFilteredErrorList(res.data.rows);
        setLoading(false);
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      })
  }, [])

  const onSearch = (e) => {
    const filteredErros = errorList.filter(item => item.Code.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilteredErrorList(filteredErros);
  }

  return (
    <Card title={t("errors")}>
      <Spin spinning={loading}>
        <Input placeholder={`${t('search')} (100101)`} onChange={onSearch} style={{ marginBottom: '15px' }} />
        <Collapse accordion>
          {filteredErrorList.map(item => (
            <Panel
              header={`${item.Code} - ${lang === 'ru' ? item.ErrorNameRus : item.ErrorNameUzb}`}
              key={item.ID}
            >
              <p>
                {lang === 'ru' ? item.DescriptionRus : item.DescriptionUzb}&nbsp;
                <a href={item.Link} target='_blank' rel="noreferrer" style={{ textDecoration: 'underline' }}>{t('more')}</a>
              </p>
            </Panel>
          ))}
        </Collapse>
      </Spin>
    </Card>
  );
};

export default Errors;