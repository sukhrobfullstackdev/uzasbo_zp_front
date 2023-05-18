const menuItems = {
  items: [
    //Dashboard
    {
      id: "navigation",
      title: "Navigation",
      type: "group",
      icon: "icon-navigation",
      children: [
        {
          id: "dashboard",
          title: "Dashboard",
          type: "item",
          url: "/dashboard/default",
          icon: "feather icon-home",
          role: 'DashboardView'
        },
      ],
    },
    //Dashboard end

    //Adminstrator
    {
      id: "Adminstrator",
      title: "Management",
      type: "group",
      children: [
        {
          id: "Users",
          title: "users",
          type: "collapse",
          icon: "feather icon-users",
          children: [
            {
              id: "User",
              title: "ControlUsers",
              type: "item",
              url: "/ControlUsers",
              role: 'UserView'
            },
            {
              id: "Role",
              title: "roles",
              type: "item",
              url: "/Roles",
              role: 'RoleView'
            },
            {
              id: "ChangeDocumentStatus",
              title: "changeDocumentStatus",
              type: "item",
              url: "/ChangeDocumentStatus",
              role: 'ChangeDocumentStatusView'
            },
            {
              id: "Organization",
              title: "Organization",
              type: "item",
              url: "/Organization",
              role: 'EmployeeView'
            },
            {
              id: "PreferentialOrganization",
              title: "PreferentialOrganization",
              type: "item",
              url: "/PreferentialOrganizations",
              role: 'PreferentialOrganizationInsert'
            },
            {
              id: "userErrorList",
              title: "userErrorList",
              type: "item",
              url: "/UserError",
              role: 'ChangeUserEDS'
            },
            {
              id: "GetPlasticCardInfo",
              title: "GetPlasticCardInfo",
              type: "item",
              url: "/GetPlasticCardInfo",
              role: 'ChangeUserEDS'
            },
          ],
        },
      ],
    },
    //Adminstrator end
    //Reference
    {
      id: "references",
      title: "references",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "referenceOrganizations",
          title: "Reference Organizations",
          type: "collapse",
          icon: "feather icon-list",
          children: [
            {
              id: "employee",
              title: "employee",
              type: "item",
              url: "/employee",
              role: 'EmployeeView'
            },
            {
              id: "division",
              title: "division",
              type: "item",
              url: "/division",
              role: 'DivisionView'
            },
            {
              id: "department",
              title: "department",
              type: "item",
              url: "/department",
              role: 'DepartmentView'
            },
            ////
            {
              id: "Faculty",
              title: "Faculty",
              type: "item",
              url: "/Faculty",
              role: 'OrderOfScholarshipView'
            },

            {
              id: "Direction",
              title: "Direction",
              type: "item",
              url: "/Direction",
              role: 'OrderOfScholarshipView'
            },
            {
              id: "Group",
              title: "Group",
              type: "item",
              url: "/Group",
              role: 'OrderOfScholarshipView'
            },
            ////
            {
              id: "subDepartment",
              title: "SubDepartment",
              type: "item",
              url: "/subDepartment",
              role: 'SubDepartmentView'
            },
            {
              id: "sector",
              title: "Sector",
              type: "item",
              url: "/sector",
              role: 'SectorView'
            },
            {
              id: "listOfPositionCategory",
              title: "Position Category",
              type: "item",
              url: "/listOFPositionCategory",
              role: 'ListOfPositionCategoryView'
            },
            {
              id: 'listOfPosition',
              title: 'position',
              type: 'item',
              url: '/listOFPosition',
              role: 'ListOfPositionView'
            },
            {
              id: "taxesAndCharges",
              title: "Taxes And Charges",
              type: "item",
              url: "/taxesAndCharges",
              role: 'TaxesAndChargesView'
            },
            {
              id: "salaryTransaction",
              title: "Salary Transaction",
              type: "item",
              url: "/salaryTransaction",
              role: 'SalaryTransactionView'
            },
            {
              id: "holiday",
              title: "Holiday",
              type: "item",
              url: "/holiday",
              role: "HolidayView"
            },
            {
              id: "limitBySubCalculationKind",
              title: "LimitBySubCalculationKind",
              type: "item",
              url: "/limitBySubCalculationKind",
              role: 'LimitBySubCalculationKindView'
            },
            {
              id: "subCalculationKind",
              title: "SubCalculationKind",
              type: "item",
              url: "/subCalculationKind",
              role: 'SubCalculationKindView'
            },
            // {
            //   id: 'accountBookByEmployee',
            //   title: 'Book Employee',
            //   type: 'item',
            //   url: '/accountBookByEmployee',
            // },
            {
              id: "basicSubCalculationKind",
              title: "BasicSubCalculationKind",
              type: "item",
              url: "/basicSubCalculationKind",
              role: 'BasicSubCalculationKindView'
            },
            {
              id: "shift",
              title: "TPShift",
              type: "item",
              url: "/shift",
              role: "ShiftView"
            },
            {
              id: "WworkSchedule",
              title: "WorkSchedule",
              type: "item",
              url: "/workSchedule",
              role: 'WorkScheduleView'
            },
            {
              id: "subacc",
              title: "SubAcc",
              type: "item",
              url: "/subAcc",
              role: 'SubAccView'
            },
            {
              id: "organizationsSettlementAccount",
              title: "OrganizationsSettlementAccount",
              type: "item",
              url: "/organizationsSettlementAccount",
              role: 'OrganizationsSettlementAccountView'
            },
            {
              id: "constantValue",
              title: "ConstantValue",
              type: "item",
              url: "/constantValue",
              role: 'ConstantValueView'
            },
            {
              id: "PositionOwner",
              title: "PositionOwner",
              type: "item",
              url: "/PositionOwner",
              role: 'PositionOwnerAdd'
            },
            {
              id: "SubjectsInBLHGT",
              title: "SubjectsInBLHGT",
              type: "item",
              url: "/SubjectsInBLHGT",
              role: 'SubjectsInBLHGTView'
            },
            {
              id: "BasicEducationalPlan",
              title: "BasicEducationalPlan",
              type: "item",
              url: "/BasicEducationalPlan",
              role: 'ChangeUserEDS'
            },
            {
              id: "AppointQualCategory",
              title: "AppointQualCategory",
              type: "item",
              url: "/AppointQualCategory",
              role: 'ChangeUserEDS'
            },
          ],
        },
        {
          id: "global reference",
          title: "Global Reference",
          type: "collapse",
          icon: "feather icon-globe",
          children: [
            {
              id: "ItemOfExpense",
              title: "ItemOfExpense",
              type: "item",
              url: "/ItemOfExpense",
              role: 'ItemOfExpenseView'
            },
            {
              id: "bank",
              title: "Bank",
              type: "item",
              url: "/bank",
              role: 'BankView'
            },
            {
              id: "allowed Transaction",
              title: "Allowed Transaction",
              type: "item",
              url: "/allowedTransaction",
              role: 'AllowedTransactionView'
            },
            {
              id: "calculationKind",
              title: "Calculation Kind",
              type: "item",
              url: "/calculationKind",
              role: 'CalculationKindView'
            },
            {
              id: "minimalSalary",
              title: "Minimal Salary",
              type: "item",
              url: "/minimalSalary",
              role: 'MinimalSalaryView'
            },
            {
              id: "tariffScale",
              title: "Tariff Scale",
              type: "item",
              url: "/tariffScale",
              role: 'TariffScaleView'
            },
            {
              id: "qualificationCategory",
              title: "Qualification Category",
              type: "item",
              url: "/qualificationCategory",
              role: 'QualificationCategoryView'
            },
            {
              id: "subjects",
              title: "Subjects",
              type: "item",
              url: "/subjects",
              role: 'SubjectsView'
            },
            {
              id: "baseSalary",
              title: "BaseSalary",
              type: "item",
              url: "/baseSalary",
              role: 'MinimalSalaryView'
            },
            {
              id: "experienceContWork",
              title: "ExperienceContWork",
              type: "item",
              url: "/experienceContWork",
              role: 'ExperienceContWorkView'
            },
            {
              id: "scholarshipCategory",
              title: "ScholarshipCategory",
              type: "item",
              url: "/scholarshipCategory",
              role: 'ScholarshipCategoryView'
            },
            {
              id: "position",
              title: "Position",
              type: "item",
              url: "/position",
              role: 'ListOfPositionView'
            },
            {
              id: "AllPositions",
              title: "AllPositions",
              type: "item",
              url: "/AllPositions",
              role: 'AllPositionAdd'
            },
            {
              id: "positionQualificationAmount",
              title: "PositionQualificationAmount",
              type: "item",
              url: "/positionQualificationAmount",
              role: 'MinimalSalaryView'
            },
            {
              id: "StaffPositionAmount",
              title: "StaffPositionAmount",
              type: "item",
              url: "/StaffPositionAmount",
              role: 'StaffListView'
            },
            {
              id: "TaxRelief",
              title: "TaxRelief",
              type: "item",
              url: "/TaxRelief",
              role: 'MinimalSalaryView'
            },
          ],
        },
        {
          id: "Templates",
          title: "templates",
          type: "collapse",
          icon: "feather icon-book",
          children: [
            {
              id: "holidays",
              title: "TPHolidays",
              type: "item",
              url: "/TPHoliday",
              role: 'TPHolidayView'
            },
            {
              id: "TPShift",
              title: "TPShift",
              type: "item",
              url: "/TPShift",
              role: 'TPShiftView'
            },
            {
              id: "TPWorkSchedule",
              title: "TPWorkSchedule",
              type: "item",
              url: "/TPWorkSchedule",
              role: 'TPWorkScheduleView'
            },
            {
              id: "TPTaxesAndCharges",
              title: "TPTaxesAndCharges",
              type: "item",
              url: "/TPTaxesAndCharges",
              role: 'TPTaxesAndChargesView'
            },
            {
              id: "TPSalaryTransaction",
              title: "TPSalaryTransaction",
              type: "item",
              url: "/TPSalaryTransaction",
              role: 'TPSalaryTransactionView'
            },
            {
              id: "TPSubCalculationKind",
              title: "TPSubCalculationKind",
              type: "item",
              url: "/TPSubCalculationKind",
              role: 'TPSubCalculationKindView'
            },
            {
              id: "TPBasicSubCalculationKind",
              title: "TPBasicSubCalculationKind",
              type: "item",
              url: "/TPBasicSubCalculationKind",
              role: 'TPBasicSubCalculationKindView'
            },
            {
              id: "TPLimitBySubCalculationKind",
              title: "TPLimitBySubCalculationKind",
              type: "item",
              url: "/TPLimitBySubCalculationKind",
              role: 'TPLimitBySubCalculationKindView'
            },
            {
              id: "TPListOfPositionCategory",
              title: "TPListOfPositionCategory",
              type: "item",
              url: "/TPListOfPositionCategory",
              role: 'TPListOfPositionCategoryView'
            },
            {
              id: "TPListOfPosition",
              title: "TPListOfPosition",
              type: "item",
              url: "/TPListOfPosition",
              role: 'TPListOfPositionView'
            },
          ],
        },
      ],
    },
    //Reference end

    //Documents
    {
      id: "documents",
      title: "Documents",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "Personnel accounting",
          title: "Personnelaccounting",
          type: "collapse",
          icon: "feather icon-list",
          children: [
            {
              id: "EmployeeEnrolment",
              title: "EmployeeEnrolment",
              type: "item",
              url: "/EmployeeEnrolment",
              role: 'EmployeeEnrolmentView'
            },
            {
              id: "EmployeeMovement",
              title: "EmployeeMovement",
              type: "item",
              url: "/EmployeeMovement",
              role: 'EmployeeMovementView'
            },
            {
              id: "EmployeeTempEnrolment",
              title: "EmployeeTempEnrolment",
              type: "item",
              url: "/EmployeeTempEnrolment",
              role: 'EmployeeTempEnrolmentView'
            },
            {
              id: "EmployeeTrainingEnrolment",
              title: "EmployeeTrainingEnrolment",
              type: "item",
              url: "/EmployeeTrainingEnrolment",
              role: 'EmployeeTrainingEnrolmentView'
            },
            {
              id: "EmployeeDismissal",
              title: "EmployeeDismissal",
              type: "item",
              url: "/EmployeeDismissal",
              role: 'EmployeeDismissalView'
            },
            {
              id: "OrderOnLeaveOfAbsence",
              title: "OrderOnLeaveOfAbsence",
              type: "item",
              url: "/OrderOnLeaveOfAbsence",
              role: 'OrderOnLeaveOfAbsenceView'
            },
            {
              id: "OrderToSendBusTrip",
              title: "OrderToSendBusTrip",
              type: "item",
              url: "/OrderToSendBusTrip",
              role: 'OrderToSendBusTripView'
            },
            {
              id: "ReviewOfEmployeeLeave",
              title: "ReviewOfEmployeeLeave",
              type: "item",
              url: "/ReviewOfEmployeeLeave",
              role: 'ReviewOfEmployeeLeaveView'
            },
            {
              id: "TimeSheet",
              title: "TimeSheet",
              type: "item",
              url: "/TimeSheet",
              role: 'TimeSheetView'
            },
            {
              id: "TimeSheetEdu",
              title: "TimeSheetEdu",
              type: "item",
              url: "/TimeSheetEdu",
              role: 'TimeSheetEduView'
            },
            {
              id: "TarifList",
              title: "TarifList",
              type: "collapse",
              children: [
                {
                  id: "ClassTitle",
                  title: "ClassTitle",
                  type: "item",
                  url: "/ClassTitle",
                  role: 'ClassTitleView'
                },
                // {
                //   id: "ClassRegisteryTitle",
                //   title: "ClassRegisteryTitle",
                //   type: "item",
                //   url: "/ClassRegisteryTitle",
                //   role: 'ClassRegistryTitleView'
                // },
                {
                  id: "BLHoursGridForClass",
                  title: "BLHoursGridForClass",
                  type: "item",
                  url: "/BLHoursGridForClass",
                  role: 'BLHoursGridForClassView'
                },
                {
                  id: "BLHoursGrid",
                  title: "BLHoursGrid",
                  type: "item",
                  url: "/BLHoursGrid",
                  role: 'BLHoursGridView'
                },
                {
                  id: "DistributionOfLessonHours",
                  title: "DistributionOfLessonHours",
                  type: "item",
                  url: "/DistributionOfLessonHours",
                  role: 'DistributionOfLessonHoursView'
                },
                {
                  id: "BillingList",
                  title: "BillingList",
                  type: "item",
                  url: "/BillingList",
                  role: 'BillingListView'
                },

              ]
            },
            {
              id: "Staffingtable",
              title: "Staffingtable",
              type: "collapse",
              children: [
                {
                  id: "StaffList",
                  title: "StaffList",
                  type: "item",
                  url: "/StaffList",
                  role: 'StaffListView'
                },

              ]
            },
          ]
        },
        {
          id: "payroll",
          title: "Payroll",
          type: "collapse",
          icon: "feather icon-list",
          children: [

            {
              id: "PayrollandCharge",
              title: "PayrollandCharge",
              type: "item",
              url: "/PayrollandCharge",
              role: 'PayrollandChargeView'
            },
            {
              id: "RecalcOfSalary",
              title: "RecalcOfSalary",
              type: "item",
              url: "/RecalcOfSalary",
              role: 'RecalcOfSalaryView'
            },
            {
              id: "PlannedCalculation",
              title: "PlannedCalculation",
              type: "item",
              url: "/PlannedCalculation",
              role: 'PlannedCalculationView'
            },
            {
              id: "StopPlannedCalculation",
              title: "StopPlanned Calculation",
              type: "item",
              url: "/StopPlannedCalculation",
              role: 'StopPlannedCalculationView'
            },
            {
              id: "ChangeSettlementAccount",
              title: "Change Settlement Account",
              type: "item",
              url: "/ChangeSettlementAccount",
              role: 'ChangeSettlementAccountView'
            },
            {
              id: "SickList",
              title: "SickList",
              type: "item",
              url: "/SickList",
              role: 'SickListNewView'
            },
            {
              id: "RequestSickList",
              title: "RequestSickList",
              type: "item",
              url: "/MaternityLeaveRequest",
              role: 'MaternityLeaveRequestView'
            },
            {
              id: "LeavePay",
              title: "Leave Pay",
              type: "item",
              url: "/LeavePay",
              role: 'LeavePayView'
            },
            {
              id: "RecalcOfLeave",
              title: "RecalcOf Leave",
              type: "item",
              url: "/RecalcOfLeave",
              role: 'RecalcOfLeaveView'
            },
            {
              id: "EmployeeState",
              title: "Employee State",
              type: "item",
              url: "/EmployeeState",
              role: 'EmployeeStateView'
            },
            {
              id: "IncomeInKind",
              title: "IncomeInKind",
              type: "item",
              url: "/IncomeInKind",
              role: 'IncomeInKindView'
            },
            {
              id: "IndexationOfSalary",
              title: "IndexationOfSalary",
              type: "item",
              url: "/IndexationOfSalary",
              role: 'IndexationOfSalaryView'
            },
          ],
        },
        {
          id: "employeeMovement",
          title: "Employee Movement",
          type: "collapse",
          icon: "feather icon-globe",
          children: [
            {
              id: "CheckDocs",
              title: "CheckDocs",
              type: "item",
              url: "/check-docs",
              role: 'SalaryCalculationView'
            },
            {
              id: "SalaryCalculation",
              title: "SalaryCalculation",
              type: "item",
              url: "/SalaryCalculation",
              role: 'SalaryCalculationView'
            },
            {
              id: "PayrollOfPlasticCardSheet",
              title: "PayrollOfPlasticCardSheet",
              type: "item",
              url: "/PayrollOfPlasticCardSheet",
              role: 'PayrollOfPlasticCardSheetView'
            },
            {
              id: "PayrollSheet",
              title: "PayrollSheet",
              type: "item",
              url: "/PayrollSheet",
              role: 'PayrollSheetView'
            },
            {
              id: "INPSRegistry",
              title: "INPSRegistry",
              type: "item",
              url: "/INPSRegistry",
              role: 'INPSRegistryView'
            },
            {
              id: "HousingService",
              title: "HousingService",
              type: "item",
              url: "/HousingService",
              role: 'HousingServiceView'
            },
            {
              id: "RequestReceivingCash",
              title: "RequestReceivingCash",
              type: "item",
              url: "/RequestReceivingCash",
              role: 'RequestReceivingCashView'
            },
          ],
        },
        {
          id: "electronicReports",
          title: "Electronicreports",
          type: "collapse",
          icon: "feather icon-list",
          children: [
            {
              id: "pensionFundRegistry",
              title: "PensionFundRegistry",
              type: "item",
              url: "/PensionFundRegistry",
              role: 'PensionFundRegistryView'
            },
            {
              id: "incomeTaxRegistry",
              title: "IncomeTaxRegistry",
              type: "item",
              url: "/IncomeTaxRegistry",
              role: 'IncomeTaxRegistryView'
            },
            {
              id: "incomeTaxRegistrySend",
              title: "IncomeTaxRegistrySend",
              type: "item",
              url: "/IncomeTaxRegistrySend",
              role: 'IncomeTaxRegistrySendView'
            },
          ],
        },
        {
          id: "Fixing Final Transactions",
          title: "fixingFinalTransactions",
          type: "collapse",
          icon: "fas fa-wrench",
          children: [
            {
              id: "FixingTransactions",
              title: "fixingTransactions",
              type: "item",
              url: "/fixingTransactions",
              role: 'FixingTransactionView'
            },
          ],
        },
        {
          id: "Entering balances",
          title: "Enteringbalances",
          type: "collapse",
          icon: "feather icon-globe",
          children: [
            {
              id: "EmployeesProfit",
              title: "EmployeesProfit",
              type: "item",
              url: "/EmployeesProfit",
              role: 'EmployeesProfitView'
            },
          ],
        },
      ],
    },
    {
      id: "Report",
      title: "Report",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "PersonnelRecords",
          title: "PersonnelRecords",
          type: "collapse",
          icon: "feather icon-users",
          children: [
            {
              id: "PersonnelDepartment",
              title: "PersonnelDepartment",
              type: "item",
              url: "/PersonnelDepartment",
              role: 'SalaryCalculationInsert'
            },
            {
              id: "PHD",
              title: "PHD",
              type: "item",
              url: "/PHD",
              role: 'EmployeeView'
            },

          ],
        },
        {
          id: "accountingSalary",
          title: "accountingSalary",
          type: "collapse",
          icon: "feather icon-file-text",
          children: [
            {
              id: "IncomeCard",
              title: "IncomeCard",
              type: "item",
              url: "/IncomeCard",
              role: 'EmployeeView'
            },

          ],
        },
        {
          id: "Accounting_debtor_creditors",
          title: "Accounting_debtor_creditors",
          type: "collapse",
          icon: "feather icon-globe",
          children: [
            {
              id: "bank",
              title: "AccountBookByEmployee",
              type: "item",
              url: "/AccountBookByEmployee",
              role: 'EmployeeView'
            },
          ],
        },
        {
          id: "TurnoverStatement",
          title: "TurnoverStatement",
          type: "collapse",
          icon: "feather icon-list",
          children: [
            {
              id: "AccountBookList",
              title: "AccountBookList",
              type: "item",
              url: "/AccountBookList",
              role: 'EmployeeView'
            },
          ],
        },
        {
          id: "MemorialOrder",
          title: "MemorialOrder",
          type: "collapse",
          icon: "feather icon-list",
          children: [
            {
              id: "MemorialOrder5",
              title: "MemorialOrder5",
              type: "item",
              url: "/MemorialOrder5",
              role: 'EmployeeView'
            },
          ],
        },
      ],
    },
    {
      id: "ExpressInfo",
      title: "ExpressInfo",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "EmployeeCard",
          title: "EmployeeCard",
          icon: "feather icon-users",
          type: "item",
          url: "/EmployeeCard",
          role: 'EmployeeView'
        },
      ]},

    //Documents end
    // {
    //   id: 'pages',
    //   title: 'Pages',
    //   type: 'group',
    //   icon: 'icon-pages',
    //   children: [
    //     {
    //       id: 'menu-level',
    //       title: 'Menu Levels',
    //       type: 'collapse',
    //       icon: 'feather icon-menu',
    //       children: [
    //         {
    //           id: 'menu-level-1.1',
    //           title: 'Menu Level 1.1',
    //           type: 'item',
    //           url: '#!',
    //           role: 'EmployeesProfitView',
    //         },
    //         {
    //           id: 'menu-level-1.2',
    //           title: 'Menu Level 2.2',
    //           type: 'collapse',
    //           role: 'EmployeesProfitView',
    //           children: [
    //             {
    //               id: 'menu-level-2.1',
    //               title: 'Menu Level 2.1',
    //               type: 'item',
    //               url: '#',
    //               role: 'EmployeesProfitView',
    //             },
    //             {
    //               id: 'menu-level-2.2',
    //               title: 'Menu Level 2.2',
    //               type: 'collapse',
    //               children: [
    //                 {
    //                   id: 'menu-level-3.1',
    //                   title: 'Menu Level 3.1',
    //                   type: 'item',
    //                   url: '#',
    //                   role: 'EmployeesProfitView',
    //                 },
    //                 {
    //                   id: 'menu-level-3.2',
    //                   title: 'Menu Level 3.2',
    //                   type: 'item',
    //                   url: '#',
    //                   role: 'EmployeesProfitView',
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //   ]
    // }
  ],
};

export default menuItems;
