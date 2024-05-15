// import React, { useState, useRef } from 'react';
// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import { Button } from 'primereact/button';
// import { Toast } from 'primereact/toast';

// export default function ConfirmDialogDemo(){
//     const [visibleOverwrite, setVisibleOverwrite] = useState(false);
//     const toast = useRef(null);

//     const processMWHOverWrite = () => {
//         console.log("true")
//     }

//     const processMWHNoOverWrite = () => {
//       console.log("false")
//     }

//     return (
//         <div>
//             <Toast ref={toast} />

//             <div className="card">
//                 <ConfirmDialog visibleOverwrite={visibleOverwrite} onHide={() => setVisibleOverwrite(false)} message="Do you want to overwrite existing files?"
//                     header="Overwrite" icon="pi pi-exclamation-triangle" accept={processMWHOverWrite} reject={processMWHNoOverWrite} />
//                 {/* <Button onClick={() => setVisibleOverwrite(true)} className="p-button-rounded" label="Create Real Meter MWH" /> */}
//             </div>
//         </div>
//     )
// }

// const [reload, setReload] = useState(false);

// const reloadListedData = () => {
//   setReload(true);
//   fetch("/fifteenmmdp/reloadNPCData/" + meterIdParam).then((res) =>
//     window.location.reload()
//   );
// };

// <div className="p-col">
// {!reload ? (
//   <Button
//     icon="pi pi-undo"
//     className="p-button-rounded p-button-info p-button-outlined"
//     onClick={reloadListedData}
//   />
// ) : (
//   <i
//     className="pi pi-spin pi-spinner"
//     style={{ fontSize: "2em" }}
//   ></i>
// )}
// {"   "}Reload Listed Files{" "}
// </div>
