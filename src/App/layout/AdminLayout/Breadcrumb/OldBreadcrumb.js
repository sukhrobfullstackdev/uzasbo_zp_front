// class Breadcrumb extends Component {
//   state = {
//     main: [],
//     item: [],
//     currentPath: ''
//   };

//   componentDidMount() {
//     (mainNavigation.items).map((item, index) => {
//       if (item.type && item.type === 'group') {
//         this.getCollapse(item, index);
//       }
//       return false;
//     });
//   };

//   componentDidUpdate(prevProps, prevState) {
//     if (document.location.pathname !== this.state.currentPath) {
//       (mainNavigation.items).map((item, index) => {
//         if (item.type && item.type === 'group') {
//           this.getCollapse(item, index);
//         }
//         return false;
//       });
//     }
//   };

//   // componentWillReceiveProps = () => {
//   //   console.log('componentWillReceiveProps');
//   //   (navigation.items).map((item, index) => {
//   //     console.log('hi', item);
//   //     if (item.type && item.type === 'group') {
//   //       this.getCollapse(item);
//   //     }
//   //     return false;
//   //   });
//   // };

//   getCollapse = (item) => {
//     if (item.children) {
//       (item.children).filter(collapse => {
//         if (collapse.type && collapse.type === 'collapse') {
//           this.getCollapse(collapse,);
//         } else if (collapse.type && collapse.type === 'item') {
//           if (document.location.pathname === config.basename + collapse.url) {
//             this.setState({ item: collapse, main: item, currentPath: config.basename + collapse.url });
//           }
//         }
//         return false;
//       });
//     }
//   };

//   render() {
//     const { t } = this.props;
//     let main, item;
//     let breadcrumb = '';
//     let title = 'Welcome';
//     if (this.state.main && this.state.main.type === 'collapse') {
//       main = (
//         <li className="breadcrumb-item">
//           <a href={demo}>{t(this.state.main.title)}</a>
//         </li>
//       );
//     }

//     if (this.state.item && this.state.item.type === 'item') {
//       title = this.state.item.title;
//       item = (
//         <li className="breadcrumb-item">
//           <a href={demo}>{t(title)}</a>
//         </li>
//       );

//       if (this.state.item.breadcrumbs !== false) {
//         breadcrumb = (
//           <div className="page-header">
//             <div className="page-block">
//               <div className="row align-items-center">
//                 <div className="col-md-12">
//                   <div className="page-header-title">
//                     {/* <h5 className="m-b-10">{title}</h5> */}
//                   </div>
//                   <ul className="breadcrumb">
//                     <li className="breadcrumb-item">
//                       <Link to="/"><i className="feather icon-home" /></Link>
//                     </li>
//                     {main}
//                     {item}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       }
//     }

//     // document.title = "UzASBO";

//     return (
//       <>
//         {breadcrumb}
//       </>
//     );
//   }
// }

// export default withTranslation()(Breadcrumb);