import React, { useState } from "react";
import { Form, Select, Button, InputNumber, Input, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import HelperServices from "../../../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../../../helpers/notifications";
import SubjectsInBLHGTApis from "../../../../../../../services/References/Organizational/SubjectInBLGHT/SubjectInBLGHT";

const { Option } = Select;
const layout = {
    labelCol: {
        span: 24,
    }
};

const LangCertificateTableHeader = (props) => {
    const [subjectName, setSubjectName] = useState('');
    const [certForeignLangTypeID, setCertForeignLangTypeID] = useState(null);
    const [certForeignLangTypeName, setCertForeignLangTypeName] = useState('');
    const [foreignLangTypeList, setForeignLangTypeList] = useState([]);
    const [subjectsInBLHGT, setSubjectsInBLHGT] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [foreignLangTypeList, subjectsInBLHGT] = await Promise.all([
                HelperServices.GetCertForeignLangTypeList(),
                SubjectsInBLHGTApis.getAllSubjectsInBLHGTList({
                    Date: props.DistributionOfLessonHours.Date,
                    BLHGTypeID: props.DistributionOfLessonHours.BLHGTypeID,
                    ForBillingList: true,
                    CertForeignLangTypeID: certForeignLangTypeID,
                }),
            ]);

            setForeignLangTypeList(foreignLangTypeList.data)
            setSubjectsInBLHGT(subjectsInBLHGT.data)
        }
        fetchData().catch(err => {
            Notification('error', err);
        });
    }, [certForeignLangTypeID])

    const { t } = useTranslation();
    const [addHoursForm] = Form.useForm();

    const addStaffHandler = () => {
        addHoursForm.validateFields()
            .then(values => {
                values.key = Math.random().toString();
                values.ID = 0;
                values.Status = 1;
                values.ExpireDate = values.ExpireDate.format("DD.MM.YYYY");
                values.SubjectName = subjectName;
                values.CertForeignLangTypeName = certForeignLangTypeName;
                props.addData(values);
            })
            .catch(err => {
                return err;
            })
    }

    const subjectsChangeHandler = (_, data) => {
        setSubjectName(data.children);
    }
    const certForeignLangTypeChangeHandler = (_, data) => {
        setCertForeignLangTypeName(data.children);
        setCertForeignLangTypeID(data.key);
        addHoursForm.setFieldsValue({
            Percentage: 0,
            SubjectID: null,
        })
    }

    return (
        <Form
            {...layout}
            form={addHoursForm}
            component={false}
            initialValues={{
                Percentage: 0
            }}
        >
            <tr>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('CertForeignLangType')}
                        name='CertForeignLangTypeID'
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
                            placeholder={t("CertForeignLangType")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={certForeignLangTypeChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {foreignLangTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('langSertSeries')}
                        name='Series'
                        rules={[
                            {
                                required: true,
                                message: t("PleaseFill"),
                            },
                        ]}
                    >
                        <Input placeholder={t('Series')} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('langSertNumber')}
                        name='Number'
                        rules={[
                            {
                                required: true,
                                // pattern: /^\d+$/,
                                message: t("PleaseFill"),
                            },
                        ]}
                    >
                        <Input placeholder={t('Number')} style={{ width: '100%' }} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    {certForeignLangTypeID == 1 ? <>
                        <Form.Item
                            label={t('Percentage')}
                            name='Percentage'
                        >
                            <Select
                                allowClear
                                placeholder={t("Percentage")}
                                style={{ width: '100%' }}
                                optionFilterProp="children"
                            >
                                <Option value={15}>15%</Option>
                                <Option value={30}>30%</Option>
                            </Select>
                        </Form.Item>
                    </> : <>
                        <Form.Item
                            label={t('Percentage')}
                            name='Percentage'
                        >
                            <Select
                                allowClear
                                placeholder={t("Percentage")}
                                style={{ width: '100%' }}
                                optionFilterProp="children"
                            >
                                <Option value={50}>50%</Option>
                            </Select>
                        </Form.Item>
                    </>}
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('langSertExpireDate')}
                        name='ExpireDate'
                        rules={[
                            {
                                required: true,
                                message: t("PleaseFill"),
                            },
                        ]}
                    >
                        <DatePicker format='DD.MM.YYYY' placeholder={t('ExpireDate')} style={{ width: '100%' }} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('langSertSubjectName')}
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
                            {subjectsInBLHGT.map(item => <Option key={item.ID} value={item.SubjectsID}>{item.SubjectsName}</Option>)}
                        </Select>
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
            </tr>
        </Form >
    );
};

export default React.memo(LangCertificateTableHeader);
