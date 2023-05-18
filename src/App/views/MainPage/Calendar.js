import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as AntdCalendar, Select, Col, Row, Typography, Spin, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Card from '../../components/MainCard';
import WorkScheduleApis from '../../../services/WorkSchedule/workSchedule';
import { Notification } from '../../../helpers/notifications';

const { Text } = Typography;
const { Option } = Select;

let disabledDays = [];

const Calendar = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [scheduleList, setScheduleList] = useState([]);
  const [scheduleData, setScheduleData] = useState({ Tables: [], TotalTable: [] });

  useEffect(() => {
    const fetchData = async () => {
      const [initialDate, workScheduleLs] = await Promise.all([
        WorkScheduleApis.getDate({
          id: '27464',
          year: moment().format('YYYY'),
          month: moment().format('MM')
        }),
        WorkScheduleApis.getWorkScheduleList(),
      ]);

      initialDate.data.Tables.forEach(item => {
        if (item.ByHours === 0) {
          disabledDays.push(item.Date);
        }
      })

      setScheduleData(initialDate.data);
      setScheduleList(workScheduleLs.data);
      setLoading(false);
    }
    fetchData().catch(err => {
      Notification('error', err);
      setLoading(false);
    })
  }, [])

  const disabledDate = (current) => disabledDays.includes(current.format('DD.MM.YYYY'));

  const dateCellRender = useCallback((current) => {
    return (
      <div>
        {scheduleData.Tables.map((item, index) => {
          if (item.Date === current.format("DD.MM.YYYY")) {
            if (item.ByHours === 0) {
              return ''
            }
            return <Text key={index} underline type="success">{`${item.ByHours} ${t('hour')}`}</Text>
          }
          return '';
        })}
      </div>
    );
  }, [scheduleData, t])

  const getDate = (id, year, month) => {
    WorkScheduleApis.getDate({
      id: id.toString(),
      year: year.toString(),
      month: (+month + 1).toString()
    })
      .then(res => {
        disabledDays = [];
        res.data.Tables.forEach(item => {
          if (item.ByHours === 0) {
            disabledDays.push(item.Date);
          }
        })

        setScheduleData(res.data);
        setLoading(false);
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      })
  }

  const scheduleListChangeHandler = useCallback(() => {
    const formValues = form.getFieldsValue();
    setLoading(true);
    getDate(formValues.id, formValues.year, formValues.month)
  }, [form])

  const headerHandler = ({ value, type, onChange }) => {
    const start = 0;
    const end = 12;
    const monthOptions = [];

    const current = value.clone();
    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i++) {
      current.month(i);
      months.push(localeData.monthsShort(current));
    }

    for (let index = start; index < end; index++) {
      monthOptions.push(
        <Select.Option className="month-item" key={`${index}`}>
          {months[index]}
        </Select.Option>,
      );
    }
    const month = value.month();

    const year = value.year();
    const curYear = +moment().format('YYYY');
    const options = [];
    for (let i = curYear - 3; i < curYear + 2; i += 1) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>,
      );
    }
    return (
      <div style={{ paddingBottom: 8 }}>
        <Form
          form={form}
          initialValues={{
            id: '27464',
            month: String(month),
            year: String(year)
          }}
        >
          <Row gutter={8}>
            <Col>
              <Form.Item name='id'>
                <Select
                  onChange={scheduleListChangeHandler}
                  placeholder={t('scheduleList')}
                  style={{ width: 200 }}
                // defaultValue='27464'
                >
                  {scheduleList.map(item => <Option key={item.ID}>{item.Name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name='month'>
                <Select
                  style={{ width: 80 }}
                  onChange={selectedMonth => {
                    const newValue = value.clone();
                    newValue.month(parseInt(selectedMonth, 10));
                    onChange(newValue);
                  }}
                >
                  {monthOptions}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name='year'>
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: 80 }}
                  filterOption={(input, option) =>
                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={newYear => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                >
                  {options}
                </Select>
              </Form.Item>
            </Col>
            <Col style={{ fontSize: '16px' }}>
              <div>
                <span>{t('totalWorkingDays')}: <span style={{ fontWeight: 'bold' }}>{scheduleData.TotalTable[0]?.TotalDays}</span>, </span>
                <span>{t('totalWorkingHours')}: <span style={{ fontWeight: 'bold' }}>{scheduleData.TotalTable[0]?.TotalHours}</span></span>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  const onPanelChange = (value) => {
    setLoading(true);
    form.setFieldsValue({
      month: String(value.month()),
      year: String(value.format('YYYY'))
    })

    getDate(form.getFieldValue('id'), value.format('YYYY'), value.month())
  }

  return (
    <Card title={t("workingHoursCalendar")}>
      <Spin size='large' spinning={loading}>
        <AntdCalendar
          className='holidays-calendar'
          disabledDate={disabledDate}
          dateCellRender={dateCellRender}
          headerRender={headerHandler}
          onPanelChange={onPanelChange}
        />
      </Spin>
    </Card>
  );
};

export default Calendar;