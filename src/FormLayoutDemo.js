import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "./cssFiles/FormLayoutDemo.css";
import ReactDOM from "react-dom";

import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

export default function FormLayoutDemo() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const [meterZippedFile, setMeterZippedFile] = useState();

  const newBook = () => {
    console.log("works");
    console.log(meterZippedFile);
    console.log(meterZippedFile.name);
    const uploadData = new FormData();
    uploadData.append("year", year);
    uploadData.append("month", month);
    uploadData.append("meterZippedFile", meterZippedFile, meterZippedFile.name);
    // var csrftoken = getCookie("csrftoken");
    console.log(uploadData);
    // fetch("/fifteenmmdp/addNewMeterFile/", {
    //   method: "POST",
    //   body: uploadData,
    // })
    //   .then((res) => console.log(res))
    //   .catch((error) => console.log(error));
  };

  const toast = useRef(null);

  return (
    <div>
      <Toast ref={toast}></Toast>

      <h5>Add meter cumulative data</h5>
      <div className="p-formgroup-inline">
        <div className="p-field">
          <label className="p-sr-only">Year</label>
          <InputText
            type="text"
            value={year}
            placeholder="Year"
            onChange={(evt) => setYear(evt.target.value)}
          />
        </div>
        <div className="p-field">
          <label className="p-sr-only">Month</label>
          <InputText
            type="text"
            value={month}
            placeholder="Month"
            onChange={(evt) => setMonth(evt.target.value)}
          />
        </div>
        {/* <div className="p-field">
          <FileUpload
            // name="demo[]"
            // url="./upload.php"
            // onUpload={onUpload}
            // multiple
            // accept="image/*"
            // maxFileSize={1000000}
            emptyTemplate={
              <p className="p-m-0">Drag and drop files to here to upload.</p>
            }
            type="file"
            onChange={(evt) => setMeterZippedFile(evt.target.files[0])}
          />
        </div> */}
        <div className="p-field">
          <label>
            Meter Zip File
            <input
              type="file"
              onChange={(evt) => setMeterZippedFile(evt.target.files[0])}
            />
          </label>
        </div>

        <Button type="button" label="Submit" onClick={() => newBook()} />
      </div>
    </div>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<FormLayoutDemo />, rootElement);
