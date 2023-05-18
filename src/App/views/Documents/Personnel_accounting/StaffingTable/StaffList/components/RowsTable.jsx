import { Input, Table } from 'antd'
import React, { useCallback, useEffect } from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const RowsTable = (props) => {
    const { t } = useTranslation();

    const [Rows, setRows] = useState(props.rowTableData)

    const rowColumns = [
        {
            title: t("StaffListRowType"),
            dataIndex: "StaffListRowTypeName",
            key: "StaffListRowTypeName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("StaffQuantity"),
            dataIndex: "StaffQuantity",
            key: "StaffQuantity",
            sorter: true,
            width: 50,
            render: record => new Intl.NumberFormat('ru-RU', {}).format(record),
        },
        {
            title: t("FOT"),
            dataIndex: "FOT",
            key: "FOT",
            sorter: true,
            width: 50,
            render: (_, record) => {
                return ((props.stafflist?.SettlementAccountItemOfExpense !== "7092100075") && (record.CanEdit) && (record.Status === 1 || record.Status === 2)) ? (
                    <Input
                        // ref={inputRef}
                        // onPressEnter={(e) => { saveInput(e, record); inputRef.current.blur(); }}
                        onBlur={(e) => saveInput(e, record)} defaultValue={record.FOT}
                        placeholder={t('FOT')}
                    />
                ) : (
                    <>{new Intl.NumberFormat('ru-RU', {}).format(record.FOT)} UZS</>
                )
            }
        },
    ]

    const saveInput = useCallback((e, record) => {
        record.FOT = parseInt(e.target.value)
        // record.Status = 2;

        let total = 0;
        let newRows = props.rowTableData.map(item => {
            if (item.StaffListRowTypeID !== 15) {
                total += item.FOT;
            }
            if (item.StaffListRowTypeID === 15) {
                item.FOT = total
            }
            return item
        })
        setRows(newRows)
    }, [props.rowTableData])

    // const calculateTotal = useCallback((e, record) => {
    //     let total = 0;
    //     let totalquantity = 0;

    //     let count = 0;
    //     let countconstant = 0;
    //     let totalincomeconstant = 0;
    //     let quantityconstant = 0;
    //     let countseasonal = 0;
    //     let totalincomeseasonal = 0;
    //     let quantityseasonal = 0;
    //     let replacedpositionsum = 0;
    //     let countconstantseasonal = 0;
    //     let totalincomeconstantseasonal = 0;
    //     let quantityconstantseasonal = 0;
    //     let totalincomeconstantseasonalforyear = 0;
    //     let allowanceType60sum = 0;//Халқаро олимпиадалар ғолибларини тайёрлаган таълим муассасаси директорларига устама
    //     let allowanceType62sum = 0;//Психолог ва кутубхоначи учун устама (Дир. жамғармасидан)

    //     if (props.stafflist?.SettlementAccountItemOfExpense === '7092100075') {// XTV uchun
    //         props.Tables.map(item => {
    //             if (item.Status !== 3 && item.PositionPeriodicityID === 1) {
    //                 totalincomeconstant = totalincomeconstant + item.FOT;
    //                 countconstant = countconstant + 1;
    //                 quantityconstant = quantityconstant + item.StaffQuantity * 1;
    //             }
    //             if (item.Status !== 3 && item.PositionPeriodicityID === 2) {
    //                 totalincomeseasonal = totalincomeseasonal + item.FOT;
    //                 countseasonal = countseasonal + 1;
    //                 quantityseasonal = quantityseasonal + item.StaffQuantity * 1;
    //             }
    //             if (item.Status !== 3 && item.PositionPeriodicityID === 3) {
    //                 totalincomeconstantseasonal = totalincomeconstantseasonal + item.FOT;
    //                 totalincomeconstantseasonalforyear = totalincomeconstantseasonalforyear + item.FOT * item.PPMonthCount;
    //                 countconstantseasonal = countconstantseasonal + 1;
    //                 quantityconstantseasonal = quantityconstantseasonal + item.StaffQuantity * 1;
    //             }
    //             if (item.Status !== 3) {
    //                 allowanceType60sum = allowanceType60sum + item.AllowanceType60 * item.StaffQuantity * item.PPMonthCount;
    //                 allowanceType62sum = allowanceType62sum + item.AllowanceType62 * item.StaffQuantity * item.PPMonthCount;
    //             }

    //             total = Math.round(totalincomeconstant + totalincomeseasonal + totalincomeconstantseasonal, 2);
    //             totalquantity = Math.round(quantityconstant + quantityseasonal + quantityconstantseasonal, 2);

    //             item.TotalStaffRate = totalquantity;
    //             item.TotalRate = totalquantity;

    //             count = countconstant + countseasonal + countconstantseasonal;
    //             let rowvalue4 = 0;
    //             let rowvalue5 = 0;
    //             let rowvalue6 = 0;
    //             let rowvalue7 = 0;
    //             let rowvalue8 = 0;
    //             let rowvalue9 = 0;
    //             let rowvalue10 = 0;
    //             let rowvalue11 = 0;
    //             let rowvalue12 = 0;
    //             let rowvalue13 = 0;
    //             let rowvalue14 = 0;

    //             props.rowTableData.map((item) => {
    //                 if (props.stafflist?.SettleCodeLevel === '100010' && props.stafflist?.Year === 2023) {
    //                     if (item.StaffListRowTypeID === 1) {
    //                         item.StaffQuantity = quantityconstant;
    //                         item.FOT = totalincomeconstant;
    //                     }
    //                     if (item.StaffListRowTypeID === 2) {
    //                         item.StaffQuantity = quantityseasonal;
    //                         item.FOT = totalincomeseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 16) {
    //                         item.StaffQuantity = quantityconstantseasonal;
    //                         item.FOT = totalincomeconstantseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 3) {
    //                         item.StaffQuantity = quantityconstant + quantityseasonal + quantityconstantseasonal;
    //                         item.FOT = totalincomeconstant + totalincomeseasonal + totalincomeconstantseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 4 && props.stafflist?.ForMonths === 12) {
    //                         item.FOT = Math.round(totalincomeconstant + totalincomeconstant * 1.07 * 11 + totalincomeseasonal * 5 + totalincomeconstantseasonalforyear * 1, 0);
    //                         rowvalue4 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 4 && props.stafflist?.ForMonths < 12) {
    //                         item.FOT = Math.round(totalincomeconstant * 1.07 * props.stafflist?.ForMonths + totalincomeseasonal * 5 + totalincomeconstantseasonalforyear * 1, 0);
    //                         rowvalue4 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 5) {
    //                         item.FOT = Math.round(rowvalue4 * 98 / 100, 0);
    //                         rowvalue5 = item.FOT;
    //                     }
    //                     if (props.stafflist?.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 6) {
    //                             item.CanEdit = false;
    //                             if (props.stafflist?.TotalBillingListSum > 0)
    //                                 item.FOT = Math.round(props.stafflist?.TotalBillingListSum, 0);
    //                             rowvalue6 = item.FOT;
    //                         }
    //                     }
    //                     else if (item.StaffListRowTypeID === 6) {
    //                         rowvalue6 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 7 && props.stafflist?.ForMonths === 12) {
    //                         item.FOT = Math.round(rowvalue6 * 1 + rowvalue6 * 1.07 * 11, 0);
    //                         rowvalue7 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 7 && props.stafflist?.ForMonths < 12) {
    //                         item.FOT = Math.round(rowvalue6 * 1.07 * props.stafflist?.ForMonths, 0);
    //                         rowvalue7 = item.FOT;
    //                     }
    //                     if (props.stafflist?.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 8) {
    //                             item.CanEdit = false;
    //                             if (props.stafflist?.ExternalStaff > 0)
    //                                 item.FOT = Math.round(props.stafflist.ExternalStaff * 1, 0);
    //                             rowvalue8 = item.FOT;
    //                         }
    //                     }
    //                     else if (item.StaffListRowTypeID === 8) {
    //                         rowvalue8 = item.FOT;
    //                     }
    //                     if (props.stafflist?.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             //item.CanEdit(false);
    //                             //item.FOT(round(self.stafflist.TeachersTraining() * 1, 0));
    //                             rowvalue9 = item.FOT;
    //                         }

    //                     }
    //                     else if (props.stafflist?.SettlementAccountItemOfExpense === '7091100251') {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue4 * 0.06, 0);
    //                             rowvalue9 = item.FOT;
    //                         }
    //                     }
    //                     else {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             rowvalue9 = item.FOT;
    //                         }
    //                     }
    //                     if (item.StaffListRowTypeID === 10) {
    //                         rowvalue10 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 11) {
    //                         rowvalue11 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 12) {
    //                         if (props.stafflist?.SettlementAccountItemOfExpense === '7091100251') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue5 * 0.1, 0);
    //                             rowvalue12 = item.FOT;
    //                         }
    //                         else {
    //                             rowvalue12 = item.FOT;
    //                         }

    //                     }
    //                     if (props.stafflist?.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 13) {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round((rowvalue5 * 1 + rowvalue7 * 1 + rowvalue8 * 1) * 0.08, 0);
    //                             rowvalue13 = item.FOT;
    //                         }

    //                     }
    //                     else if (item.StaffListRowTypeID === 13) {

    //                         rowvalue13 = item.FOT;
    //                         // console.log(rowvalue13);
    //                     }
    //                     if (item.StaffListRowTypeID === 14) {
    //                         if (props.stafflist?.SettlementAccountItemOfExpense === '7092100075') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue7 / 100, 0)
    //                             rowvalue14 = item.FOT;
    //                         }
    //                         else if (props.stafflist?.SettlementAccountItemOfExpense === '7091100251') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue5 * 0.01, 0);
    //                             rowvalue14 = item.FOT;
    //                         }
    //                         else {
    //                             rowvalue14 = item.FOT;
    //                         }
    //                     }
    //                     if (item.StaffListRowTypeID === 15) {
    //                         item.FOT = 0;
    //                         item.FOT = rowvalue5 * 1 + rowvalue7 * 1 + rowvalue8 * 1 + rowvalue9 * 1 + rowvalue10 * 1 + rowvalue11 * 1 + rowvalue12 * 1 + rowvalue13 * 1 + rowvalue14 * 1;
    //                         props.stafflist.TotalSum = item.FOT;
    //                     }
    //                     return null;
    //                 } else {
    //                     //Доимий ишчилар жами
    //                     if (item.StaffListRowTypeID === 1) {
    //                         item.StaffQuantity = quantityconstant;
    //                         item.FOT = totalincomeconstant;
    //                     }
    //                     //Мавсумий ишчилар жами
    //                     if (item.StaffListRowTypeID === 2) {
    //                         item.StaffQuantity = quantityseasonal;
    //                         item.FOT = totalincomeseasonal;
    //                     }
    //                     //Постоянно-сезонный  
    //                     if (item.StaffListRowTypeID === 16) {
    //                         item.StaffQuantity = quantityconstantseasonal;
    //                         item.FOT = totalincomeconstantseasonal;
    //                     }
    //                     //Маъмурий бошқарув.хўжалик ўқув бўлимлари ва бошқа ходимларнинг бир ойлик иш хақи бўйича жами
    //                     if (item.StaffListRowTypeID === 3) {
    //                         item.StaffQuantity = quantityconstant + quantityseasonal + quantityconstantseasonal;
    //                         item.FOT = totalincomeconstant + totalincomeseasonal + totalincomeconstantseasonal;
    //                     }
    //                     //Шунинг ўзи бир йилда
    //                     if (item.StaffListRowTypeID === 4) {
    //                         item.FOT = Math.round(totalincomeconstant * props.stafflist?.ForMonths + totalincomeseasonal * 5 + totalincomeconstantseasonalforyear * 1, 0) - (allowanceType60sum + allowanceType62sum);
    //                         rowvalue4 = item.FOT;
    //                     }
    //                     //Шунинг ўзи вақтинча меҳнатга қобилиятсизлик варақалари ва бўш иш жойлари бўйича тежалганнинг ҳисоби билан
    //                     if (item.StaffListRowTypeID === 5) {
    //                         item.FOT = Math.round(rowvalue4 * 98 / 100, 0);
    //                         rowvalue5 = item.FOT;
    //                     }
    //                     //Тарификация бўйича ходимларнинг (педагог, тиббиёт ва бошқа) меҳнатга ҳақ тўлаш жамғармаси бир ойда
    //                     if (item.StaffListRowTypeID === 6) {
    //                         item.CanEdit = false;
    //                         if (props.stafflist?.TotalBillingListSum > 0)
    //                             item.FOT = Math.round(props.stafflist?.TotalBillingListSum, 0);
    //                         rowvalue6 = item.FOT;
    //                     }
    //                     //Шунинг ўзи бир йилда
    //                     if (item.StaffListRowTypeID === 7) {
    //                         item.FOT = Math.round(rowvalue6 * props.stafflist?.ForMonths, 0);
    //                         rowvalue7 = item.FOT;
    //                     }
    //                     //Соатбай (ишбай) меҳнатга ҳақ тўлаш жамғармаси бир йилда
    //                     if (item.StaffListRowTypeID === 8) {
    //                         item.CanEdit = false;
    //                         if (props.stafflist?.ExternalStaff > 0)
    //                             item.FOT = Math.round(props.stafflist?.ExternalStaff * 1, 0);
    //                         rowvalue8 = item.FOT;

    //                     }
    //                     //Ходимларнинг таътил даврида, кечки, навбатчилик ва байрам вақтларида ўрин алмашиш учун йиллик меҳнатга ҳақ тўлаш жамғармаси
    //                     if (item.StaffListRowTypeID === 9) {
    //                         item.CanEdit = false;
    //                         //item.FOT(round(self.stafflist.TeachersTraining() * 1, 0));
    //                         rowvalue9 = item.FOT;
    //                     }
    //                     //Узоқ йиллик меҳнати учун бир марталик рағбатлантиришни тўлаш, моддий ёрдам кўрсатиш, мукофотлаш учун меҳнатга ҳақ тўлаш жамғармаси
    //                     if (item.StaffListRowTypeID === 10) {
    //                         item.CanEdit = false;
    //                         rowvalue10 = item.FOT;
    //                     }
    //                     //Узоқ йиллик меҳнати ва махсус унвонлар (малака даражаси, даражали унвон, дипломатик мартаба ва бошқалар) учун 
    //                     // ойлик устамалар ва қўшимчаларни ўрнатиш учун меҳнатга ҳақ тўлаш жамғармаси
    //                     if (item.StaffListRowTypeID === 11) {
    //                         item.CanEdit = false;
    //                         rowvalue11 = item.FOT;
    //                     }
    //                     //Бюджет ташкилотлари ва муассасалари ходимларини моддий рағбатлантириш махсус жамғармаси, йиллик
    //                     if (item.StaffListRowTypeID === 12) {
    //                         item.CanEdit = false;
    //                         rowvalue12 = item.FOT;
    //                     }
    //                     //Таълим муассасаларининг директор жамғармаси, йиллик
    //                     if (item.StaffListRowTypeID === 13) {
    //                         item.CanEdit = false;
    //                         item.FOT = Math.round((rowvalue5 * 1 + rowvalue7 * 1 + rowvalue8 * 1) * 0.12, 0);// 12 -> 08 Muhammadtoxir 21.12.2022 chora tadbir 
    //                         rowvalue13 = item.FOT;
    //                     }
    //                     //Вақтинча меҳнатга қобилиятсизлик варақалари тўлови, йиллик
    //                     if (item.StaffListRowTypeID === 14) {
    //                         item.CanEdit = false;
    //                         item.FOT = Math.round((rowvalue4 + rowvalue7 + rowvalue8) / 100, 0)
    //                         rowvalue14 = item.FOT;
    //                     }
    //                     //Жами меҳнатга ҳақ тўлаш жамғармаси йиллик
    //                     if (item.StaffListRowTypeID === 15) {
    //                         item.FOT = 0;
    //                         item.FOT = rowvalue5 * 1 + rowvalue7 * 1 + rowvalue8 * 1 + rowvalue9 * 1 + rowvalue10 * 1 + rowvalue11 * 1 + rowvalue12 * 1 + rowvalue13 * 1 + rowvalue14 * 1;
    //                         props.stafflist.TotalSum = item.FOT;
    //                     }
    //                 }
    //                 return null;
    //             })
    //             return null;
    //         })
    //     } else { // XTV dan boshqa tashkilotlar
    //         props.Tables.map(item => {
    //             if (item.Status !== 3 && item.PositionPeriodicityID === 1) {
    //                 totalincomeconstant = totalincomeconstant + item.FOT;
    //                 countconstant = countconstant + 1;
    //                 quantityconstant = quantityconstant + item.StaffQuantity * 1;
    //             }
    //             if (props.stafflist.SettlementAccountItemOfExpense === '7091100251') {
    //                 //----------------Годовой фонд оплаты труда на замещение работников во время отпусков, дежурства, праздников, в ночное время------------MTM uchun
    //                 if (item.Status !== 3) {
    //                     if (item.PositionID === 209 || item.PositionID === 216 || item.PositionID === 219 || item.PositionID === 220 || item.PositionID === 223 || item.PositionID === 224 ||
    //                         item.PositionID === 3976 || item.PositionID === 221 || item.PositionID === 230 || item.PositionID === 1678049 || item.PositionID === 1678121) {
    //                         replacedpositionsum = replacedpositionsum + item.FOT;
    //                     }
    //                 }
    //             }
    //             if (item.Status !== 3 && item.PositionPeriodicityID === 2) {
    //                 totalincomeseasonal = totalincomeseasonal + item.FOT;
    //                 countseasonal = countseasonal + 1;
    //                 quantityseasonal = quantityseasonal + item.StaffQuantity * 1;
    //             }
    //             if (item.Status !== 3 && item.PositionPeriodicityID === 3) {
    //                 totalincomeconstantseasonal = totalincomeconstantseasonal + item.FOT;
    //                 totalincomeconstantseasonalforyear = totalincomeconstantseasonalforyear + item.FOT * item.PPMonthCount;
    //                 countconstantseasonal = countconstantseasonal + 1;
    //                 quantityconstantseasonal = quantityconstantseasonal + item.StaffQuantity * 1;
    //             }

    //             total = Math.round(totalincomeconstant + totalincomeseasonal + totalincomeconstantseasonal, 2);
    //             totalquantity = Math.round(quantityconstant + quantityseasonal + quantityconstantseasonal, 2);

    //             item.TotalStaffRate = totalquantity;
    //             item.TotalRate = totalquantity;

    //             count = countconstant + countseasonal + countconstantseasonal;
    //             let rowvalue4 = 0;
    //             let rowvalue5 = 0;
    //             let rowvalue6 = 0;
    //             let rowvalue7 = 0;
    //             let rowvalue8 = 0;
    //             let rowvalue9 = 0;
    //             let rowvalue10 = 0;
    //             let rowvalue11 = 0;
    //             let rowvalue12 = 0;
    //             let rowvalue13 = 0;
    //             let rowvalue14 = 0;

    //             props.rowTableData.map((item) => {
    //                 if (props.stafflist?.SettleCodeLevel === '100010' && props.stafflist?.Year === 2023) {
    //                     if (item.StaffListRowTypeID === 1) {
    //                         item.StaffQuantity = quantityconstant;
    //                         item.FOT = totalincomeconstant;
    //                     }
    //                     if (item.StaffListRowTypeID === 2) {
    //                         item.StaffQuantity = quantityseasonal;
    //                         item.FOT = totalincomeseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 16) {
    //                         item.StaffQuantity = quantityconstantseasonal;
    //                         item.FOT = totalincomeconstantseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 3) {
    //                         item.StaffQuantity = quantityconstant + quantityseasonal + quantityconstantseasonal;
    //                         item.FOT = totalincomeconstant + totalincomeseasonal + totalincomeconstantseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 4 && props.stafflist.ForMonths === 12) {
    //                         item.FOT = Math.round(totalincomeconstant + totalincomeconstant * 1.07 * 11 + totalincomeseasonal * 5 + totalincomeconstantseasonalforyear * 1, 0);
    //                         rowvalue4 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 4 && props.stafflist.ForMonths < 12) {
    //                         item.FOT = Math.round(totalincomeconstant * 1.07 * props.stafflist.ForMonths + totalincomeseasonal * 5 + totalincomeconstantseasonalforyear * 1, 0);
    //                         rowvalue4 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 5) {
    //                         item.FOT = Math.round(rowvalue4 * 98 / 100, 0);
    //                         rowvalue5 = item.FOT;
    //                     }
    //                     if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 6) {
    //                             item.CanEdit = false;
    //                             if (props.stafflist.TotalBillingListSum > 0)
    //                                 item.FOT = Math.round(props.stafflist.TotalBillingListSum, 0);
    //                             rowvalue6 = item.FOT;
    //                         }
    //                     }
    //                     else if (item.StaffListRowTypeID === 6) {
    //                         rowvalue6 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 7 && props.stafflist.ForMonths === 12) {
    //                         item.FOT = Math.round(rowvalue6 * 1 + rowvalue6 * 1.07 * 11, 0);
    //                         rowvalue7 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 7 && props.stafflist.ForMonths < 12) {
    //                         item.FOT = Math.round(rowvalue6 * 1.07 * props.stafflist.ForMonths, 0);
    //                         rowvalue7 = item.FOT;
    //                     }
    //                     if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 8) {
    //                             item.CanEdit = false;
    //                             if (props.stafflist.ExternalStaff > 0)
    //                                 item.FOT = Math.round(props.stafflist.ExternalStaff * 1, 0);
    //                             rowvalue8 = item.FOT;
    //                         }
    //                     }
    //                     else if (item.StaffListRowTypeID === 8) {
    //                         rowvalue8 = item.FOT;
    //                     }
    //                     if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             //item.CanEdit(false);
    //                             //item.FOT(round(self.stafflist.TeachersTraining() * 1, 0));
    //                             rowvalue9 = item.FOT;
    //                         }

    //                     }
    //                     else if (props.stafflist.SettlementAccountItemOfExpense === '7091100251') {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue4 * 0.06, 0);
    //                             rowvalue9 = item.FOT;
    //                         }
    //                     }
    //                     else {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             rowvalue9 = item.FOT;
    //                         }
    //                     }
    //                     if (item.StaffListRowTypeID === 10) {
    //                         rowvalue10 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 11) {
    //                         rowvalue11 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 12) {
    //                         if (props.stafflist.SettlementAccountItemOfExpense === '7091100251') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue5 * 0.1, 0);
    //                             rowvalue12 = item.FOT;
    //                         }
    //                         else {
    //                             rowvalue12 = item.FOT;
    //                         }

    //                     }
    //                     if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 13) {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round((rowvalue5 * 1 + rowvalue7 * 1 + rowvalue8 * 1) * 0.08, 0);
    //                             rowvalue13 = item.FOT;
    //                         }

    //                     }
    //                     else if (item.StaffListRowTypeID === 13) {

    //                         rowvalue13 = item.FOT;
    //                         // console.log(rowvalue13);
    //                     }
    //                     if (item.StaffListRowTypeID === 14) {
    //                         if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue7 / 100, 0)
    //                             rowvalue14 = item.FOT;
    //                         }
    //                         else if (props.stafflist.SettlementAccountItemOfExpense === '7091100251') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue5 * 0.01, 0);
    //                             rowvalue14 = item.FOT;
    //                         }
    //                         else {
    //                             rowvalue14 = item.FOT;
    //                         }
    //                     }
    //                     if (item.StaffListRowTypeID === 15) {
    //                         item.FOT = 0;
    //                         item.FOT = rowvalue5 * 1 + rowvalue7 * 1 + rowvalue8 * 1 + rowvalue9 * 1 + rowvalue10 * 1 + rowvalue11 * 1 + rowvalue12 * 1 + rowvalue13 * 1 + rowvalue14 * 1;
    //                         props.stafflist.TotalSum = item.FOT;
    //                     }
    //                     return null;
    //                 } else {
    //                     if (item.StaffListRowTypeID === 1) {
    //                         item.StaffQuantity = quantityconstant;
    //                         item.FOT = totalincomeconstant;
    //                     }
    //                     if (item.StaffListRowTypeID === 2) {
    //                         item.StaffQuantity = quantityseasonal;
    //                         item.FOT = totalincomeseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 16) {
    //                         item.StaffQuantity = quantityconstantseasonal;
    //                         item.FOT = totalincomeconstantseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 3) {
    //                         item.StaffQuantity = quantityconstant + quantityseasonal + quantityconstantseasonal;
    //                         item.FOT = totalincomeconstant + totalincomeseasonal + totalincomeconstantseasonal;
    //                     }
    //                     if (item.StaffListRowTypeID === 4) {
    //                         item.FOT = Math.round(totalincomeconstant * props.stafflist.ForMonths + totalincomeseasonal * 5 + totalincomeconstantseasonalforyear * 1, 0);
    //                         rowvalue4 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 5) {
    //                         item.FOT = Math.round((totalincomeconstant * props.stafflist.ForMonths() + totalincomeseasonal * 5 + totalincomeconstantseasonalforyear * 1) * 98 / 100, 0);
    //                         rowvalue5 = item.FOT;
    //                     }
    //                     if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 6) {
    //                             item.CanEdit = false;
    //                             if (props.stafflist.TotalBillingListSum > 0)
    //                                 item.FOT = Math.round(props.stafflist.TotalBillingListSum, 0);
    //                             rowvalue6 = item.FOT;
    //                         }
    //                     } else {
    //                         if (item.StaffListRowTypeID === 6) {
    //                             rowvalue6 = item.FOT;
    //                         }
    //                     }
    //                     if (item.StaffListRowTypeID === 7) {
    //                         item.FOT = Math.round(rowvalue6 * props.stafflist.ForMonths(), 0);
    //                         rowvalue7 = item.FOT;
    //                     }
    //                     if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 8) {
    //                             item.CanEdit = false;
    //                             if (props.stafflist.ExternalStaff > 0)
    //                                 item.FOT = Math.round(props.stafflist.ExternalStaff * 1, 0);
    //                             rowvalue8 = item.FOT;

    //                         }
    //                     } else {
    //                         if (item.StaffListRowTypeID === 8) {
    //                             rowvalue8 = item.FOT;
    //                         }
    //                     }
    //                     if (props.stafflist.SettlementAccountItemOfExpense() === '7092100075') {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             //item.CanEdit(false);
    //                             //item.FOT(round(self.stafflist.TeachersTraining() * 1, 0));
    //                             rowvalue9 = item.FOT;
    //                         }
    //                     } else if (props.stafflist.SettlementAccountItemOfExpense === '7091100251') {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(replacedpositionsum, 0); // 01.12.2022
    //                             rowvalue9 = item.FOT;
    //                         }
    //                     } else {
    //                         if (item.StaffListRowTypeID === 9) {
    //                             rowvalue9 = item.FOT;
    //                         }
    //                     }
    //                     if (item.StaffListRowTypeID === 10) {
    //                         rowvalue10 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 11) {
    //                         rowvalue11 = item.FOT;
    //                     }
    //                     if (item.StaffListRowTypeID === 12) {
    //                         if (props.stafflist.SettlementAccountItemOfExpense === '7091100251') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue5 * 0.1, 0); // 15 -> 10
    //                             rowvalue12 = item.FOT;
    //                         }
    //                         else {
    //                             rowvalue12 = item.FOT;
    //                         }
    //                     }
    //                     if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                         if (item.StaffListRowTypeID === 13) {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round((rowvalue5 * 1 + rowvalue7 * 1 + rowvalue8 * 1) * 0.08, 0);// 12 -> 08
    //                             rowvalue13 = item.FOT;
    //                         }

    //                     }
    //                     else {
    //                         if (item.StaffListRowTypeID === 13) {
    //                             rowvalue13 = item.FOT;
    //                         }
    //                     }
    //                     if (item.StaffListRowTypeID === 14) {
    //                         if (props.stafflist.SettlementAccountItemOfExpense === '7092100075') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue7 / 100, 0)
    //                             rowvalue14 = item.FOT;
    //                         }
    //                         else if (props.stafflist.SettlementAccountItemOfExpense === '7091100251') {
    //                             item.CanEdit = false;
    //                             item.FOT = Math.round(rowvalue5 * 0.01, 0);
    //                             rowvalue14 = item.FOT;
    //                         }
    //                         else {
    //                             rowvalue14 = item.FOT;
    //                         }
    //                     }
    //                     if (item.StaffListRowTypeID === 15) {
    //                         item.FOT = 0;
    //                         item.FOT = rowvalue5 * 1 + rowvalue7 * 1 + rowvalue8 * 1 + rowvalue9 * 1 + rowvalue10 * 1 + rowvalue11 * 1 + rowvalue12 * 1 + rowvalue13 * 1 + rowvalue14 * 1;
    //                         props.stafflist.TotalSum = item.FOT;
    //                     }
    //                 }
    //                 return null;
    //             })
    //             return null;
    //         })
    //     }
    // }, [props.Tables, props.rowTableData, props.stafflist])

    // useEffect(() => {
    //     calculateTotal()
    // }, [props.addData, calculateTotal])

    return (
        <Table
            bordered
            size='middle'
            pagination={false}
            rowClassName={'table-row'}
            className="main-table"
            columns={rowColumns}
            dataSource={Rows}
            scroll={{
                x: "max-content",
                y: '90vh'
            }}
        />
    )
}

export default RowsTable