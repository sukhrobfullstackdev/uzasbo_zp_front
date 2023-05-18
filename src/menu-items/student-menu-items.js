const studentMenuItems = {
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
              id: "AppointQualCategory",
              title: "AppointQualCategory",
              type: "item",
              url: "/AppointQualCategory",
              role: 'AppointQualCategoryView'
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
          id: "Student accounting",
          title: "Student Accounting",
          type: "collapse",
          icon: "feather icon-globe",
          children: [
            {
              id: "OrderOfScholarship",
              title: "OrderOfScholarship",
              type: "item",
              url: "/OrderOfScholarship",
              role: 'OrderOfScholarshipView'
            },

            {
              id: "CancelOrderOfScholarship",
              title: "CancelOrderOfScholarship",
              type: "item",
              url: "/CancelOrderOfScholarship",
              role: 'CancelOrderOfScholarshipView'
            },
            {
              id: "ContractOfScholarship",
              title: "ContractOfScholarship",
              type: "item",
              url: "/ContractOfScholarship",
              role: 'ContractOfScholarshipView'
            },
            {
              id: "ScholarshipCharge",
              title: "ScholarshipCharge",
              type: "item",
              url: "/ScholarshipCharge",
              role: 'ScholarshipChargeView'
            },
            {
              id: "RequestReceivingCash",
              title: "RequestReceivingCash",
              type: "item",
              url: "/RequestReceivingCash",
              role: 'RequestReceivingCashView'
            },
            {
              id: "ReportsOfStudents",
              title: "ReportsOfStudents",
              type: "item",
              url: "/ReportsOfStudents",
              role: 'OrderOfScholarshipView'
            },
          ],
        },

      ],
    },
  ],
};

export default studentMenuItems;
