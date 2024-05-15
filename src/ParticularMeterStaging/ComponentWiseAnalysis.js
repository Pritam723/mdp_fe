import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { Dropdown } from "primereact/dropdown";
import proxyServer from "../GlobalVars";

import React, { useState, useEffect } from "react";
import "primeflex/primeflex.css";
import { Button } from "primereact/button";
import axios from "axios";
import Plot from "react-plotly.js";

export default function ChangeMeterDataComponent(props) {
  const [ends, setEnds] = useState([
    { name: "No Data", code: "No Data" },
    { name: "No Data", code: "No Data" },
  ]);
  const [selectedEnd, setSelectedEnd] = useState({
    name: "No Data",
    code: "No Data",
  });
  const [componentData, setComponentData] = useState([]);
  const onEndChange = (e) => {
    setSelectedEnd(e.value);
    console.log(e.value);
  };

  const componentWiseAnalysis = () => {
    const uploadData = new FormData();
    uploadData.append("meterEndToAnalyse", selectedEnd["name"]);
    axios
      .post("/fifteenmmdp/componentWiseAnalysis/" + props.meterId, uploadData)
      .then((response) => {
        console.log("done");
        console.log(response.data);
        setComponentData(response.data);
      })
      .catch((error) => {});
  };
  
  // const componentWiseExcelData = () => {
  //   const uploadData = new FormData();
  //   uploadData.append("meterEndToExcelData", selectedEnd["name"]);
  //   axios
  //     .post("/fifteenmmdp/componentWiseExcelData/" + props.meterId, uploadData)
  //     .then((response) => {
  //       console.log("done");
  //       // console.log(response.data);
  //       // setComponentData(response.data);
  //     })
  //     .catch((error) => {});
  // };

  useEffect(() => {
    setEnds([
      { name: props.end1, code: props.end1 },
      { name: props.end2, code: props.end2 },
    ]);
    setSelectedEnd({ name: props.end1, code: props.end1 });
  }, [props]);
  useEffect(() => {
    fetch("/fifteenmmdp/fetchDateInfo/" + props.meterId)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
  }, []);
  return (
    <div className="p-grid">
      <div className="p-col">
        <label>Choose Meter</label>

        <div className="dropdown-demo">
          <Dropdown
            value={selectedEnd}
            options={ends}
            onChange={(e) => onEndChange(e)}
            optionLabel="name"
            placeholder="Select a Meter"
          />
        </div>
      </div>
      <div className="p-col">
        <br />
        <Button
          label="Fetch Component-Wise Data"
          icon="pi pi-chart-bar"
          className="p-button-rounded p-button-success"
          onClick={() => {
            componentWiseAnalysis();
            console.log("Fetch Component-Wise Data");
          }}
        />
      </div>{" "}
      <div className="p-col">
        <br />
      
        <a
          href={
              proxyServer +
              "/fifteenmmdp/componentWiseExcelData/" +
              props.meterId + "/" + selectedEnd["name"]
            }
          >
            <Button
                icon="pi pi-file-excel"
                className="p-button-rounded p-button-info p-button-outlined"
              // onClick={downLoadFullRealMeterMWHFiles}
            />
          </a>
                {"  "}Download data in Excel
      </div>{" "}
      {/* <div className="p-col"></div> */}
      <div className="p-col">Work with Component-Wise Data</div>
      <Plot
        data={componentData}
        layout={{
          width: 1500,
          height: 500,
          title: "Component-Wise Plot",
        }}
      />
      <div className="p-col"></div>{" "}
    </div>
  );
}
