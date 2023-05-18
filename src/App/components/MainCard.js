import React from 'react';
import { Card, Space, Typography } from 'antd';
import { useTranslation } from "react-i18next";
import { CheckCircleFilled, QuestionCircleFilled } from '@ant-design/icons';

import classes from './MainCard.module.css';
import student1 from '../../assets/images/user/student-cap-g.png';
import student2 from '../../assets/images/user/student-cap-o.png';

const { Title, Text, Paragraph } = Typography;

const MainCard = (props) => {
  const OrgTypeID = JSON.parse(localStorage.getItem('userInfo')).OrgTypeID;
  const { t } = useTranslation();
  let cardHeaderRight, cardHeader;

  if (props?.isOption) {
    cardHeaderRight = (
      <div className="card-header-right">
        <Text
          // mark
          strong
          underline
          className='highlighted-text'
          type="primary"
          style={{ height: 25, margin: 15 }}
        >
          {t('Minimal Salary')}: {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(props.minimalSalary.data)}
        </Text>

        <Text
          strong
          underline
          className='highlighted-text'
          type="primary"
          style={{ height: 25, marginTop: 50 }}
        >
          {t('Salary')}: {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(props.EmployeeEnrolment.Salary)}
        </Text>
      </div>
    );
  }

  cardHeader = (
    <>
      <Space align='end'>
        <Title level={4} className={classes.title}>{props.title}</Title>
        {props.employee &&
          props.employee.ID !== 0 ?
          <Paragraph className={classes['emp-fio']}>
            {props.employee.FullName}&nbsp;
            {props.employee.IsChecked === false && <QuestionCircleFilled className={classes['invalid-person-icon']} />}
            {props.employee.IsChecked === true && <CheckCircleFilled className={classes['valid-person-icon']} />}&nbsp;
            {/* props.employee.IsChecked === true && props.employee.EmployeeTypeID === 3 */}
            {((OrgTypeID === 9 || OrgTypeID === 15) && <>
              {(props.employee.IsCheckedHemis === true) ? (
                <img src={student1} width={24} height={24} alt='student checked' />
              ) : (
                <img src={student2} width={24} height={24} alt='student not checked' />
              )}
            </>)}
          </Paragraph> :
          ''
        }
      </Space>
      {cardHeaderRight}
    </>
  );

  return (
    <Card
      title={cardHeader}
      className='card'
      bordered={false}
    >
      {props.children}
    </Card>
  );
}

export default MainCard;
