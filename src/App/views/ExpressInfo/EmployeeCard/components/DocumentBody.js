import React from 'react'
import { useTranslation } from "react-i18next";
import classes from "../EmployeeCard.module.css"
import CalculationKindTable from './CalculationKindTable';
import HumanResourceTable from './HumanResourceTable';
import { Row, Col } from "antd";

const DocumentBody = ({ data }) => {
    const { t } = useTranslation();
    console.log(data);
    let {
        EmployeeName, INN, PersonnelNumber, INPS, DateOfBirth, Address, FullExperiences, IsForeignCitizen,
        PlasticCardNumber, PassportSeries, PassportNumber, PassportDateOfIssue, PassportAuthoriry,
        HumanResource, CalculationKind, HistoryCalculationKind, TaxBenefit, IncomeTaxCalculateMethod
    } = data;

    let { GenerealExperience, InFieldExperience } = FullExperiences

    return (
        <div className={classes.DocumentBody}>
            <h4 style={{ textAlign: 'center', margin: '16px 0' }}>{t('EmployeeInformation')}</h4>
            <Row gutter={[15, 0]}>
                <Col md={12}>
                    <div className={classes.bold}>
                        {t("FullName")}: <span className={classes.underline}>{EmployeeName}</span>
                    </div>
                    <div className={classes.bold}>
                        {t("PersonnelNumber")}: <span className={classes.underline}>{PersonnelNumber}</span>
                    </div>
                    <div className={classes.bold}>
                        {t("inpsInfo")}: <span className={classes.underline}>{INPS}</span>
                    </div>
                    <div className={classes.bold}>
                        {t("DateOfBirth")}: <span className={classes.underline}>{DateOfBirth}</span>
                    </div>
                    <div className={classes.bold}>
                        {t("Паспортные данные")}: <span className={classes.underline}>{PassportSeries} {PassportNumber}</span>
                    </div>
                </Col>
                <Col md={12}>
                    <div className={classes.bold}>
                        {t("INN")}: <span className={classes.underline}>{INN}</span>
                    </div>
                    <div className={classes.bold}>
                        {t("plasticCardInfo")}: <span className={classes.underline}>{PlasticCardNumber}</span>
                    </div>
                    <div className={classes.bold}>
                        {t("IsForeignCitizen")}: <span className={classes.underline}>{IsForeignCitizen ? t('yes') : t('no')}</span>
                    </div>
                    <div className={classes.bold}>
                        {t("Address")}: <span className={classes.underline}>{Address}</span>
                    </div>
                    <div className={classes.bold}>
                        {t("PassportAuthoriry")}: <span className={classes.underline}>{PassportDateOfIssue} {PassportAuthoriry}</span>
                    </div>
                </Col>
            </Row>
            {/* <div className={classes.bold}>
                {t("FullName")}: <span className={classes.underline}>{EmployeeName}</span> {t("INN")}: <span className={classes.underline}>{INN}</span>
                &nbsp;{t("PersonnelNumber")}: <span className={classes.underline}>{PersonnelNumber}</span>
                &nbsp;{t("inpsInfo")}: <span className={classes.underline}>{INPS}</span>
                &nbsp;{t("plasticCardInfo")}: <span className={classes.underline}>{PlasticCardNumber}</span>
                &nbsp;{t("DateOfBirth")}: <span className={classes.underline}>{DateOfBirth}</span>
                &nbsp;{t("Address")}: <span className={classes.underline}>{Address}</span>
                &nbsp;{t("PassportData")}: <span className={classes.underline}>{PassportSeries} {PassportNumber}</span>
                &nbsp;{t("PassportAuthoriry")}: <span className={classes.underline}>{PassportDateOfIssue} {PassportAuthoriry}</span>
            </div> */}
            <h4 style={{ textAlign: 'center', margin: '16px 0' }}>{t('Taxation')}</h4>
            <div className={classes.bold}>
                {t("TaxPayer")}: <span className={classes.underline}> {TaxBenefit}</span>
                &nbsp;{t("IncomeTaxCalculateMethod")}: <span className={classes.underline}> {IncomeTaxCalculateMethod}</span>
            </div>
            <h4 style={{ textAlign: 'center', margin: '16px 0' }}>{t('Personnelaccounting')}</h4>
            <div className={classes.bold} style={{ marginBottom: 10 }}>
                {t("GenerealExperience")}:
                <span className={classes.underline}>
                    &nbsp;{GenerealExperience.Year} {t('year')} {GenerealExperience.Month} {t('month')} {GenerealExperience.Day} {t('experienceInFieldDay')}
                </span>
                &nbsp;{t("InFieldExperience")}:
                <span className={classes.underline}>
                    &nbsp;{InFieldExperience.Year} {t('year')} {InFieldExperience.Month} {t('month')} {InFieldExperience.Day} {t('experienceInFieldDay')}
                </span>
            </div>
            {/* {HumanResource.map(item => {
                return (
                    <>
                        <div className={classes.bold}>
                            {t("DocumentID")}: <span>{item.ID}</span>
                            &nbsp;{t("DocNumber")}: <span>{item.Number}</span>
                            &nbsp;{t("Date")}: <span>{item.Date}</span>
                            &nbsp;{t("Division")}: <span>{item.Division}</span>
                            &nbsp;{t("Department")}: <span>{item.Department}</span>
                            &nbsp;{t("position")}: <span>{item.Position}</span>
                            &nbsp;{t("EnrolmentType")}: <span>{item.EnrolmentType}</span>
                            &nbsp;{t("Rate")}: <span>{item.Rate.toFixed(2)}</span>
                            &nbsp;{t("Tariff Scale")}: <span>{null}</span>
                            &nbsp;{t("CorrectionFactor")}: <span>{item.CorrectionFactor.toFixed(2)}</span>
                            &nbsp;{t("WorkSchedule")}: <span>{item.WorkSchedule}</span>
                        </div>
                    </>
                )
            })} */}
            <HumanResourceTable tableData={HumanResource} />
            <h4 style={{ textAlign: 'center', margin: '16px 0' }}>{t("Sub Calculation Kind")}</h4>
            {/* {CalculationKind.map(item => {
                return (
                    <>
                        <div className={classes.bold}>
                            {t("DocumentID")}: <span>{item.ID}</span>
                            &nbsp;{t("position")}: <span>{item.Position}</span>
                            &nbsp;{t("Rate")}: <span>{item.Rate.toFixed(2)}</span>
                            &nbsp;{t("CalcType")}: <span>{item.CalcType}</span>
                            &nbsp;{t("Name")}: <span>{item.Name}</span>
                            &nbsp;{t("CalcMethod")}: <span>{item.CalcMethod}</span>
                            &nbsp;{t("Sum")}: <span>{item.Sum.toFixed(2)}</span>
                            &nbsp;{t("Percentage")}: <span>{item.Percentage.toFixed(2)}</span>
                            &nbsp;{t("DocumentName")}: <span>{item.DocumentName}</span>
                            &nbsp;{t("StartDate")}: <span>{item.StartDate}</span>
                            &nbsp;{t("OrgSettlementCode")}: <span>{item.OrgSettlementCode}</span>
                            &nbsp;{t("Основание")}: <span>{item.DocumentID} ({item.DocumentName})</span>
                        </div>
                    </>
                )
            })} */}
            <CalculationKindTable tableData={CalculationKind} />
            <h4 style={{ textAlign: 'center', margin: '16px 0' }}>{t("HistoryCalculationKind")}</h4>
            <CalculationKindTable tableData={HistoryCalculationKind} />
            {/* {HistoryCalculationKind.map(item => {
                return (
                    <>
                        <div className={classes.bold}>
                            {t("DocumentID")}: <span>{item.ID}</span>
                            &nbsp;{t("position")}: <span>{item.Position}</span>
                            &nbsp;{t("Rate")}: <span>{item.Rate.toFixed(2)}</span>
                            &nbsp;{t("CalcType")}: <span>{item.CalcType}</span>
                            &nbsp;{t("Name")}: <span>{item.Name}</span>
                            &nbsp;{t("CalcMethod")}: <span>{item.CalcMethod}</span>
                            &nbsp;{t("Sum")}: <span>{item.Sum.toFixed(2)}</span>
                            &nbsp;{t("Percentage")}: <span>{item.Percentage.toFixed(2)}</span>
                            &nbsp;{t("DocumentName")}: <span>{item.DocumentName}</span>
                            &nbsp;{t("StartDate")}: <span>{item.StartDate}</span>
                            &nbsp;{t("OrgSettlementCode")}: <span>{item.OrgSettlementCode}</span>
                            &nbsp;{t("Основание")}: <span>{item.DocumentID} ({item.DocumentName})</span>
                        </div>
                    </>
                )
            })} */}
        </div>
    )
}

export default DocumentBody