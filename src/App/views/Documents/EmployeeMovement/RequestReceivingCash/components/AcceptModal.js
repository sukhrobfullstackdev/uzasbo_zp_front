import React, { useEffect, useState } from 'react'
import { InfoCircleTwoTone } from '@ant-design/icons';
import { Button, Checkbox, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import OrganizationServices from '../../../../../../services/Organization/organization.services';
import { Notification } from '../../../../../../helpers/notifications';

const AcceptModal = () => {
    const { t } = useTranslation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [disabled, setDisabled] = useState(true);
    // const [chapterCode, setChapterCode] = useState(null);

    const handleCheckboxChange = () => {
        setDisabled(false)
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    //  075 => maktab
    //  251 => bog'cha

    const userInfo = (JSON.parse(localStorage.getItem('userInfo')));

    useEffect(() => {
        OrganizationServices.getById(userInfo.OrgID)
            .then((res) => {
                if (res.data.ChapterCode === '075' && userInfo.Roles.includes("CentralAccountingChild")) {
                    setIsModalVisible(true);
                }
            }).catch((err) => {
                Notification("error", err);
            })
    }, [])

    return (
        <Modal
            title={[
                <div key="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <InfoCircleTwoTone style={{ fontSize: '24px' }} />
                    <div style={{ marginLeft: '8px' }}>{t('Notification')}</div>
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
            <div style={{ fontSize: '16px' }}>
                <div style={{ textIndent: '20px' }}>
                    Жисмоний шахслардан олинадиган даромад солиғи, шахсий жамғариб бориладиган пенсия ҳисобварағи
                    бадали (Удержание в ИНПС), касаба уюшмаси бадали ва мажбурий тўловлардан (алиментлар, суд қарорлари)
                    бошқа барча ушланмаларга чеклов ўрнатилди. Жисмоний шахслардан олинадиган даромад солиғидан
                    имтиёзга эга бўлган <b>(ипотека кредити, контракт тўловлари, ҳаётни узоқ муддатли суғурта қилиш
                        , ихтиёрий равишда шахсий жамғариб бориладиган пенсия ҳисобварағига тўловлар)</b> ушланмалари бор
                    ташкилотлар тегишли ходимлар рўйхатини ҳудудий халқ таълими бошқармаларига тақдим этишингизни
                    сўраймиз.
                </div>
                <div style={{ marginTop: '16px', textIndent: '20px' }}>
                    Были введены ограничения на все удержания, кроме НДФЛ, взноса на накопительный пенсионный счет
                    (Удержание в ИНПС), профсоюзного взноса и обязательных платежей (алименты, решения суда).
                    Организациям, имеющим льготы по НДФЛ <b>(ипотечные кредиты, договорные выплаты, долгосрочное
                        страхование жизни, выплаты на счет добровольной индивидуальной накопительной пенсии)</b>,
                    предлагается представить список соответствующих работников в областные управления народного
                    образования.
                </div>
                <Checkbox
                    style={{ marginTop: '16px', fontSize: '16px' }}
                    onChange={handleCheckboxChange}
                >
                    <b>{t('Я прочитал')}</b>
                </Checkbox>
            </div>
        </Modal>
    )
}

export default AcceptModal;