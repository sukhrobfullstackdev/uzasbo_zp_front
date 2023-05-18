import React, { useEffect, useState } from 'react'
import { InfoCircleTwoTone } from '@ant-design/icons';
import { Button, Checkbox, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { Notification } from "../../../helpers/notifications";
import UserServices from '../../../services/Documents/Admin/User/User.services';

const AcceptModal = () => {
    const { t } = useTranslation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const handleCheckboxChange = () => {
        setDisabled(false)
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    // const userInfo = (JSON.parse(localStorage.getItem('userInfo')));


    useEffect(() => {
        async function fetchData() {
            try {
                const userInfo = await UserServices.getUserInfo();
                setIsModalVisible(userInfo.data.IsShowNews);

            } catch (err) {
                Notification('error', err);
            }
        }
        fetchData();
        // if (!userInfo.Roles.includes("ChangeUserEDS") || !userInfo.Roles.includes("MilitaryPlasticCardUpload") || !userInfo.Roles.includes("CentralAccountingParent")) {
        //     setIsModalVisible(true);
        // }

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
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'red', marginBottom: 32 }}>ДИҚҚАТ !!!</div>
                <div style={{ textIndent: '20px', textAlign: 'justify' }}>
                    O`zbekiston Respublikasi moliya vazirligining 2022 yil 29 dekabrdagi 06/03-16-/21 sonli xatiga muvofiq <b>ish haqi hisobini</b> 2023-yil
                    fevral oyidan boshlab yangilangan <a href="https://uzasbo.uz/auth/login">uzasbo.uz </a>
                    tizimida yuritishingiz talab etiladi. Video qo`llanma bo`yicha
                    <a href="https://www.youtube.com/@uzasbo2"> havola</a>.
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
}

export default AcceptModal;

{/* <div style={{ marginBottom: 32, textIndent: '20px', textAlign: 'justify' }}>
    <b>1. Ish haqi ushlanmalariga qoʼyilgan cheklovlar bekor qilindi.</b>
</div>
<div style={{ textIndent: '20px', textAlign: 'justify' }}>
    2. O'zbekiston Respublikasi Moliya vazirligining 2022-yil 21-iyundagi YT42177526-sonli xatiga
    asosan UzASBO dasturida to'lov qaydnomalariga 2022-yil <b>1-iyuldan</b> nazorat o'rnatilganligi
    sababli barcha xodimlarni verifikatsiyadan o'tkazilishini nazorat qilishingizni talab
    qilamiz.
</div> */}

{/* <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'red', marginBottom: 16 }}>ДИҚҚАТ !!!</div>
<div style={{ textIndent: '20px' }}>
    Бюджет ташкилотларида ўтказиладиган ҳар қандай текширишлар «Давлат аудити» дастурий комплексида рўйхатга олиниши шарт!
</div>
<div style={{ textIndent: '20px' }}>
    Акс ҳолда назорат тадбирлари, шу жумладан ички аудит хизматларининг аудит тадбирлари <b style={{ color: 'red' }}>ноқонуний ҳисобланади.</b>
</div>
<div style={{ textIndent: '20px' }}>
    <b>Ҳурматли бюджет ташкилотлари раҳбарлари!</b>
</div>
<div style={{ textIndent: '20px' }}>
    - молиявий назорат тадбирларини ўтказиш учун асос бўлган буйруқларни «Давлат аудити» дастурий комплексидан <b>QR-код орқали текшириб кўришни;</b>
</div>
<div style={{ textIndent: '20px' }}>
    - ҳар қандай назорат тадбири бошланишидан олдин уни «Давлат аудити» дастурий комплексининг <b>электрон китобида рўйхатга олишни;</b>
</div>
<div style={{ textIndent: '20px' }}>
    - назорат тадбири якунида дастур орқали ўз фикрингизни билдиришни унутманг!
</div> */}

{/* <div style={{ textIndent: '20px' }}>
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
</div> */}

{/* <div style={{ textIndent: '20px', textAlign: 'justify' }}>
    <b>Moliya vazirligining 2022-yil 19-oktyabrdagi CY64112432-sonli xati</b>ga asosan budjet tashkilot
    xodimi nomiga rasmiylashtirilgan vaqtincha mehnatga qobiliyatsizlik varaqasini “UzASBO”
    dasturiy majmuasidan kiritish 2022-yil 21-noyabrdan bekor qilinadi. Vaqtincha mehnatga
    qobiliyatsizlik varaqasini faqatgina “Tibbiyot axborot tizimi”dan elektron shaklda “UzASBO”
    dasturiy majmuasiga yuborish orqali oylik to‘lovlar amalga oshirilishini ma’lum qilamiz.
</div> */}