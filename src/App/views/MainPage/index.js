import React from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import AcceptModal from './AcceptModal';
import Card from '../../components/MainCard';
// import AntdDonutChart from './AntdDonutChart';
import EmployeStatistics from './EmployeStatistics';
import PhoneStatistics from './PhoneStatistics';
import Calendar from './Calendar';
// import YoutubeLinks from '../../../App/views/MainPage/YoutubeLinks';
import Errors from './Errors';
// import Snowflakes from '../../components/Snowflakes';
// import LineChart from "./LineChart";
// import BarDiscreteChart from "./BarDiscreteChart";
// import MultiBarChart from "./MultiBarChart";
// import DrillDown from "./DrillDown/DrillDown";
// import DrillDownRechart from "./DrillDown/DrillDownRechart";
// import PieDonutChart from "./PieDonutChart";
// import CumulativeLineChart from "./CumulativeLineChart";

const Dashboard = () => {
  const { t } = useTranslation();
  // const militaryRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('MilitaryPlasticCardUpload');
  // const adminRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

  return (
    <>
      {/* {!(militaryRole || adminRole) &&
        <AcceptModal />
      } */}
       {/* <AcceptModal /> */}
      {/* <Snowflakes/> */}
      <Row gutter={16}>
        <Col sm={24} lg={12} style={{ marginBottom: 16 }}>
          <Card title={t("employeeStatus")}>
            <EmployeStatistics />
          </Card>
        </Col>
        <Col sm={24} lg={12} style={{ marginBottom: 16 }}>
          <Card title={t("PhoneNumbers")}>
            <PhoneStatistics />
          </Card>
        </Col>
        {/* <Col span={12}>
            <YoutubeLinks />
        </Col> */}
       
        <Col sm={24} lg={12} style={{ marginBottom: 16 }}>
          <Calendar />
        </Col>
        <Col sm={24} lg={12} style={{ marginBottom: 16 }}>
          <Errors />
        </Col>
        {/* <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('Ташкилотлар ҳаражатлари')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <DrillDownRechart />
            </Card.Body>
          </Card>
        </Col> */}

        {/* <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('DashboardOrgInfo')}</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              <PieDonutChart />
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('getSalaryDashboardInfo')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <MultiBarChart />
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('minSalaryInfos')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <BarDiscreteChart />
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">{t("Pie Basic Chart")}</Card.Title>
              </Card.Header>
              <Card.Body className="text-center">
                <PieBasicChart />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">{t("Line Chart")}</Card.Title>
              </Card.Header>
              <Card.Body>
                <LineChart />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">CumulativeLineChart</Card.Title>
              </Card.Header>
              
              <Card.Body>
                <CumulativeLineChart />
              </Card.Body>
            </Card>
          </Col>
          */}
      </Row>
    </>
  );
}

export default Dashboard;


