import React, { useState } from "react";
import { Form, Select, Button, InputNumber, Input } from "antd";
import { useTranslation } from "react-i18next";
import DistributionOfLessonHoursServices from "../../../../../../../services/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/DistributionOfLessonHours.services";
import { Notification } from "../../../../../../../helpers/notifications";

// import HelperServices from "../../../../../../../services/Helper/helper.services";
// import SubDepartmentServices from "../../../../../../../services/References/Organizational/SubDepartment/SubDepartment.services";
// import SectorServices from "../../../../../../../services/References/Organizational/Sector/Sector.services";
// import { Notification } from "../../../../../../../helpers/notifications";

const { Option } = Select;
const layout = {
    labelCol: {
        span: 24,
    }
};

const HoursTableHeader = (props) => {
    const [subjectName, setSubjectName] = useState('');
    const [subjectID, setSubjectID] = useState(0);
    const [canEdit, setCanEdit] = useState(false);
    const [hours, setHours] = useState(0);
    const [childrenCount, setChildrenCount] = useState(0);
    const [teachingAtHomeHours, setTeachingAtHomeHours] = useState(0);
    const [teachingAtHomeChildrenCount, setTeachingAtHomeChildrenCount] = useState(0);

    const { t } = useTranslation();
    const [addHoursForm] = Form.useForm();

    const addStaffHandler = () => {
        addHoursForm.validateFields()
            .then(values => {
                values.key = Math.random().toString();
                values.ID = 0;
                values.Status = 1;
                values.SubjectName = subjectName;
                props.addData(values);
            })
            .catch(err => {
                return err;
            })
    }

    const classTitleChangeHandler = (id) => {
        let thisItem = props.classTitleList.find(item => item.ID === id)
        // console.log(thisItem.ClassNumberID);
        addHoursForm.setFieldsValue({
            ClassNumberID: thisItem.ClassNumberID
        })
        DistributionOfLessonHoursServices.getDistributionOfLessonHoursDataControl({
            StartYear: props.DistributionOfLessonHours.StartYear,
            SubjectsID: subjectID,
            BLHGTypeID: thisItem.BLHGTypeID,
            ClasstitletableID: thisItem.ID,
        })
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    setCanEdit(res.data.CanEdit);
                    setHours(res.data.MainTotalHours);
                    setChildrenCount(res.data.ChildrenCount);
                    setTeachingAtHomeHours(res.data.TeachingAtHomeHours);
                    setTeachingAtHomeChildrenCount(res.data.TeachingAtHomeChildrenCount);
                    addHoursForm.setFieldsValue({
                        Hours: res.data.MainTotalHours,
                        ChildrenCount: res.data.ChildrenCount,
                        TeachingAtHomeHours: res.data.TeachingAtHomeHours,
                        TeachingAtHomeChildrenCount: res.data.TeachingAtHomeChildrenCount,
                    })
                }
            })
            .catch(err => Notification('error', err))
    }

    const subjectsChangeHandler = (val, data) => {
        if (val === undefined) {
            setSubjectID(0);
            setSubjectName('');
        } else {
            setSubjectName(data.children);
            setSubjectID(val);
        }
    }

    return (
        <Form
            {...layout}
            form={addHoursForm}
            component={false}
            initialValues={{
                Hours: 0,
                ChildrenCount: 0,
                TeachingAtHomeHours: 0,
                TeachingAtHomeChildrenCount: 0,
            }}
        >
            <tr>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('SubjectName')}
                        name='SubjectID'
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
                            placeholder={t("SubjectName")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={subjectsChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.subjects.map(item => <Option key={item.ID} value={item.SubjectsID}>{item.NameUzb}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('PositionQualification')}
                        name='PositionQualificationID'
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
                            placeholder={t("PositionQualification")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
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
                        label={t('ClassTitleTableName')}
                        name='ClassTitleTableID'
                        rules={[
                            {
                                required: true,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch disabled={subjectID === 0}
                            placeholder={t("ClassTitleTableName")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={classTitleChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.classTitleList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t("ClassNumberID")}
                        name="ClassNumberID"
                        hidden={true}
                    >
                        <Input />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Hours')}
                        name='Hours'
                        rules={[
                            {
                                required: true,
                                message: t("inputValidData"),
                            },
                        ]}
                    >
                        <InputNumber min={0} max={hours} disabled={!canEdit} placeholder={t('Hours')} style={{ width: '100%' }} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('ChildrenCount')}
                        name='ChildrenCount'
                        rules={[
                            {
                                required: true,
                                message: t("inputValidData"),
                            },
                        ]}
                    >
                        <InputNumber min={0} max={childrenCount} disabled={!canEdit} placeholder={t('ChildrenCount')} style={{ width: '100%' }} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('teachingAtHomeHours')}
                        name='TeachingAtHomeHours'
                        rules={[
                            {
                                required: true,
                                message: t("inputValidData"),
                            },
                        ]}
                    >
                        <InputNumber min={0} max={teachingAtHomeHours} disabled={!canEdit} placeholder={t('teachingAtHomeHours')} style={{ width: '100%' }} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('teachingAtHomeChildrenCount')}
                        name='TeachingAtHomeChildrenCount'
                        rules={[
                            {
                                required: true,
                                message: t("inputValidData"),
                            },
                        ]}
                    >
                        <InputNumber min={0} max={teachingAtHomeChildrenCount} disabled={!canEdit} placeholder={t('teachingAtHomeChildrenCount')} style={{ width: '100%' }} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Button
                        type='primary'
                        shape="circle"
                        icon={<i className="fa fa-plus" aria-hidden="true" />}
                        htmlType='submit'
                        onClick={addStaffHandler}
                        disabled={!canEdit}
                    />
                </th>
            </tr>
        </Form >
    );
};

export default React.memo(HoursTableHeader);
