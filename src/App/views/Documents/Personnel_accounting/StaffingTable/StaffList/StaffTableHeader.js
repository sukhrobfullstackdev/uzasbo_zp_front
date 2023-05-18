import React, { useEffect, useState } from "react";
import { Form, Select, Input, Button, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

import { monthCount } from "../../../../../../helpers/helpers";
import HelperServices from "../../../../../../services/Helper/helper.services";
import SubDepartmentServices from "../../../../../../services/References/Organizational/SubDepartment/SubDepartment.services";
import SectorServices from "../../../../../../services/References/Organizational/Sector/Sector.services";
import { Notification } from "../../../../../../helpers/notifications";
import classes from "./StaffList.module.css";
import StaffPositionAmountServices from "../../../../../../services/References/Global/StaffPositionAmount/StaffPositionAmount.services";
import { useCallback } from "react";

const { Option } = Select;
const layout = {
    labelCol: {
        span: 24,
    }
};

const StaffTableHeader = (props) => {
    const [monthCountDisable, setMonthCountDisable] = useState(true);
    const [tariffInputsDisable, setTariffInputsDisable] = useState(false);
    const [tariffScaleTableList, setTariffScaleTableList] = useState([]);
    const [subDepartmentList, setSubDepartmentList] = useState([]);
    const [sectorList, setSectorList] = useState([]);
    const [AllPositionsID, setAllPositionsID] = useState(null);
    const [IsBasicByGroup, setIsBasicByGroup] = useState(false);
    const [PositionQualificationID, setPositionQualificationID] = useState(null);
    const [PositionName, setPositionName] = useState('');
    const [DriverID, setDriverID] = useState(null);
    const [tariffScaleTableName, setTariffScaleTableName] = useState('');
    const [subDepartmentName, setSubDepartmentName] = useState('');
    const [sectorName, setSectorName] = useState('');
    const [tariffRates, setTariffRates] = useState(null);
    // const [corrCoef, setCorrCoef] = useState(null);
    const [fot, setFot] = useState(0);
    const [salary, setSalary] = useState(0);
    const [disabledInput, setDisabledInput] = useState(true);
    const [staffBasicPositionAmount, setStaffBasicPositionAmount] = useState(0);

    const { t } = useTranslation();
    const [addStaffForm] = Form.useForm();
    let initialValues = {
        Salary: 0,
        CorrCoefficient: 1,
        StaffQuantity: 1,
    }

    const addStaffHandler = () => {
        console.log(props.StaffListGroupID);
        if (props.StaffListGroupID) {
            addStaffForm.validateFields()
                .then(values => {
                    console.log(values);
                    // let allowances = Object.fromEntries(Object.entries(values).filter(([key]) => key.includes('Allowance')));
                    // let totalAllowances = 0
                    // Object.entries(allowances).forEach(item => {
                    //     totalAllowances += item[1]
                    // })

                    if (values.StaffQuantity === 0) {
                        Notification('error', t("Штат сони 0 дан катта бўлиши керак!"))
                    } else if (fot === 0) {
                        Notification('error', t("Жами иш ҳақи 0 дан катта бўлиши керак!"))
                    } else {
                        values.key = Math.random().toString();
                        values.ID = 0;
                        values.Status = 1;
                        values.PositionName = PositionName;
                        values.TariffScaleTableName = tariffScaleTableName;
                        values.SubDepartmentName = subDepartmentName;
                        values.SectorName = sectorName;
                        values.TariffRates = tariffRates;
                        values.Salary = values.Salary ? values.Salary : salary;
                        // values.Salary = staffBasicPositionAmount;
                        values.FOT = fot;
                        props.addData(values);
                    }
                })
        } else {
            Notification('error', t("Группа организации не выбран!"))
        }
    }

    // useEffect(() => {
    //     setStaffBasicPositionAmount(addStaffForm.getFieldValue('CorrCoefficient') * addStaffForm.getFieldValue('TariffScaleTableID') * props.minSalary);
    // }, [addStaffForm, props.minSalary])

    Object.entries(props.allowances).forEach(item => {
        let last2 = item[0].slice(-2)
        if (item[1] === true) {
            initialValues[`AllowanceType${last2}`] = 0
        }
    })

    const posPerChangeHandler = (value) => {
        if (value === 1) {
            addStaffForm.setFieldsValue({
                PPMonthCount: '12'
            });
            setMonthCountDisable(true);
        } else if (value === 2) {
            addStaffForm.setFieldsValue({
                PPMonthCount: '5'
            });
            setMonthCountDisable(true);
        } else {
            addStaffForm.setFieldsValue({
                PPMonthCount: '1'
            });
            setMonthCountDisable(false);
        }
    }

    const tariffScaleChangeHandler = id => {
        HelperServices.GetTariffScaleTableList(id)
            .then(res => {
                if (res.status === 200) {
                    setTariffScaleTableList(res.data);
                }
            })
            .catch(err => Notification('error', err))
    }

    const tariffScaleTableChangeHandler = (e, data) => {
        const orderNum = +addStaffForm.getFieldValue('StaffQuantity');
        const corCoef = addStaffForm.getFieldValue('CorrCoefficient');
        const corCoefRate = data['data-rate'];
        const calcValue = orderNum * corCoef * corCoefRate * props.minSalary;
        addStaffForm.setFieldsValue({ Salary: calcValue });
        setFot(calcValue);
        setSalary(calcValue);
        setStaffBasicPositionAmount(corCoef * corCoefRate * props.minSalary);
        if (data) {
            setTariffScaleTableName(data.children);
            setTariffRates(corCoefRate);
        }
    }

    const departmentChangeHandler = (id) => {
        SubDepartmentServices.getAll(id)
            .then(res => {
                setSubDepartmentList(res.data);
            })
            .catch(err => Notification('error', err))
    }

    const subDepartmentChangeHandler = (id, data) => {
        if (data) {
            setSubDepartmentName(data.children);
        }
        SectorServices.getAll(id)
            .then(res => {
                setSectorList(res.data);
            })
            .catch(err => Notification('error', err))
    }

    const sectorChangeHandler = (e, data) => {
        if (data) {
            setSectorName(data.children);
        }
    }

    const posSalaryTypeChangeHandler = (e) => {
        if (e === 2) {
            setTariffInputsDisable(true);
            addStaffForm.setFieldsValue({
                CorrCoefficient: 0,
                TariffScaleID: null,
                TariffScaleTableID: null,
            });
        } else {
            setTariffInputsDisable(false);
        }
    }

    const orderNumBlurHandler = e => {

        console.log(parseFloat(e.target.value.replace(/,/, '.')) * staffBasicPositionAmount);
        // const salary = addStaffForm.getFieldValue('Salary');
        // setOrderNum(e.target.value);
        // setSalary(e.target.value * salary)
        // setStaffBasicPositionAmount(parseFloat(e.target.value.replace(/,/, '.')) * salary);
        setFot(parseFloat(e.target.value.replace(/,/, '.')) * salary);
    }

    const corrCoefficientBlurHandler = e => {
        const orderNum = addStaffForm.getFieldValue('StaffQuantity');
        const corCoef = e.target.value;
        const calcValue = orderNum * corCoef * tariffRates * props.minSalary;
        addStaffForm.setFieldsValue({ Salary: calcValue });
        setFot(calcValue);
        setSalary(calcValue);
        setStaffBasicPositionAmount(corCoef * tariffRates * props.minSalary);
        // setCorrCoef(corCoef);
    }

    const salaryBlurHandler = (e) => {
        let salary = e.target.value.replace(/\s/g, '')
        // console.log(parseFloat(salary).toFixed(2));
        const orderNum = addStaffForm.getFieldValue('StaffQuantity');
        setFot(orderNum * parseFloat(salary).toFixed(2));
        setSalary(orderNum * parseFloat(salary).toFixed(2));
    }

    const allowanceBlurHandler = e => {
        const formValues = addStaffForm.getFieldsValue()
        let allowances = Object.fromEntries(Object.entries(formValues).filter(([key]) => key.includes('Allowance')))
        let totalFot = staffBasicPositionAmount
        Object.entries(allowances).forEach(element => {
            console.log(element);
            totalFot += element[1]
        })
        setFot(totalFot)
    }

    // const allowances = props.allowances.map((item, index) => {
    //     return (
    //         <th className='ant-table-cell' key={index}>
    //             <Form.Item
    //                 label={t(item)}
    //                 name={`${item.slice(0, 9)}Type${item.slice(9)}`}
    //                 rules={[
    //                     {
    //                         required: !tariffInputsDisable,
    //                         message: t("inputValidData"),
    //                     },
    //                 ]}
    //             >
    //                 <InputNumber placeholder={t(item)} style={{ width: '100%' }} onBlur={allowanceBlurHandler} />
    //             </Form.Item>
    //         </th>
    //     )
    // });

    const positionChangeHandler = useCallback((_, data) => {
        // console.log(data, 1678795);
        setAllPositionsID(data.AllPositionsID)
        setIsBasicByGroup(data.IsBasicByGroup)
        setPositionName(data.children)
        setDriverID(data.value)
        // if (data.PositionSalaryTypeID === 1) {
        //     addStaffForm.setFieldsValue({
        //         TariffScaleID: 1
        //     })
        // }
        if ((data.value === 1678799) || (data.value === 1678798)) {
            addStaffForm.setFieldsValue({
                PositionPeriodicityID: 2,
                PPMonthCount: '5',
            })
        } else {
            addStaffForm.setFieldsValue({
                PositionPeriodicityID: 1,
                PPMonthCount: '12',
            })
            setDisabledInput(true)
        }
        if ((data.value === 1678824) || (data.value === 1678825)) {
            setDisabledInput(false)
        } else if ((data.value === 1678826)) {
            addStaffForm.setFieldsValue({
                PositionPeriodicityID: 2,
                PPMonthCount: '5',
            })
        }
        // addStaffForm.setFieldsValue({
        //     PositionSalaryTypeID: data.PositionSalaryTypeID
        // })
    }, [addStaffForm])

    const positionQualificationChangeHandler = (_, data) => {
        setPositionQualificationID(data.value)
    }

    return (
        <Form
            {...layout}
            form={addStaffForm}
            component={false}
            initialValues={initialValues}
        >
            <tr>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('position')}
                        name='PositionID'
                        rules={[
                            {
                                required: true,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder={t("positionList")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={positionChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.posList.map(item => <Option
                                key={item.ID}
                                AllPositionsID={item.AllPositionsID}
                                IsBasicByGroup={item.IsBasicByGroup}
                                PositionSalaryTypeID={item.PositionSalaryTypeID}
                                value={item.ID}
                            >
                                {item.Name}
                            </Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Department')}
                        name='DepartmentID'
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder={t("Department")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={departmentChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                {/* <th className='ant-table-cell'>
                    <Form.Item
                        label={t('SubDepartment')}
                        name='SubDepartmentID'
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder={t("SubDepartment")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={subDepartmentChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {subDepartmentList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Sector')}
                        name='SectorID'
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder={t("Sector")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={sectorChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {sectorList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th> */}
                {/* {props.staffList?.Allowance01 === true && (
                            <>
                                <th className='ant-table-cell'>
                                    <Form.Item
                                        label={t('CategoryGroup')}
                                        name='CategoryGroupID'
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder={t("SubDepartment")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                            onChange={subDepartmentChangeHandler}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {props.categorygrouplist.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </th>
                                <th className='ant-table-cell'>
                                    <Form.Item
                                        label={t('Subspecialty')}
                                        name='SubspecialtyID'
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder={t("SubDepartment")}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                            onChange={subDepartmentChangeHandler}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {props.subspecialtylist.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </th>
                            </>
                        )} */}
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('PositionQualification')}
                        name='PositionQualificationID'
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: t("pleaseSelect"),
                    //     },
                    // ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            disabled={IsBasicByGroup}
                            placeholder={t("PositionQualification")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={positionQualificationChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.posQualList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('orderNumber')}
                        name='StaffQuantity'
                        rules={[
                            {
                                required: true,
                                message: t("inputValidData"),
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder={t('orderNumber')}
                            style={{ width: '100%' }} min={0}
                            parser={(value) => value.replace(',', '.')}
                            onBlur={orderNumBlurHandler}
                        />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('PositionPeriodicity')}
                        name='PositionPeriodicityID'
                        rules={[
                            {
                                required: true,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            // disabled={disabledInput}
                            placeholder={t("PositionPeriodicity")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={posPerChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.posPerList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('PPMonthCount')}
                        name='PPMonthCount'
                        rules={[
                            {
                                required: true,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            // disabled={disabledInput}
                            disabled={monthCountDisable}
                            placeholder={t("PPMonthCount")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {monthCount.map(item => <Option key={item.id} value={item.id}>{item.id}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('PositionSalaryType')}
                        name='PositionSalaryTypeID'
                        rules={[
                            {
                                required: true,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder={t("PositionSalaryType")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={posSalaryTypeChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.posSalaryTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Tariff Scale')}
                        name='TariffScaleID'
                    // rules={[
                    //     {
                    //         required: !tariffInputsDisable,
                    //         message: t("pleaseSelect"),
                    //     },
                    // ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            disabled={tariffInputsDisable}
                            placeholder={t("TariffScale")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            dropdownStyle={{ minWidth: "500px" }}
                            onChange={tariffScaleChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.tariffScaleList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('CorrCoefficient')}
                        name='TariffScaleTableID'
                        rules={[
                            {
                                required: !tariffInputsDisable,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            disabled={tariffInputsDisable}
                            placeholder={t("TariffScale")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={tariffScaleTableChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {tariffScaleTableList.map(item => <Option key={item.ID} value={item.ID} data-rate={item.TariffRates}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('CorrectionFactor')}
                        name='CorrCoefficient'
                        rules={[
                            {
                                required: !tariffInputsDisable,
                                message: t("inputValidData"),
                            },
                        ]}
                    >
                        <Input
                            disabled={tariffInputsDisable}
                            placeholder={t('CorrectionFactor')}
                            onBlur={corrCoefficientBlurHandler}
                        />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('totalSalary')}
                        name='Salary'
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: t("inputValidData"),
                    //   },
                    // ]}
                    >
                        {
                            tariffInputsDisable ?
                                <InputNumber
                                    placeholder={t('totalSalary')}
                                    onBlur={salaryBlurHandler}
                                    decimalSeparator=','
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                /> :
                                <span>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(staffBasicPositionAmount)}</span>
                        }
                        {/* <span>{new Intl.NumberFormat('ru-RU', {}).format(staffBasicPositionAmount)}</span> */}
                    </Form.Item>
                </th>
                {Object.entries(props.allowances).map(item => {
                    if (item[1] === true) {
                        let last2 = item[0].slice(-2)
                        return (
                            <th className={classes.antdTableCell}>
                                <Form.Item
                                    label={t(`${item[0]}`)}
                                    name={`AllowanceType${last2}`}
                                // rules={[
                                //     {
                                //         message: t("inputValidData"),
                                //     },
                                // ]}
                                >
                                    <InputNumber
                                        onBlur={allowanceBlurHandler}
                                        disabled={`AllowanceType${last2}` === 'AllowanceType63'}
                                        placeholder={t(`${item[0]}`)} style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                    />
                                </Form.Item>
                            </th>
                        )
                    } else return null;
                })}
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('FOT')}
                    >
                        {new Intl.NumberFormat('ru-RU', {}).format(fot)}
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Button
                        type='primary'
                        shape="circle"
                        icon={<i className="fa fa-plus" aria-hidden="true" />}
                        htmlType='submit'
                        onClick={addStaffHandler}
                    />
                </th>
            </tr >
        </Form >
    );
};

export default React.memo(StaffTableHeader);
