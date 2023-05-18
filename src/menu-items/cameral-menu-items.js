const studentMenuItems = {
    items: [
    //Documents
    {
      id: "documents",
      title: "Documents",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "Student accounting",
          title: "Cameral",
          type: "collapse",
          icon: "feather icon-globe",
          children: [
            {
              id: "CameralMaternityLeave",
              title: "CameralMaternityLeave",
              type: "item",
              url: "/CameralMaternityLeave",
              role: 'CameralReport'
            },
            {
              id: "CameralSalaryCalculation",
              title: "CameralSalaryCalculation",
              type: "item",
              url: "/CameralSalaryCalculation",
              role: 'CameralReport'
            },
            {
              id: "CameralRequestReceivingCash",
              title: "CameralRequestReceivingCash",
              type: "item",
              url: "/CameralRequestReceivingCash",
              role: 'CameralReport'
            },
            {
              id: "CameralPayroll",
              title: "Bill",
              type: "item",
              url: "/CameralPayroll",
              role: 'CameralReport'
            },
            {
              id: "BillingList",
              title: "BillingList",
              type: "item",
              url: "/BillingList",
              role: 'CameralReport'
            },
          
          ],
        },

      ],
    },
    ],
  };
  
  export default studentMenuItems;
  