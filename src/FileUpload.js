import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import './cssFiles/fileUpload.css';
import ReactDOM from 'react-dom';

import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
export default function FileUploadDemo() {
    const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    return (
        <div>
            <Toast ref={toast}></Toast>

            <div className="card">
                <h5>Advanced</h5>
                <FileUpload name="demo[]" url="./upload.php" onUpload={onUpload} multiple accept="image/*" maxFileSize={1000000}
                    emptyTemplate={<p className="p-m-0">Drag and drop files to here to upload.</p>} />
            </div>
        </div>
    )
}
                
// const rootElement = document.getElementById("root");
// ReactDOM.render(<FileUploadDemo />, rootElement);
