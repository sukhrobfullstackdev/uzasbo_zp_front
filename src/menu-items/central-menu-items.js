const centralMenuItems = {
  items: [
    //Documents
    {
      id: "documents",
      title: "Documents",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "employeeMovement",
          title: "Employee Movement",
          type: "collapse",
          icon: "feather icon-globe",
          children: [
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
              id: "RequestReceivingCash",
              title: "RequestReceivingCash",
              type: "item",
              url: "/RequestReceivingCash",
              role: 'RequestReceivingCashView'
            },
          ],
        },
        {
          id: "tariffScale",
          title: "TariffScale",
          url: "/tariffScale",
          role: 'TariffScaleView',
          type: "collapse",
          icon: "feather icon-globe",
          children: [
            // {
            //   id: "AllowanceByRegion",
            //   title: "AllowanceByRegion",
            //   type: "item",
            //   url: "/AllowanceByRegion",
            //   role: 'CentralAccountingParent'
            // },
            // {
            //   id: "ClassTitleSend",
            //   title: "ClassTitleSend",
            //   type: "item",
            //   url: "/ClassTitleSend",
            //   role: 'CentralAccountingParent'
            // },
            {
              id: "ClassTitle",
              title: "ClassTitle",
              type: "item",
              url: "/ClassTitle",
              role: 'ClassTitleView'
            },

            {
              id: "BillingListSend",
              title: "BillingListSend",
              type: "item",
              url: "/BillingListSend",
              role: 'CentralAccountingParent'
            },
            // {
            //   id: "BillingListReceived",
            //   title: "BillingListReceived",
            //   type: "item",
            //   url: "/BillingListReceived",
            //   role: 'CentralAccountingParent'
            // },
            // {
            //   id: "BillingListAdmin",
            //   title: "BillingListAdmin",
            //   type: "item",
            //   url: "/BillingListAdmin",
            //   role: 'CentralAccountingParent'
            // },
          ],
        },
        {
          id: "Staffingtable",
          title: "Staffingtable",
          type: "collapse",
          icon: "feather icon-users",
          children: [
            {
              id: "StaffListSend",
              title: "StaffListSend",
              type: "item",
              url: "/StaffListSend",
              role: 'StaffListSend'
            },
            {
              id: "StaffListReceived",
              title: "StaffListReceived",
              type: "item",
              url: "/StaffListReceived",
              role: 'StaffListReceived'
            },
            {
              id: "IndexStaffListRegistery",
              title: "IndexStaffListRegistery",
              type: "item",
              url: "/IndexStaffListRegistery",
              role: 'StaffListRegisteryView'
            },
          ]
        },
        {
          id: "electronicReports",
          title: "Electronicreports",
          type: "collapse",
          icon: "feather icon-list",
          children: [
            {
              id: "incomeTaxRegistrySend",
              title: "IncomeTaxRegistrySend",
              type: "item",
              url: "/IncomeTaxRegistrySend",
              role: 'IncomeTaxRegistrySendView'
            },
          ],
        },
      ],
    },
  ],
};

export default centralMenuItems;
