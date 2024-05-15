import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import "../cssFiles/Grid.css";
import "primeflex/primeflex.css";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import axios from "axios";
import FolderStructure from "../FolderStructure";
import { ProgressBar } from "primereact/progressbar";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import proxyServer from "../GlobalVars";

export default function ParticularMeter(props) {
  let { meterIdParam } = useParams();

  const [dateFilteredFile, setDateFilteredFile] = useState(null);
  const [nodeName, setNodeName] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [visibleRight, setVisibleRight] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const toast = useRef(null);

  const onFileChange = (e, name) => {
    console.log("fine");
    setFileToUpload(e.target.files[0]);
  };
  const DateFilteredFile = () => {
    return (
      <div>
        <Button
          onClick={() => {
            setNodeName(dateFilteredFile.fields.fileName);
            setNodeId(dateFilteredFile.pk);
            setVisibleRight(true);
            setSubmitted(false);
          }}
          label={dateFilteredFile.fields.fileName}
          className="p-button-link"
        />{" "}
        <a href={proxyServer + "/fifteenmmdp/downloadNrxFile/" + meterIdParam}>
          <Button label="NRX File" className="p-button-link" />
        </a>{" "}
        <a
          href={proxyServer + "/fifteenmmdp/downloadNewNrxFile/" + meterIdParam}
        >
          <Button label="NEW NRX File" className="p-button-link" />
        </a>
      </div>
    );
  };
  useEffect(() => {
    fetch("/fifteenmmdp/getDateFilteredFile/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        if (result.length == 1) {
          setDateFilteredFile(result[0]);
        }
        console.log(result.length);
      });
  }, []);
  const saveFile = () => {
    setSubmitted(true);
    setVisibleRight(false);
    if (fileToUpload) {
      const uploadData = new FormData();

      uploadData.append("fileToUpload", fileToUpload, fileToUpload.name);
      console.log(uploadData);
      axios
        .post("/fifteenmmdp/changeDateFilteredFile/" + nodeId, uploadData)
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          toast.current.show({
            severity: "error",
            summary: "Unsuccessful",
            detail: "Some error occured",
            life: 3000,
          });
        });
    } else {
      console.log(nodeId);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Sidebar
        visible={visibleRight}
        position="right"
        baseZIndex={1000000}
        onHide={() => {
          setSubmitted(false);
          setVisibleRight(false);
        }}
      >
        <h5 style={{ fontWeight: "normal" }}>
          Change Date Filtered File
          <br />
          <a
            href={
              proxyServer + "/fifteenmmdp/downloadDateFilteredFile/" + nodeId
            }
            download={"/fifteenmmdp/downloadDateFilteredFile/" + nodeId}
          >
            {" "}
            {nodeName}{" "}
          </a>
        </h5>
        <br />
        <div className="p-field">
          <label htmlFor="fileToUpload" className="p-sr-only">
            Date Filtered File{" "}
          </label>
          <input
            id="fileToUpload"
            type="file"
            onChange={(e) => onFileChange(e, "fileToUpload")}
            required
            // rows={5}
            // cols={10}
            // defaultValue={meter.fields.year}
          />
          {submitted && !fileToUpload && (
            <small className="p-error">File is required.</small>
          )}
        </div>
        <Button
          type="button"
          onClick={() => saveFile()}
          label="Save"
          className="p-button-success"
          style={{ marginRight: ".25em" }}
        />
        <Button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setVisibleRight(false);
          }}
          label="Cancel"
          className="p-button-secondary"
        />
      </Sidebar>
      <div className="p-col">
        <Fieldset legend="Merged File Date Filtered" toggleable>
          {props.progressbarVisible ? (
            <>
              <h5>Processing</h5>
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px" }}
              ></ProgressBar>
            </>
          ) : dateFilteredFile ? (
            <DateFilteredFile />
          ) : (
            "Not Date Filtered yet"
          )}
        </Fieldset>
      </div>
      <div className="p-col">
        <Fieldset legend="Error during Date Filter" toggleable>
          {props.ErrorMessage}
        </Fieldset>
      </div>
    </>
  );
}
