// import React, {useState} from 'react'
// import { Table } from 'antd';
// import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
// // import { useLocation, useHistory, Link } from 'react-router-dom';

// import EditableCell from "./EditableCell";

// import { setListPagination } from '../_redux/getListSlice';

// const TableData = ({ tableData }) => {
//     const { t } = useTranslation();
//     const dispatch = useDispatch();
//     const [editingKey, setEditingKey] = useState("");

//     const columns = [
//         {
//             title: t("StaffListRowType"),
//             dataIndex: 'name',
//             colSpan: 3,
//             onCell: (_, index) => {
//                 if (index === 0) {
//                     return { colSpan: 2, rowSpan: 2  };
//                 }
//                 if (index === 1) {
//                     return { colSpan: 0, rowSpan: 2 };
//                 }
//                 if (index === 2) {
//                     return { colSpan: 2, rowSpan: 1 };
//                 }
//                 if (index === 3) {
//                     return { colSpan: 2, rowSpan: 2 };
//                 }

//                 return {};
//             },
//             //   onCell: (_, index) => ({
//             //     rowSpan: index === 0 ? 2 : 1,
//             //   }),
//         },
//         {
//             title: 'Phone',
//             colSpan: 0,
//             dataIndex: 'phone',
//             // onCell: sharedOnCell,
//         },
//         {
//             title: t("numberOfPensioners"),
//             dataIndex: 'age',
//             editable: true,
//             // onCell: sharedOnCell,
//         },
//         {
//             title: t("realOutcomes"),
//             dataIndex: 'tel',
//             colSpan:14
//             // onCell: sharedOnCell,
//         },
//     ];

//     const data = [
//         {
//             key: '1',
//             name: 'Хомиладорлик ва туғиш  бўйича нафақа',
//             age: 3,
//             tel: '19 583 000',
//             phone: 'ҳаммаси',
//         },
//         {
//             key: '2',
//             name: '',
//             tel: '0',
//             phone: 'шу жумладан',
//             age: 0,
//         },
//         {
//             key: '3',
//             name: 'Бюджет ташкилотларининг харажатлар сметаси бўйича тежаб қолинган маблағлари ҳисобидан қопланадиган қисми',
//             age: 0,
//             tel: '0',
            
//         },
//         {
//             key: '4',
//             name: 'Қўшимча талаб қилинадиган  (етмайдиган) бюджет маблағлари',
//             age: 3,
//             tel: '19 583 000',
            
//         },
//     ];

//     function handleTableChange(pagination, _, sorter) {
//         const { field, order } = sorter;

//         dispatch(
//             setListPagination({
//                 OrderType: order?.slice(0, -3),
//                 SortColumn: field,
//                 PageNumber: pagination.current,
//                 PageLimit: pagination.pageSize,
//             })
//         );
//     };

//     const isEditing = (record) => record.ID === editingKey;

//   const edit = (record) => {
//     tableForm.setFieldsValue({
//       ...record,
//     });
//     setEditingKey(record.ID);
//   };

//     const mergedColumns = columns.map((col) => {
//         if (!col.editable) {
//           return col;
//         }
    
//         return {
//           ...col,
//           onCell: (record) => ({
//             record,
//             title: col.title,
//             dataIndex: col.dataIndex,
//             editing: isEditing(record)
//           })
//         };
//       });

//     return (
//         <>
//             <Table
//                 bordered
//                 size='middle'
//                 rowClassName='table-row'
//                 className="main-table"
//                 onChange={handleTableChange}
//                 dataSource={data}
//                 columns={mergedColumns}
//                 rowKey={(record) => record.ID}
//                 // onRow={(record) => onCalcTableRow(record)}
//                 components={{
//                     body: {
//                       cell: EditableCell
//                     }
//                   }}
//                 scroll={{
//                     // x: "max-content",
//                     y: '90vh'
//                 }}
//             />

//         </>
//     )
// }

// export default TableData