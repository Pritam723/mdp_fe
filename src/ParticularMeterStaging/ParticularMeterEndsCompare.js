import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import "primeflex/primeflex.css";
import Plot from "react-plotly.js";
import { useParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "../cssFiles/DialogDemo.css";
import { Chip } from "primereact/chip";
import "../cssFiles/ChipDemo.css";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import "primeflex/primeflex.css";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import moment from "moment";
// import { classNames } from "primereact/utils";
import { Tree } from "primereact/tree";
import { ProgressSpinner } from "primereact/progressspinner";

export default function ParticularMeterEndsCompare() {
  let { meterIdParam } = useParams();
  const [fetching, setFetching] = useState(false);
  const [nodes, setNodes] = useState([]);

  const [voltageLevel, setVoltageLevel] = useState({
    name: "33 KV",
    code: "33",
  });
  const voltageLevels = [
    { name: "33 KV", code: "33" },
    { name: "66 KV", code: "66" },
    { name: "132 KV", code: "132" },
    { name: "220 KV", code: "220" },
    { name: "400 KV", code: "400" },
    { name: "765 KV", code: "765" },
  ];

  const [parameter, setParameter] = useState({
    name: "Percentage",
    code: "Percentage",
  });
  const parameters = [
    { name: "Percentage", code: "Percentage" },
    { name: "MWH", code: "MWH" },
    { name: "Percentage & MWH", code: "Percentage & MWH" },
    { name: "Percentage or MWH", code: "Percentage or MWH" },
  ];

  const [percentageDiff, setPercentageDiff] = useState(0);
  const [mwhDiff, setMwhDiff] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  const downloadViolation = (node) => {
    console.log("downloadViolation");
    console.log(node);

    // setFetching(true);
    var formData = new FormData();
    console.log("Creating Form Data");
    let filename = node.end1 + " vs " + node.end2 + " Comparison";
    formData.append("end1", node.end1);
    formData.append("end2", node.end2);
    formData.append("startDate", node.startDate);
    formData.append("endDate", node.endDate);
    formData.append("parameter", node.parameter);
    formData.append("percentageDiff", node.percentageDiff);
    formData.append("mwhDiff", node.mwhDiff);
    formData.append("energyType", node.energyType);

    axios("/fifteenmmdp/downloadViolationForParticularFeeder/" + meterIdParam, {
      method: "POST", //Pretty sure you want a GET method but otherwise POST methods can still return something too.
      responseType: "blob", // important
      data: formData,
    })
      .then((response) => {
        //Creates an <a> tag hyperlink that links the excel sheet Blob object to a url for downloading.
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        // link.setAttribute("download", `${Date.now()}.xlsx`); //set the attribute of the <a> link tag to be downloadable when clicked and name the sheet based on the date and time right now.
        link.setAttribute("download", filename + ".txt");
        document.body.appendChild(link);
        link.click(); //programmatically click the link so the user doesn't have to
        document.body.removeChild(link);
        URL.revokeObjectURL(url); //important for optimization and preventing memory leak even though link element has already been removed. In the case of long running apps that haven't been reloaded many times.
      })
      .then(() => {
        // setFetching(false);
      });
    // setFetching(false);
    // console.log("Set fetching to false");
  };

  const nodeTemplate = (node) => {
    let label = <b>{node.label}</b>;

    if (node.type) {
      label = (
        <Button
          label={node.label}
          className="p-button-rounded p-button-help"
          onClick={() => {
            downloadViolation(node);
          }}
        />
      );
    }
    return <span>{label}</span>;
  };

  const onStartDateChange = (e) => {
    setStartDate(e.value);
    console.log(e.value);
  };
  const onEndDateChange = (e) => {
    setEndDate(e.value);
    console.log(e.value);
  };

  const compareEndsDataForLossAnalysis = () => {
    setFetching(true);
    const uploadData = new FormData();
    uploadData.append("voltageLevel", voltageLevel.code);
    uploadData.append("parameter", parameter.code);
    uploadData.append("percentageDiff", percentageDiff);
    uploadData.append("mwhDiff", mwhDiff);

    uploadData.append(
      "startDate",
      moment(startDate).format("MM/DD/YYYY HH:mm:ss")
    );

    uploadData.append("endDate", moment(endDate).format("MM/DD/YYYY HH:mm:ss"));

    axios
      .post(
        "/fifteenmmdp/compareEndsDataForLossAnalysis/" + meterIdParam,
        uploadData
      )
      .then((response) => {
        // console.log(response);
        setNodes(response.data);
        console.log("Done");
        setFetching(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetch("/fifteenmmdp/fetchDateInfo/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        console.log(result.data);
        setMinDate(
          moment(result.startDate + "T00:00:00", "YYYY-MM-DDThh:mm:ss").toDate()
        );
        setMaxDate(
          moment(result.endDate + "T23:45:00", "YYYY-MM-DDThh:mm:ss").toDate()
        );
        setStartDate(
          moment(result.startDate + "T00:00:00", "YYYY-MM-DDThh:mm:ss").toDate()
        );
        setEndDate(
          moment(result.endDate + "T23:45:00", "YYYY-MM-DDThh:mm:ss").toDate()
        );
      });
  }, []);
  return (
    <Fieldset legend="End Comparison Method" toggleable>
      <div className="p-grid">
        <div className="p-col">
          <h5>Select Voltage Level</h5>{" "}
          <div className="card flex justify-content-center">
            <Dropdown
              value={voltageLevel}
              onChange={(e) => setVoltageLevel(e.value)}
              options={voltageLevels}
              optionLabel="name"
              placeholder="Select voltage level"
              className="w-full md:w-14rem"
            />
          </div>
        </div>
        <div className="p-col">
          <h5>Parameters to Compare</h5>
          <div className="card flex justify-content-center">
            <Dropdown
              value={parameter}
              onChange={(e) => setParameter(e.value)}
              options={parameters}
              optionLabel="name"
              placeholder="Select voltage level"
              className="w-full md:w-14rem"
            />
          </div>
        </div>

        {parameter.name != "MWH" ? (
          <div className="p-col">
            <h5>Percentage (abs diff)</h5>{" "}
            <div className="card flex justify-content-center">
              <InputNumber
                value={percentageDiff}
                onValueChange={(e) => setPercentageDiff(e.value)}
                minFractionDigits={2}
                maxFractionDigits={2}
                prefix=">= "
                suffix=" % abs diff"
              />
            </div>
          </div>
        ) : (
          <React.Fragment></React.Fragment>
        )}

        {parameter.name != "Percentage" ? (
          <div className="p-col">
            <h5>MWH (abs diff)</h5>{" "}
            <div className="card flex justify-content-center">
              <InputNumber
                value={mwhDiff}
                onValueChange={(e) => setMwhDiff(e.value)}
                minFractionDigits={2}
                maxFractionDigits={2}
                prefix=">= "
                suffix=" MWH abs diff"
              />
            </div>
          </div>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        <div className="p-col">
          {" "}
          <h5>Start DateTime</h5>{" "}
          <Calendar
            id="time24"
            value={startDate}
            dateFormat="dd/mm/yy"
            minDate={minDate}
            maxDate={maxDate}
            stepMinute={15}
            onChange={(e) => onStartDateChange(e)}
            showTime
          />{" "}
        </div>
        <div className="p-col">
          {" "}
          <h5>End DateTime</h5>{" "}
          <Calendar
            id="time24"
            value={endDate}
            dateFormat="dd/mm/yy"
            minDate={minDate}
            maxDate={maxDate}
            stepMinute={15}
            onChange={(e) => onEndDateChange(e)}
            showTime
          />
        </div>
        <div className="p-col">
          <h5>Fetch Info</h5>{" "}
          <Button
            label="Fetch"
            icon="pi pi-sort-amount-down"
            className="p-button-rounded p-button-success"
            onClick={() => {
              compareEndsDataForLossAnalysis();
            }}
          />{" "}
        </div>
      </div>
      <Divider />

      <div className="card flex flex-wrap justify-content-center gap-5">
        {fetching ? (
          <div className="card flex justify-content-center">
            <ProgressSpinner />
          </div>
        ) : (
          <Tree
            value={nodes}
            filter
            filterMode="lenient"
            filterPlaceholder="Search Feeder"
            nodeTemplate={nodeTemplate}
            className="w-full md:w-30rem"
          />
        )}
      </div>
    </Fieldset>
  );
}
