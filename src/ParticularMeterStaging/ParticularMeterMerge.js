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
// import FolderStructure from "../FolderStructure";
// import { Tag } from "primereact/tag";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import proxyServer from "../GlobalVars";

export default function ParticularMeter(props) {
  let { meterIdParam } = useParams();
  const [mergedFile, setMergedFile] = useState(null);
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
  const MergedFile = () => {
    return (
      <div>
        <Button
          onClick={() => {
            setNodeName(mergedFile.fields.fileName);
            setNodeId(mergedFile.pk);
            setVisibleRight(true);
            setSubmitted(false);
          }}
          label={mergedFile.fields.fileName}
          className="p-button-link"
        />
      </div>
    );
  };
  useEffect(() => {
    fetch("/fifteenmmdp/getMergedFile/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        if (result.length == 1) {
          setMergedFile(result[0]);
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
        .post("/fifteenmmdp/changeMergedFile/" + nodeId, uploadData)
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
          Change Merged File
          <br />
          <a
            href={proxyServer + "/fifteenmmdp/downloadMergedFile/" + nodeId}
            download={"/fifteenmmdp/downloadMergedFile/" + nodeId}
          >
            {" "}
            {nodeName}{" "}
          </a>
        </h5>
        <br />
        <div className="p-field">
          <label htmlFor="fileToUpload" className="p-sr-only">
            Merged File{" "}
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
        <Fieldset legend="Merged File" toggleable>
          {props.progressbarVisible ? (
            <>
              <h5>Processing</h5>
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px" }}
              ></ProgressBar>
            </>
          ) : mergedFile ? (
            <MergedFile />
          ) : (
            "Not Merged yet"
          )}
        </Fieldset>
      </div>
      <div className="p-col">
        <Fieldset legend="Error during Merge" toggleable>
          {props.ErrorMessage}
        </Fieldset>
      </div>
    </>
  );
}
