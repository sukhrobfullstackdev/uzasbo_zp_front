import moment from "moment";

const monthCount = [
  {
    id: '1'
  },
  {
    id: '2'
  },
  {
    id: '3'
  },
  {
    id: '4'
  },
  {
    id: '5'
  },
  {
    id: '6'
  },
  {
    id: '7'
  },
  {
    id: '8'
  },
  {
    id: '9'
  },
  {
    id: '10'
  },
  {
    id: '11'
  },
  {
    id: '12'
  },
];

const initialMainTableDate = {
  StartDate: moment().subtract(30, "days").format("DD.MM.YYYY"),
  EndDate: moment().add(30, "days").format("DD.MM.YYYY"),
}

const initialMainTablePagination = {
  PageNumber: 1,
  PageLimit: 10,
}

const largerMainTablePagination = {
  PageNumber: 1,
  PageLimit: 100,
}

const largestMainTablePagination = {
  PageNumber: 1,
  PageLimit: 500,
}

const appendArray = (form_data, values, name) => {
  if (!values && name)
    form_data.append(name, '');
  else {
    if (typeof values == 'object') {
      for (let key in values) {
        if (typeof values[key] == 'object')
          appendArray(form_data, values[key], name + '[' + key + ']');
        else
          form_data.append(name + '[' + key + ']', values[key]);
      }
    } else
      form_data.append(name, values);
  }

  return form_data;
}

const plasticCards = [
  {
    id: 1,
    name: 'Humo'
  },
  {
    id: 2,
    name: 'Uzcard'
  },
]

export {
  monthCount, initialMainTableDate, initialMainTablePagination,
  largerMainTablePagination, largestMainTablePagination, appendArray, plasticCards
}