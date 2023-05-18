import React from "react";
import { InputNumber, Form } from "antd";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, onEnter, tableForm, ...restProps
}) => {

  const onMissedWorkHoursChangeHandler = (e) => {
    const totalWorkLoad = +e.target.dataset.total;
    // const totalTeachingLoad = +tableForm.getFieldValue('TotalTeachingLoad');
    const initialTotalTeachingLoad = +document.querySelector('#MissedTeachingHours').dataset.total;
    const missedWorkHours = +e.target.value > +e.target.ariaValueMax ? +e.target.ariaValueMax : +e.target.value;
    const teachingLoadHours = +tableForm.getFieldValue('TeachingLoad');
    const workingLoadHours = +tableForm.getFieldValue('WorkLoad');
    const division = (teachingLoadHours / workingLoadHours) * missedWorkHours;
    const missedTeachingHours = +division.toFixed(2);

    if (missedWorkHours === 0) {
      tableForm.setFieldsValue({
        TotalWorkLoad: +e.target.dataset.total,
        TotalTeachingLoad: +initialTotalTeachingLoad,
        MissedTeachingHours: 0,
        Total: +e.target.dataset.total + +initialTotalTeachingLoad
      });
      e.target.dataset.initial = missedWorkHours;
    } else if (missedWorkHours === +e.target.dataset.initial) {
      return;
    } else {
      const totoalWorkLd = +(totalWorkLoad - missedWorkHours).toFixed(2);
      const totalTeachingLd = +(initialTotalTeachingLoad - missedTeachingHours).toFixed(2);
      tableForm.setFieldsValue({
        TotalWorkLoad: totoalWorkLd,
        TotalTeachingLoad: totalTeachingLd,
        Total: totoalWorkLd + totalTeachingLd
      });
      e.target.dataset.initial = missedWorkHours;

      if (!isNaN(division)) {
        tableForm.setFieldsValue({ MissedTeachingHours: +division.toFixed(2) });
        document.querySelector('#MissedTeachingHours').dataset.initial = +division.toFixed(2)
      }

      // tableForm.setFieldsValue({
      //   TotalTeachingLoad: +(initialTotalTeachingLoad - missedTeachingHours).toFixed(2),
      //   Total: (+(initialTotalTeachingLoad - missedTeachingHours).toFixed(2)) + (+(totalWorkLoad - missedWorkHours).toFixed(2))
      // });
    }
  }

  const onMissedTeachingHoursChangeHandler = (e) => {
    const totalWorkLoad = +tableForm.getFieldValue('TotalWorkLoad');
    const totalTeachingLoad = +e.target.dataset.total;
    const missedTeachingHours = +e.target.value > +e.target.ariaValueMax ? +e.target.ariaValueMax : +e.target.value;
    if (missedTeachingHours === 0) {
      tableForm.setFieldsValue({
        TotalTeachingLoad: +e.target.dataset.total,
        Total: +e.target.dataset.total + totalWorkLoad
      });
      e.target.dataset.initial = missedTeachingHours;
    } else if (missedTeachingHours === +e.target.dataset.initial) {
      return;
    } else {
      tableForm.setFieldsValue({
        TotalTeachingLoad: +(totalTeachingLoad - missedTeachingHours).toFixed(2),
        Total: +(totalTeachingLoad - missedTeachingHours).toFixed(2) + totalWorkLoad
      });
      e.target.dataset.initial = missedTeachingHours;
    }
  }

  let inputNode;

  if (dataIndex === 'TotalTeachingLoad' || dataIndex === 'TotalWorkLoad' || dataIndex === 'Total') {
    inputNode = <InputNumber
      min={0}
      // onPressEnter={onEnter}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
      disabled
    />;
  } else if (dataIndex === 'CheckNotebookHour' || dataIndex === 'CheckNotebookSmallHour') {
    inputNode = <InputNumber
      min={0}
      max={160}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
    />;
  } else if (dataIndex === 'HourlyWork' || dataIndex === 'IndTrainingHours') {
    inputNode = <InputNumber
      min={0}
      max={200}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
    />;
  } else if (dataIndex === 'FactualDays' || dataIndex === 'SickDays' || dataIndex === 'LeaveDays') {
    inputNode = <InputNumber
      min={0}
      max={31}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
    />;
  }
  else if (dataIndex === 'MissedWorkHours') {
    inputNode = <InputNumber
      min={0}
      max={record.TotalWorkLoad + record.MissedWorkHours}
      data-total={dataIndex && record.TotalWorkLoad + record.MissedWorkHours}
      data-initial={dataIndex && record.MissedWorkHours}
      onBlur={onMissedWorkHoursChangeHandler}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
    />;
  } else if (dataIndex === 'MissedTeachingHours') {
    inputNode = <InputNumber
      min={0}
      max={record.TotalTeachingLoad + record.MissedTeachingHours}
      data-total={dataIndex && record.TotalTeachingLoad + record.MissedTeachingHours}
      data-initial={dataIndex && record.MissedTeachingHours}
      onBlur={onMissedTeachingHoursChangeHandler}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
    />;
  } else {
    inputNode = <InputNumber
      min={0}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
    />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          className='input-number-wrapper'
          name={dataIndex}
          style={{
            margin: 0
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
