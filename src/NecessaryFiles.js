import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "primeflex/primeflex.css";
import axios from "axios";
import proxyServer from "./GlobalVars";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

export default function CardDemo() {
  let emptyFileDetails = {
    model: "fifteenmmdp.necessaryfile",
    pk: null,
    fields: {
      filePath: "",
      fileName: "",
      subTitle: "",
      description: "",
      necessaryFile: null,
    },
  };
  const toast = useRef(null);

  const [cols, setCols] = useState(<>Server error</>);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileDetails, setFileDetails] = useState(emptyFileDetails);
  const [submitted, setSubmitted] = useState(false);
  const saveNecessaryFile = () => {
    setSubmitted(true);
    console.log("jere");
    if (
      fileDetails.fields.subTitle.trim() != "" &&
      fileDetails.fields.description.trim() != "" &&
      fileDetails.fields.necessaryFile
    ) {
      const uploadData = new FormData();
      uploadData.append("subTitle", fileDetails.fields.subTitle);
      uploadData.append("description", fileDetails.fields.description);

      uploadData.append(
        "necessaryFile",
        fileDetails.fields.necessaryFile,
        fileDetails.fields.necessaryFile.name
      );
      console.log(uploadData);

      axios
        .post("/fifteenmmdp/changeNecessaryFile/" + fileDetails.pk, uploadData)
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Server Error",
            detail: "Data can not be saved",
            life: 3000,
          });
          console.log(error);
        });

      setDialogOpen(false);
      setFileDetails(emptyFileDetails);
    }
  };
  const dialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          setFileDetails(emptyFileDetails);
          setSubmitted(false);
          setDialogOpen(false);
        }}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveNecessaryFile}
      />
    </React.Fragment>
  );
  const footer = (item) => (
    <span>
      <Button
        onClick={() => {
          let _fileDetails = { ...item };
          _fileDetails.fields.necessaryFile = null;
          setFileDetails(_fileDetails);
          setDialogOpen(true);
        }}
        label="Change File"
        className="p-button-rounded p-button-info"
      />
      {"  "}
      <a href={proxyServer + "/fifteenmmdp/downLoadNecessaryFile/" + item.pk}>
        {item.fields.fileName}{" "}
      </a>
    </span>
  );
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _fileDetails = { ...fileDetails };
    _fileDetails["fields"][`${name}`] = val;

    setFileDetails(_fileDetails);
  };
  const onFileChange = (e, name) => {
    console.log("fine");
    let _fileDetails = { ...fileDetails };
    // _meter[`${name}`] = val;
    _fileDetails.fields.necessaryFile = e.target.files[0];

    setFileDetails(_fileDetails);
  };

  useEffect(() => {
    let _cols = [];
    axios("/fifteenmmdp/getNecessaryFiles")
      .then((res) => res.data)
      .then((result) => {
        console.log(result);
        result.forEach((item) => {
          _cols.push(
            <div key={item.pk} className="p-col">
              {" "}
              <Card
                title={item.fields.fileName}
                subTitle={item.fields.subTitle}
                style={{ width: "25em" }}
                footer={() => footer(item)}
                // header={header}
              >
                <p className="p-m-0" style={{ lineHeight: "1.5" }}>
                  {item.fields.description}
                </p>
              </Card>
            </div>
          );
        });
        setCols(_cols);
      });
  }, []);
  return (
    <div className="p-grid">
      <Toast ref={toast} />
      {cols}{" "}
      <Dialog
        visible={dialogOpen}
        style={{ width: "450px" }}
        header={fileDetails.fields.fileName}
        modal
        footer={dialogFooter}
        onHide={() => {
          setFileDetails(emptyFileDetails);
          setSubmitted(false);
          setDialogOpen(false);
        }}
      >
        <div className="p-field">
          <label htmlFor="fileName" className="p-sr-only">
            {fileDetails.fields.fileName}
          </label>
          <label htmlFor="subTitle">Subtitle</label>
          <InputTextarea
            id="subTitle"
            type="text"
            placeholder="Subtitle"
            defaultValue={fileDetails.fields.subTitle}
            onChange={(e) => onInputChange(e, "subTitle")}
            required
            rows={2}
            cols={55}
          />
          {submitted && !fileDetails.fields.subTitle && (
            <small className="p-error">Subtitle is required.</small>
          )}
        </div>
        <div className="p-field">
          <label htmlFor="description">Description</label>
          <InputTextarea
            id="description"
            type="text"
            placeholder="Description"
            defaultValue={fileDetails.fields.description}
            onChange={(e) => onInputChange(e, "description")}
            required
            rows={2}
            cols={55}
          />
          {submitted && !fileDetails.fields.description && (
            <small className="p-error">Description is required.</small>
          )}
        </div>

        <div className="p-field">
          <label htmlFor="necessaryFile" className="p-sr-only">
            File{" "}
          </label>
          <input
            id="necessaryFile"
            type="file"
            onChange={(e) => onFileChange(e, "necessaryFile")}
            required
          />
          {submitted && !fileDetails.fields.necessaryFile && (
            <small className="p-error">File is required.</small>
          )}
        </div>
      </Dialog>
    </div>
  );
}
