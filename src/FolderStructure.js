import React, { useState, useEffect, useLayoutEffect } from "react";
import "./styles.css";

import Tree from "./Tree/Tree";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import SidebarActions from "./SidebarActions";
import axios from "axios";
import proxyServer from "./GlobalVars";

export default function FolderStructure(props) {
  // Just add objects to this
  const FileTypeMap = {
    NPCFiles: {
      _fileName: "NPC File",
      _changeMethod: "changeNPCFile",
      _downloadMethod: "downloadNPCFile",
    },
    RealMeterMWHFiles: {
      _fileName: "Real Meter MWH Files",
      _changeMethod: "changeRealMeterMWHFile",
      _downloadMethod: "downloadRealMeterMWHFile",
    },
    FictMeterMWHFiles: {
      _fileName: "Fictitious Meter MWH Files",
      _changeMethod: "changeFictMeterMWHFile",
      _downloadMethod: "downloadFictMeterMWHFile",
    },
    FinalOutputFiles: {
      _fileName: "Final Output Files",
      _changeMethod: "changeFinalOutputFile",
      _downloadMethod: "downloadFinalOutputFile",
    },
  };

  // const [data, setData] = useState([JSON.parse(props.dir)]);
  const [data, setData] = useState([]);

  const [fileName, setFileName] = useState(null);
  const [changeMethod, setChangeMethod] = useState(null);
  const [downloadMethod, setdownloadMethod] = useState(null);

  const [visibleRight, setVisibleRight] = useState(false);
  // const [nodePath, setNodePath] = useState(null);
  const [nodeName, setNodeName] = useState(null);
  const [nodeId, setNodeId] = useState(null);

  const [fileToUpload, setFileToUpload] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log(props);
    setData([props.dir]);
    setFileName(FileTypeMap[props.fileType]._fileName);
    setChangeMethod(FileTypeMap[props.fileType]._changeMethod);
    setdownloadMethod(FileTypeMap[props.fileType]._downloadMethod);
  }, [props]);
  // const SidebarDemo = () => {
  //   return (
  //     <div>
  //       <div className="card">
  //         {/* <Button
  //           icon="pi pi-arrow-left"
  //           onClick={() => setVisibleRight(true)}
  //           className="p-mr-2"
  //         /> */}
  //       </div>
  //     </div>
  //   );
  // };

  const saveFile = () => {
    setSubmitted(true);
    // setVisibleRight(false)
    if (fileToUpload) {
      const uploadData = new FormData();

      uploadData.append("fileToUpload", fileToUpload, fileToUpload.name);
      console.log(uploadData);
      axios
        .post(
          "/fifteenmmdp/" + changeMethod + "/" + props.meterId + "/" + nodeId,
          uploadData
        )
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log(nodeId);
    }
  };

  const handleClick = (node) => {
    console.log(node);
    console.log("hiiiiiiiii");
    if (node.node.type == "file") {
      // setNodePath(node.node.path);
      setNodeName(node.node.name);
      setNodeId(node.node.id);
      setVisibleRight(true);
      setSubmitted(false);
    }
  };
  const handleUpdate = (state) => {
    localStorage.setItem(
      "tree",
      JSON.stringify(state, function (key, value) {
        if (key === "parentNode" || key === "id") {
          return null;
        }
        return value;
      })
    );
  };
  const onFileChange = (e, name) => {
    console.log("fine");
    setFileToUpload(e.target.files[0]);
  };

  // useLayoutEffect(() => {
  //   try {
  //     let savedStructure = JSON.parse(localStorage.getItem("tree"));
  //     if (savedStructure) {
  //       setData(savedStructure);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  return (
    <div className="App">
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
          {"Change " + fileName}
          <br />
          <a
            href={
              proxyServer +
              "/fifteenmmdp/" +
              downloadMethod +
              "/" +
              props.meterId +
              "/" +
              nodeId
            }
            download={
              "/fifteenmmdp/" +
              downloadMethod +
              props.meterId +
              "/" +
              "/" +
              nodeId
            }
          >
            {" "}
            {nodeName}{" "}
          </a>
        </h5>
        <br />
        <div className="p-field">
          <label htmlFor="fileToUpload" className="p-sr-only">
            {"Change " + fileName}
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

      <Tree data={data} onUpdate={handleUpdate} onNodeClick={handleClick} />
    </div>
  );
}
