import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useTranslation } from 'react-i18next';

import DistributionOfLessonHoursServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/DistributionOfLessonHours.services";
import { Notification } from '../../../../../../helpers/notifications';

const ExpandedRow = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (props.expanded) {
      setLoading(true);
      DistributionOfLessonHoursServices.getExpandedRow(props.record.ID)
        .then(res => {
          if (res.status === 200) {
            setTableData(res.data);
            setLoading(false);
          }
        })
        .catch(err => {
          setLoading(false);
          Notification('error', err);
        })
    }
  }, [props.record.ID, props.expanded])

  const columns = [
    {
      title: t('SubjectName'),
      dataIndex: 'SubjectName',
      key: 'SubjectName'
    },
    {
      title: t('positionQualificationName'),
      dataIndex: 'PositionQualificationName',
      key: 'PositionQualificationName'
    },
    {
      title: t('ClassTitleTableName'),
      dataIndex: 'ClassTitleTableName',
      key: 'ClassTitleTableName'
    },
    {
      title: t('Hours'),
      dataIndex: 'Hours',
      key: 'Hours'
    },
    {
      title: t('ChildrenCount'),
      dataIndex: 'ChildrenCount',
      key: 'ChildrenCount'
    },
    {
      title: t('teachingAtHomeHours'),
      dataIndex: 'TeachingAtHomeHours',
      key: 'TeachingAtHomeHours'
    },
    {
      title: t('teachingAtHomeChildrenCount'),
      dataIndex: 'TeachingAtHomeChildrenCount',
      key: 'TeachingAtHomeChildrenCount'
    },
    {
      title: t('positionQualificationExpireDate'),
      dataIndex: 'PositionQualificationExpireDate',
      key: 'PositionQualificationExpireDate'
    },
  ];

  return (
    <Table
      size='small'
      rowClassName="table-row"
      className="main-table"
      bordered
      rowKey={(record) => record.ID}
      columns={columns}
      dataSource={tableData}
      loading={loading}
      pagination={false}
    />
  );
};

export default React.memo(ExpandedRow);