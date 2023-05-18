import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Button, Select, Spin, DatePicker, Card, Tabs, Switch, Table, Space, Popconfirm, Typography, Tag, Divider, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Fade } from "react-awesome-reveal";
import { CSSTransition } from 'react-transition-group';
import { CheckCircleFilled, QuestionCircleFilled } from '@ant-design/icons';

import MainCard from "../../../../components/MainCard";
import classes from './Employee.module.scss';
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import PassportModal from './components/Modals/PassportModal.js';
import EditPassportModal from './components/Modals/EditPassportModal';
import EducationModal from './components/Modals/EducationModal.js';
import EditEducationModal from './components/Modals/EditEducationModal.js';
import ExplanationModal from './components/Modals/ExplanationModal.js';
import PlasticModal from './components/Modals/PlasticModal.js';
import HistoryModal from './components/Modals/HistoryModal.js';
// import HousingTableEditableCell from './components/HousingTableEditableCell.js';
import EmployeeServices from '../../../../../services/References/Organizational/Employee/employee.services';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const disabledHumocardBanks = ["01", "02", "03", "04", "05", "08", "09", "10", "11", "12", "14", "15", "16", "17", "20", "21"];

const UpdateEmployee = (props) => {
  const [loader, setLoader] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [banks, setBanks] = useState([]);
  const [gender, setGender] = useState([]);
  const [empType, setEmpType] = useState([]);
  const [, setTableEdited] = useState(false);
  const [validPerson, setValidPerson] = useState(false);
  const [checkedPerson, setCheckedPerson] = useState(false);
  const [isCheckedUzCard, setIsCheckedUzCard] = useState(false);
  const [isCheckedHumo, setIsCheckedHumo] = useState(false);
  const [inpsClose, setInpsClose] = useState(false);
  const [INPSCode, setINPSCode] = useState(null);
  const [status, setStatus] = useState([]);
  const [bankParent, setBankParent] = useState(null);
  const [bankParentCode, setBankParentCode] = useState(null);
  // Modal states 
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [plasticModalVisible, setPlasticModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [historyInputName, setHistoryInputName] = useState('');
  // Modal states end
  const [passportData, setPassportData] = useState([]);
  const [passportTableVisible, setPassportTableVisible] = useState(false);
  const [editPassportTableVisible, setEditPassportTableVisible] = useState(false);
  const [editPassportData, setEditPassportData] = useState({});

  const [educationData, setEducationData] = useState([]);
  const [editEducationData, setEditEducationData] = useState({});
  const [educationTableVisible, setEducationTableVisible] = useState(false);
  const [editEducationModalVisible, setEditEducationModalVisible] = useState(false);

  const [housingData, setHousingData] = useState([]);

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [myGovForm] = Form.useForm();
  const getPersonRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('EmployeeInsertFromAPI');
  const openInpsRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('FixingTransactionAcceptByAdmin');
  const openPlasticInputsRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('NoControlPlasticCard');
  const OrgTypeID = JSON.parse(localStorage.getItem('userInfo')).OrgTypeID;

  useEffect(() => {
    async function fetchData() {
      const [emp, genderList, empTypeList, statusList, bankList] = await Promise.all([
        EmployeeServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.getGenderList(),
        HelperServices.getEmployeeTypeList(),
        HelperServices.getStateList(),
        HelperServices.getBankList()
      ]);

      if (props.match.params.id) {
        setBankParent(emp.data.PlasticCardBankCode);
        setBankParentCode(emp.data.PlasticCardParentBankCode);
        setINPSCode(emp.data.INPSCode);
      }

      setEmployee(emp.data);
      setGender(genderList.data);
      setEmpType(empTypeList.data);
      setStatus(statusList.data);
      setPassportData(emp.data.PassportDataTables);
      setEducationData(emp.data.EducationTables);
      setHousingData(emp.data.HousingServTables);
      setBanks(bankList.data.rows);
      setCheckedPerson(emp.data.IsChecked);
      setIsCheckedUzCard(emp.data.IsCheckedUzCard);
      setIsCheckedHumo(emp.data.IsCheckedHumo);

      if (getPersonRole) {
        setValidPerson(emp.data.IsChecked);
        setInpsClose(emp.data.IsChecked);
      } else {
        setValidPerson(emp.data.ID === 0 ? true : emp.data.IsChecked);
        setInpsClose(emp.data.ID === 0 ? true : emp.data.IsChecked);
      }

      if (emp.data.ID !== 0 && !!openInpsRole) {
        setInpsClose(false);
      }

      mainForm.setFieldsValue({
        ...emp.data,
        DateOfBirth: moment(emp.data.DateOfBirth, 'DD.MM.YYYY'),
        EmployeeTypeID: emp.data.ID === 0 ? null : emp.data.EmployeeTypeID,
        GenderID: emp.data.ID === 0 ? null : emp.data.GenderID,
      });
      myGovForm.setFieldsValue({
        INPSCode: emp.data.INPSCode,
      });
      setLoader(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
      setLoader(false);
    });

  }, [props.match.params.id, mainForm, getPersonRole, myGovForm, openInpsRole])

  const onFinish = (values) => {
    values.ID = Number(props.match.params.id ? props.match.params.id : 0);
    values.DateOfBirth = values.DateOfBirth.format("DD.MM.YYYY");
    values.PassportDataTables = passportData;
    values.EducationTables = educationData;
    values.HousingServTables = housingData;
    values.IsChecked = checkedPerson;
    values.IsCheckedUzCard = isCheckedUzCard;
    values.IsCheckedHumo = isCheckedHumo;
    setLoader(true);
    EmployeeServices.postData(values)
      .then(res => {
        if (res.status === 200) {
          Notification('success', t('edited'));
          setLoader(false);
          history.push('/employee');
        }
      })
      .catch(err => {
        Notification('error', err);
        setLoader(false);
      })
  }

  const onFinishFailed = (values) => {
    Notification('error', `${values.errorFields[0].errors}: ${t(values.errorFields[0].name)} ${t('input')}`);
  }

  // Passport table
  const passportColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: t('passportSeries'),
      dataIndex: 'Series',
      key: 'Series',
    },
    {
      title: t('passportNumber'),
      dataIndex: 'Number',
      key: 'Number',
    },
    {
      title: t('dateOfIssue'),
      dataIndex: 'DateOfIssue',
      key: 'DateOfIssue',
    },
    {
      title: t('dateOfExpire'),
      dataIndex: 'DateOfExpire',
      key: 'DateOfExpire',
    },
    {
      title: t('authoriry'),
      dataIndex: 'Authoriry',
      key: 'Authoriry',
    },
    {
      title: t('status'),
      dataIndex: 'StateID',
      key: 'StateID',
      render: (record) => {
        if (record === 1) {
          return (<Tag color="#87d068" key={status}>{t('active')}</Tag>)
        } else if (record === 2) {
          return (<Tag color="#f50" key={status}>{t('passive')}</Tag>)
        }
      }
    },
    {
      title: t('actions'),
      key: 'action',
      align: 'center',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t('Edit')}>
              <span
                onClick={() => {
                  if (!validPerson) {
                    setEditPassportTableVisible(true);
                    setEditPassportData(record);
                  }
                }}
              >
                <i className={`feather icon-edit action-icon ${validPerson ? 'disabled-action-icon' : ''}`} />
              </span>
            </Tooltip>
            <Tooltip title={t('Delete')}>
              <Popconfirm
                disabled={validPerson}
                title={t('delete')}
                okText={t('yes')}
                cancelText={t('cancel')}
                onConfirm={() => {
                  passportDataDeleteHandler(record);
                  Notification('warning', t('deleted'));
                }}
              >
                <span>
                  <i className={`feather icon-trash-2 action-icon ${validPerson ? 'disabled-action-icon' : ''}`} />
                </span>
              </Popconfirm>
            </Tooltip>
          </Space>
        )
      },
    },
  ];

  const createPassportDataHandler = useCallback((values) => {
    Notification('success', t('success-msg'));
    setPassportData((prevState) => [values, ...prevState])
    setPassportTableVisible(false);
  }, [t]);

  const closePassportModal = useCallback(() => {
    setPassportTableVisible(false)
  }, []);

  const editPassportDataHandler = useCallback((values) => {
    setPassportData(values)
    setEditPassportTableVisible(false);
    Notification('success', t('edited'));
  }, [t]);

  const passportDataDeleteHandler = useCallback((record) => {
    setTableEdited(prevState => !prevState);
    record.Status = 3;
  }, [])
  // Passport table End

  // Education table
  const educationColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: t('university'),
      dataIndex: 'Institution',
      key: 'Institution',
    },
    {
      title: t('faculty'),
      dataIndex: 'Faculty',
      key: 'Faculty',
    },
    {
      title: t('specialty'),
      dataIndex: 'Specialty',
      key: 'Specialty',
    },
    {
      title: t('startDate'),
      dataIndex: 'StartDate',
      key: 'StartDate',
    },
    {
      title: t('endDate'),
      dataIndex: 'EndDate',
      key: 'EndDate',
    },
    {
      title: t('diploma'),
      dataIndex: 'Diploma',
      key: 'Diploma',
    },
    {
      title: t('actions'),
      key: 'action',
      width: '10%',
      align: 'center',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t('Edit')}>
              <span
                onClick={() => {
                  setEditEducationModalVisible(true);
                  setEditEducationData(record);
                }}
              >
                <i className='feather icon-edit action-icon' aria-hidden="true" />
              </span>
            </Tooltip>
            <Tooltip title={t('Delete')}>
              <Popconfirm
                title={t('delete')}
                okText={t('yes')}
                cancelText={t('cancel')}
                onConfirm={() => {
                  Notification('warning', t('deleted'));
                  educationDataDeleteHandler(record);
                }}
              >
                <span>
                  <i className="feather icon-trash-2 action-icon" />
                </span>
              </Popconfirm>
            </Tooltip>
          </Space>
        )
      },
    },
  ];

  const createEducationDataHandler = useCallback((values) => {
    Notification('success', t('success-msg'));
    setEducationData((prevState) => [values, ...prevState]);
    setEducationTableVisible(false);
  }, [t]);

  const closeEducationModal = useCallback(() => {
    setEducationTableVisible(false)
  }, []);

  const editEducationDataHandler = useCallback((values) => {
    setEducationData(values);
    setEditEducationModalVisible(false);
    Notification('success', t('edited'));
  }, [t]);

  const educationDataDeleteHandler = useCallback((record) => {
    setTableEdited(prevState => !prevState);
    record.Status = 3;
  }, [])
  // Education table End

  // Input autocomplete
  const setSurname = (e) => {
    let fullName = `${e.target.value} ${mainForm.getFieldValue('FirstName') ? mainForm.getFieldValue('FirstName') : ''} ${mainForm.getFieldValue('LastName') ? mainForm.getFieldValue('LastName') : ''}`;

    mainForm.setFieldsValue({
      FIOTranslite: fullName
    })
  }

  const setName = (e) => {
    let fullName = `${mainForm.getFieldValue('FamilyName') ? mainForm.getFieldValue('FamilyName') : ''} ${e.target.value} ${mainForm.getFieldValue('LastName') ? mainForm.getFieldValue('LastName') : ''}`;

    mainForm.setFieldsValue({
      FIOTranslite: fullName
    })
  }

  const setLastName = (e) => {
    let fullName = `${mainForm.getFieldValue('FamilyName') ? mainForm.getFieldValue('FamilyName') : ''} ${mainForm.getFieldValue('FirstName') ? mainForm.getFieldValue('FirstName') : ''} ${e.target.value}`;

    mainForm.setFieldsValue({
      FIOTranslite: fullName.toString()
    })
  }
  // End Input autocomplete

  const myGovFormHandler = async (values) => {
    if (props.match.params.id && values.INPSCode !== mainForm.getFieldValue('INPSCode')) {
      Notification('warning', t('inpsIsDifferent'));
      return false;
    }
    setLoader(true);
    try {
      const person = await EmployeeServices.getPerson(values)
      if (person.status === 200) {
        setCheckedPerson(person.data.IsChecked);
        setValidPerson(person.data.IsChecked);
        setIsCheckedUzCard(person.data.IsCheckedUzCard);
        // const district = await HelperServices.getDistrictList(person.data.LiveOblastID);
        // const validDistrict = district.data.filter(item => item.ID === person.data.LiveRegionID);
        // setCurrentDistrict(district.data);
        setPassportData(prevState => {
          prevState.forEach(item => item.Status = 3);
          const passportDt = person.data.PassportDataTables.map(item => {
            item.key = Math.random().toString();
            return item;
          });
          return [...prevState, ...passportDt];
        });
        mainForm.setFieldsValue({
          FamilyName: person.data.FamilyName,
          FirstName: person.data.FirstName,
          LastName: person.data.LastName,
          DateOfBirth: moment(person.data.DateOfBirth, 'DD.MM.YYYY'),
          GenderID: person.data.GenderID,
          // LiveOblastID: person.data.LiveOblastID,
          // LiveRegionID: validDistrict.length > 0 ? person.data.LiveRegionID : null,
          // Address: person.data.Address,
          INPSCode: person.data.INPSCode,
          PlasticCardNumber: person.data.PlasticCardNumber,
          // PlasticCardNumberHumo: person.data.PlasticCardNumberHumo,
          FIOTranslite: person.data.FIOTranslite,
          FIOTransliteHumo: person.data.FIOTranslite,
        });
        setINPSCode(person.data.INPSCode);
        setLoader(false);
      }
    } catch (err) {
      Notification('error', err);
      setLoader(false);
    }
  }

  const historyHandler = inputName => {
    setHistoryInputName(inputName);
    setHistoryModalVisible(true);
  }

  const closeHistoryModalHandler = () => {
    setHistoryModalVisible(false);
  }

  const plasticCardBankChangeHandler = useCallback((_, data) => {
    mainForm.setFieldsValue({
      PlasticCardNumber: '00000000',
      PlasticCardNumberHumo: null
    })
    setIsCheckedUzCard(false);
    setIsCheckedHumo(false);
    if (data) {
      // console.log(data);
      setBankParent(data['data-parent']);
      setBankParentCode(data['data-parent-code']);
    } else {
      setBankParent(null);
      setBankParentCode(null);
    }
  }, [mainForm]);

  const plasticCardsHandler = useCallback((values) => {
    setPlasticModalVisible(false)
    if (values.account) {
      setIsCheckedUzCard(true);
    }
    if (values.humoAccount) {
      setIsCheckedHumo(true);
    }
    const mainFormData = mainForm.getFieldsValue();
    mainForm.setFieldsValue({
      PlasticCardNumber: values.account ? values.account : mainFormData.PlasticCardNumber,
      PlasticCardNumberHumo: values.humoAccount ? values.humoAccount : mainFormData.PlasticCardNumberHumo
    });
  }, [mainForm])

  const checkStudent = (PINFL, ID, EmployeeTypeID) => {
    setLoader(true)
    EmployeeServices.GetEmployeeStudent({ PINFL, ID, EmployeeTypeID })
      .then(res => {
        if (res.status === 200) {
          Notification('success', t('Ходим HEMIS тизимидан муваффақиятли текшириб олинди'));
          EmployeeServices.getById(employee.ID)
            .then(res => {
              if (res.status === 200) setEmployee(res.data)
            })
            .catch(err => Notification('error', err))
          setLoader(false);
        }
      })
      .catch(err => {
        Notification('error', err);
        setLoader(false);
      })
  }

  return (
    <Fade>
      <MainCard title={t("oneEmployee")} employee={employee}>
        <Spin spinning={loader} size='large'>
          {/* {getPersonRole &&
            <> */}
          <Form
            layout='vertical'
            form={myGovForm}
            onFinish={myGovFormHandler}
          // initialValues={{
          //   INPSCode: '31301996640011',
          //   Series: 'AA',
          //   Number: '8480482'
          // }}
          >
            <Row gutter={[15, 0]}>
              <Col>
                <Title level={4} className={classes['mygov-title']}>{t('findEmployee')}:</Title>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("INPSCode")}
                  name='INPSCode'
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                      pattern: /^[A-Za-z0-9]{14,14}$/
                    },
                  ]}>
                  <Input
                    placeholder={t('inpsCode')}
                    maxLength={14}
                    disabled={!!props.match.params.id}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t('passportSeries')}
                  name='Series'
                  rules={[
                    {
                      required: true,
                      pattern: /[A-Z]{1,2}$/,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <Input placeholder={t('passportSeries')} maxLength={2} />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t('passportNumber')}
                  name='Number'
                  rules={[
                    {
                      required: true,
                      pattern: /^[\d]{7,8}$/,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <Input placeholder={t('passportNumber')} maxLength={8} />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Space>
                  <Button
                    type="primary"
                    htmlType='submit'
                    className={classes['submit-btn']}
                  >
                    <i className="fas fa-search"></i>
                  </Button>
                  <Button
                    type="primary"
                    className={classes['submit-btn']}
                    onClick={() => setExplanationModalVisible(true)}
                  >
                    <i className="fas fa-question"></i>
                  </Button>
                </Space>
              </Col>
              {(OrgTypeID === 9 || OrgTypeID === 15) && (
                <>
                  {(employee.IsChecked === true && (employee.EmployeeTypeID === 3 || employee.EmployeeTypeID === 1)) && (
                    <Col xl={4} lg={6}>
                      <Space>
                        <Button
                          // type="primary"
                          className={classes['submit-btn']}
                          onClick={() => checkStudent(employee.INPSCode, employee.ID, employee.EmployeeTypeID)}
                        >
                          <i className="feather icon-check"></i>&nbsp;{t('refreshHemis')}
                        </Button>
                      </Space>
                    </Col>
                  )}
                </>
              )}
            </Row>
          </Form>
          <Divider style={{ margin: '5px 0 15px 0' }} />
          <Form
            {...layout}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={classes.FilterForm}
            form={mainForm}
          >
            <Row gutter={[15, 0]}>
              <Col xl={5} lg={12}>
                <Form.Item
                  label={t('surname')}
                  name='FamilyName'
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <Input
                    disabled={validPerson}
                    placeholder={t('surname')}
                    onChange={setSurname}
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={12}>
                <Form.Item
                  label={t('firstName')}
                  name='FirstName'
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <Input
                    disabled={validPerson}
                    placeholder={t('firstName')}
                    onChange={setName}
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={12}>
                <Form.Item
                  label={t('middleName')}
                  name='LastName'
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <Input
                    disabled={validPerson}
                    placeholder={t('middleName')}
                    onChange={setLastName}
                    addonAfter={
                      <div
                        onClick={() => historyHandler('LastName')}
                        className={classes['ant-input-group-addon']}
                      >
                        i
                      </div>
                    }
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={12}>
                <Form.Item
                  label={t('employeeType')}
                  name='EmployeeTypeID'
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder={t('employeeType')}
                  >
                    {empType.map(empType => <Option key={empType.ID} value={empType.ID}>{empType.DisplayName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('inn')}
                  name='INN'
                  rules={[
                    {
                      required: true,
                      pattern: /^[\d]{9}$/,
                      message: t('inputValidData'),
                    },
                  ]}>
                  <Input
                    placeholder={t('inn')}
                    maxLength={9}
                    addonAfter={
                      <div
                        onClick={() => historyHandler('INN')}
                        className={classes['ant-input-group-addon']}
                      >
                        i
                      </div>
                    }
                  />
                </Form.Item>
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('personnelNumber')}
                  name='PersonnelNumber'
                  rules={[
                    {
                      required: true,
                      pattern: /^[\d]*$/,
                      message: t('inputValidData'),
                    },
                  ]}>
                  <Input placeholder={t('personnelNumber')} />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('DateOfBirth')}
                  name="DateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <DatePicker
                    disabled={validPerson}
                    format="DD.MM.YYYY"
                    style={{ width: '100%' }}
                    placeholder={t('DateOfBirth')}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('gender')}
                  name='GenderID'
                  rules={[
                    {
                      required: true,
                      message: t('Please select'),
                    },
                  ]}
                >
                  <Select
                    disabled={validPerson}
                    style={{ width: '100%' }}
                    placeholder={t('gender')}
                  >
                    {gender.map(gender => <Option key={gender.ID} value={gender.ID}>{gender.DisplayName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('contactInfo')}
                  name='ContactInfo'
                // rules={[
                //   {
                //     pattern: /^[\d]{12,12}$/,
                //     message: t('inputValidData'),
                //   },
                // ]}
                >
                  <Input style={{ width: '100%' }} placeholder={t('contactInfo')} maxLength={12} />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('isForeignCitizen')}
                  name='IsForeignCitizen'
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Space align='end' size='small'>
                  <Form.Item
                    label={t('benefitsIncomeTax')}
                    name='BenefitsIncomeTax'
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={() => historyHandler('BenefitsIncomeTax')}>
                      i
                    </Button>
                  </Form.Item>
                </Space>
              </Col>
            </Row>
            <Tabs defaultActiveKey="1">
              <TabPane tab={t('inpsInfo')} key="2" forceRender>
                <Card>
                  <Row gutter={[15, 10]} className='plastic-card-tab'>
                    <Col xl={12} lg={12}>
                      <Form.Item
                        label={t("INPSCode")}
                        name='INPSCode'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                            pattern: /^[A-Za-z0-9]{14,14}$/
                          },
                        ]}
                      >
                        <Input
                          placeholder={t('inpsCode')}
                          maxLength={14}
                          disabled={inpsClose}
                          addonAfter={
                            <div
                              onClick={() => historyHandler('INPSCode')}
                              className={classes['ant-input-group-addon']}
                            >
                              i
                            </div>
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tab={t('plasticCardInfo')} key="3" forceRender>
                <Card>
                  <Row gutter={[15, 10]} className='plastic-card-tab'>
                    <Col xl={12} lg={12}>
                      <Form.Item
                        style={{ width: "100%" }}
                        label={t('plasticCardBankID')}
                        name='PlasticCardBankID'
                        rules={[
                          {
                            required: true,
                            message: t('pleaseSelect'),
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          allowClear
                          onChange={plasticCardBankChangeHandler}
                          placeholder={t('plasticCardBankID')}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {banks.map(bank => <Option key={bank.ID} data-parent={bank.Code} data-parent-code={bank.BankParentCode} value={bank.ID}>{bank.Name}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={12} lg={12}>
                      <div className={classes['plastic-modal-btn-wrapper']}>
                        <Button
                          type="primary"
                          disabled={!bankParent}
                          className={classes['plastic-modal-btn']}
                          onClick={() => setPlasticModalVisible(true)}
                        >
                          {t('selectPlasticCard')}&nbsp;<i className="feather icon-credit-card" />
                        </Button>
                      </div>
                    </Col>
                    <Col xl={12} lg={12}>
                      <Form.Item
                        label={t('plasticCardNumber')}
                        name='PlasticCardNumber'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                            pattern: /^[\d]{8,20}$/
                          },
                        ]}
                      >
                        <Input
                          disabled={!openPlasticInputsRole}
                          placeholder={t('plasticCardNumber')}
                          maxLength={20}
                          addonBefore={
                            <div className={classes['ant-input-group-addon']}>
                              {isCheckedUzCard ?
                                <CheckCircleFilled className={classes['valid-plastic-card-icon']} /> :
                                <QuestionCircleFilled className={classes['invalid-plastic-card-icon']} />
                              }
                            </div>
                          }
                          addonAfter={
                            <div
                              onClick={() => historyHandler('PlasticCardNumber')}
                              className={classes['ant-input-group-addon']}
                            >
                              i
                            </div>
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={12} lg={12}>
                      <Form.Item
                        label={t('fioTranslite')}
                        name='FIOTranslite'
                        // labelCol={verticalFormItem}
                        // labelAlign='left'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                          },
                        ]}>
                        <Input placeholder={t('fioTranslite')} disabled={validPerson} />
                      </Form.Item>
                    </Col>
                    <Col xl={12} lg={12}>
                      <Form.Item
                        label={t('plasticCardNumberHumo')}
                        name='PlasticCardNumberHumo'
                        rules={[
                          {
                            // required: true,
                            message: t('inputValidData'),
                            pattern: /^[\d]{8,20}$/
                          },
                        ]}
                      >
                        <Input
                          placeholder={t('plasticCardNumberHumo')}
                          maxLength={20}
                          disabled={openPlasticInputsRole ? !openPlasticInputsRole : disabledHumocardBanks.includes(bankParentCode)}
                          addonBefore={
                            <div className={classes['ant-input-group-addon']}>
                              {isCheckedHumo ?
                                <CheckCircleFilled className={classes['valid-plastic-card-icon']} /> :
                                <QuestionCircleFilled className={classes['invalid-plastic-card-icon']} />
                              }
                            </div>
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={12} lg={12}>
                      <Form.Item
                        label={t('fioTransliteHumo')}
                        name='FIOTransliteHumo'
                      // labelCol={verticalFormItem}
                      // labelAlign='left'
                      >
                        <Input placeholder={t('fioTransliteHumo')} disabled={validPerson} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tab={t("СМС информирование")} key="4" forceRender>
                <Card>
                  <Row gutter={[15, 0]}>
                    <Col xl={12} lg={12}>
                      <Form.Item
                        label={t('phoneNumber')}
                        name='PhoneNumber'
                        rules={[
                          {
                            required: true,
                            pattern: /^[\d]{12,12}$/,
                            message: t('inputValidData'),
                          },
                        ]}
                      >
                        <Input
                          placeholder={t('phoneNumber')}
                          maxLength={12}
                          addonAfter={
                            <div
                              onClick={() => historyHandler('PhoneNumber')}
                              className={classes['ant-input-group-addon']}
                            >
                              i
                            </div>
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t('smsIsUzbek')}
                        name='SMSIsUzbek'
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tab={t("Аванс")} key="5">
                <Card>
                  <Row gutter={[15, 0]}>
                    <Col xl={8} lg={8}>
                      <Form.Item
                        label={t('prepaymentSum')}
                        name='PrepaymentSum'
                      >
                        <Input placeholder={t('prepaymentSum')} />
                      </Form.Item>
                      <Form.Item
                        label={t('plasticCardSum')}
                        name='PlasticCardSum'
                      >
                        <Input placeholder={t('plasticCardSum')} />
                      </Form.Item>
                      <Form.Item
                        label={t('plasticCardPreSum')}
                        name='PlasticCardPreSum'
                      >
                        <Input placeholder={t('plasticCardPreSum')} />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={8}>
                      <Form.Item
                        label={t('prepaymentPercent')}
                        name='PrepaymentPercent'
                      >
                        <Input placeholder={t('prepaymentPercent')} />
                      </Form.Item>
                      <Form.Item
                        label={t('plasticCardPercent')}
                        name='PlasticCardPercent'
                      >
                        <Input placeholder={t('plasticCardPercent')} />
                      </Form.Item>
                      <Form.Item
                        label={t('plasticCardPrePercent')}
                        name='PlasticCardPrePercent'
                      >
                        <Input placeholder={t('plasticCardPrePercent')} />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={8}>
                      <Form.Item
                        label={t('isChargePrepayment')}
                        name='IsChargePrepayment'
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        label={t('isTransferToPlasticCard')}
                        name='IsTransferToPlasticCard'
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        label={t('isTransferToPlasticCardPre')}
                        name='IsTransferToPlasticCardPre'
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tab={t("Паспортные данные")} key="6">
                <Card>
                  <Button
                    disabled={validPerson}
                    className={classes.ModalOpener}
                    type="primary"
                    onClick={() => {
                      setPassportTableVisible(true);
                    }}>
                    {t('add-new')} +
                  </Button>

                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={passportTableVisible}
                    timeout={300}
                  >
                    <PassportModal
                      visible={passportTableVisible}
                      onCancel={closePassportModal}
                      onCreate={createPassportDataHandler}
                      tableData={passportData}
                      status={status}
                    />
                  </CSSTransition>

                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={editPassportTableVisible}
                    timeout={300}
                  >
                    <EditPassportModal
                      visible={editPassportTableVisible}
                      onCancel={() => setEditPassportTableVisible(false)}
                      onEdit={editPassportDataHandler}
                      tableData={passportData}
                      status={status}
                      data={editPassportData}
                    />
                  </CSSTransition>

                  <Table
                    bordered
                    className='main-table'
                    rowClassName="table-row"
                    columns={passportColumns}
                    dataSource={passportData.filter(item => item.Status !== 3)}
                    rowKey={record => record.ID === 0 ? record.key : record.ID}
                    pagination={false}
                    onRow={(record) => {
                      if (!validPerson) {
                        return {
                          onDoubleClick: () => {
                            setEditPassportTableVisible(true);
                            setEditPassportData(record);
                          },
                        };
                      }
                    }}
                  />
                </Card>
              </TabPane>
              <TabPane tab={t("Образование и стаж работы")} key="7" forceRender>
                <Card>
                  <Row gutter={[15, 0]}>
                    <Col xl={4} lg={12}>
                      <Form.Item
                        label={t('generalExperienceYear')}
                        name='GeneralExperienceYear'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                          },
                        ]}>
                        <Input placeholder={t('generalExperienceYear')} />
                      </Form.Item>
                    </Col>
                    <Col xl={4} lg={12}>
                      <Form.Item
                        label={t('generalExperienceMonth')}
                        name='GeneralExperienceMonth'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                          },
                        ]}>
                        <Input placeholder={t('generalExperienceMonth')} />
                      </Form.Item>
                    </Col>
                    <Col xl={4} lg={12}>
                      <Form.Item
                        label={t('generalExperienceDay')}
                        name='GeneralExperienceDay'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                          },
                        ]}>
                        <Input placeholder={t('generalExperienceDay')} />
                      </Form.Item>
                    </Col>
                    <Col xl={4} lg={12}>
                      <Form.Item
                        label={t('experienceInFieldYear')}
                        name='ExperienceInFieldYear'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                          },
                        ]}>
                        <Input placeholder={t('experienceInFieldYear')} />
                      </Form.Item>
                    </Col>
                    <Col xl={4} lg={12}>
                      <Form.Item
                        label={t('experienceInFieldMonth')}
                        name='ExperienceInFieldMonth'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                          },
                        ]}>
                        <Input placeholder={t('experienceInFieldMonth')} />
                      </Form.Item>
                    </Col>
                    <Col xl={4} lg={12}>
                      <Form.Item
                        label={t('experienceInFieldDay')}
                        name='ExperienceInFieldDay'
                        rules={[
                          {
                            required: true,
                            message: t('inputValidData'),
                          },
                        ]}>
                        <Input placeholder={t('experienceInFieldDay')} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button
                    className={classes.ModalOpener}
                    type="primary"
                    onClick={() => {
                      setEducationTableVisible(true);
                    }}>
                    {t('add-new')}&nbsp;+
                  </Button>

                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={educationTableVisible}
                    timeout={300}
                  >
                    <EducationModal
                      visible={educationTableVisible}
                      onCancel={closeEducationModal}
                      onCreate={createEducationDataHandler}
                      tableData={educationData}
                    />
                  </CSSTransition>

                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={editEducationModalVisible}
                    timeout={300}
                  >
                    <EditEducationModal
                      visible={editEducationModalVisible}
                      onCancel={() => setEditEducationModalVisible(false)}
                      onEdit={editEducationDataHandler}
                      tableData={educationData}
                      data={editEducationData}
                    />
                  </CSSTransition>

                  <Table
                    bordered
                    rowClassName="table-row"
                    className='main-table'
                    columns={educationColumns}
                    dataSource={educationData.filter(item => item.Status !== 3)}
                    rowKey={record => record.ID === 0 ? record.key : record.ID}
                    pagination={false}
                    onRow={(record) => {
                      return {
                        onDoubleClick: () => {
                          setEditEducationModalVisible(true);
                          setEditEducationData(record);
                        },
                      };
                    }}
                  />
                </Card>
              </TabPane>
            </Tabs>
            <Space size='middle' className='btns-wrapper'>
              <Button
                type="danger"
                onClick={() => {
                  history.goBack();
                  Notification('warning', t('not-saved'))
                }}
              >
                {t('back')}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
              >
                {t('save')}
              </Button>
            </Space>
          </Form>
        </Spin>
      </MainCard>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        timeout={300}
        in={explanationModalVisible}
      >
        <ExplanationModal
          visible={explanationModalVisible}
          onCancel={() => setExplanationModalVisible(false)}
        />
      </CSSTransition>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={historyModalVisible}
        timeout={300}
      >
        <HistoryModal
          visible={historyModalVisible}
          id={props.match.params.id ? props.match.params.id : 0}
          columnName={historyInputName}
          onCancel={closeHistoryModalHandler}
        />
      </CSSTransition>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        timeout={300}
        in={plasticModalVisible}
      >
        <PlasticModal
          visible={plasticModalVisible}
          bankCode={bankParent}
          bankParentCode={bankParentCode}
          INPSCode={INPSCode}
          onCancel={() => setPlasticModalVisible(false)}
          onOk={plasticCardsHandler}
        />
      </CSSTransition>
    </Fade>
  );
};

export default UpdateEmployee;
