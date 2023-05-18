import React, { useEffect, useState } from 'react'
import { InfoCircleTwoTone } from '@ant-design/icons';
import { Button, Checkbox, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

// import { Notification } from '../../../../../helpers/notifications';
// import classes from '../../Employee.module.scss';
// import AddEmployee1 from '../../../../../../../assets/images/AddEmployee-1.png';
// import AddEmployee2 from '../../../../../../../assets/images/AddEmployee-2.png';
// import letter from '../../../../../../assets/files/letter.pdf'

const ExplanationModal = () => {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleCheckboxChange = () => {
    setDisabled(false)
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const userInfo = (JSON.parse(localStorage.getItem('userInfo')));

  useEffect(() => {
    if (!userInfo.Roles.includes("ChangeUserEDS") || !userInfo.Roles.includes("MilitaryPlasticCardUpload") || !userInfo.Roles.includes("CentralAccountingParent")) {
      setIsModalVisible(true);
    }
  }, [])

  return (
    <Modal
      title={[
        <div key="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <InfoCircleTwoTone style={{ fontSize: '24px' }} />
          <div style={{ marginLeft: '8px', fontSize: '18px' }}>{t('Notification')}</div>
        </div>
      ]}
      visible={isModalVisible}
      width={992}
      closable={false}
      onOk={handleOk}
      footer={[
        <Button key="submit" disabled={disabled} type="primary" onClick={handleOk}>
          {t('close')}
        </Button>,
      ]}
    >
      <div style={{ fontSize: '18px' }}>

        <div style={{ textIndent: '20px' }}>
          Ўзбекистон Республикаси Молия вазирининг 2022-йил 1-февралдаги 14-сонли буйруғига асосан UzASBO
          дастуридаги барча ходимларни <b>(ташкилотда меҳнат фаолиятини олиб бораётганларини, ишдан кетган
            ходимларни текшириш талаб этилмайди)</b> 2022 йилнинг 1 июнь санасига қадар верификациядан ўтказиб
          олиш талаб этилади. Верификациядан ўтказиш учун тегишли ходим таҳрирланади ва тепада ЖШШИР
          рақами ёнига паспорт серияси ва рақами киритилиб, қидирув тугмаси босилади. Верификациядан
          ўтган ходимларда Текширилган устунида байроқча (галочка) турган бўлади, текширилмаганларида
          эса сўроқ белгиси туради. Zp.uzasbo.uz манзили орқали Учет кадров – Реестр сотрудников
          бўлимида ишлаётган ходимларни текширилган ёки текширилмаганини осон топиш мумкин.
        </div>
        <div style={{ marginTop: '16px', textIndent: '20px' }}>
          Согласно приказу Министра финансов Республики Узбекистан №14 от 1 февраля 2022 года,
          все сотрудники, введённые в программу «UzASBO» <b>(работающие в организации, проверка
            уволенных сотрудников не требуется)</b> должны пройти верификацию до 1 июня 2022 года.
          Для проверки редактируется соответствующий сотрудник и вводится серия и номер паспорта
          рядом с номером ИНПС вверху и нажимается кнопка поиска. Пройденные верификацию сотрудники
          будут отмечены галочкой в столбце «Проверенные», а непроверенные — вопросительным знаком.
          В zp.uzasbo.uz легко найти сотрудников, прошедших или не прошедших верификацию в
          разделе Учет кадров - Реестр сотрудников.
        </div>
        <Checkbox
          style={{ marginTop: '16px', fontSize: '18px' }}
          onChange={handleCheckboxChange}
        >
          <b>{t('Я прочитал')}</b>
        </Checkbox>
      </div>
    </Modal>
  )
};

export default ExplanationModal;