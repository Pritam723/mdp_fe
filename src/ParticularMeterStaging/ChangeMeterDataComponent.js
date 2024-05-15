import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { Dropdown } from "primereact/dropdown";

import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import "primeflex/primeflex.css";
import moment from "moment";
import { Button } from "primereact/button";
import axios from "axios";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Divider } from "primereact/divider";

export default function ChangeMeterDataComponent(props) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [changeLogRemarks, setChangeLogRemarks] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [equation, setEquation] = useState("");
  const [ends, setEnds] = useState([
    { name: "No Data", code: "No Data" },
    { name: "No Data", code: "No Data" },
  ]);
  const [selectedEnd, setSelectedEnd] = useState({
    name: "No Data",
    code: "No Data",
  });

  const [entityName, setEntityName] = useState("");
  const [feederName, setFeederName] = useState("");

  const onStartDateChange = (e) => {
    setStartDate(e.value);
    console.log(e.value);
  };
  const onEndDateChange = (e) => {
    setEndDate(e.value);
    console.log(e.value);
  };
  const onEndChange = (e) => {
    setSelectedEnd(e.value);
    console.log(e.value);
  };
  const onEquationChange = (e) => {
    setEquation(e.target.value.toUpperCase());
    console.log(e.target.value.toUpperCase());
  };
  const changeMeterEndData = () => {
    const uploadData = new FormData();
    uploadData.append("meterEndToReplace", selectedEnd["name"]);
    uploadData.append(
      "otherEnd",
      ends.filter((item) => item.name !== selectedEnd["name"])[0]["name"]
    );
    uploadData.append("equationToReplaceWith", equation);
    uploadData.append("entityName", entityName);
    uploadData.append("feederName", feederName);

    uploadData.append(
      "startDate",
      moment(startDate).format("MM/DD/YYYY HH:mm:ss")
    );

    uploadData.append("endDate", moment(endDate).format("MM/DD/YYYY HH:mm:ss"));
    uploadData.append("dataToChange", props.dataToChange);
    uploadData.append("Remarks", changeLogRemarks);
    axios
      .post("/fifteenmmdp/changeMeterEndData/" + props.meterId, uploadData)
      .then((response) => {
        console.log("done");
        props.fetchGraphDataAgain();
      })
      .catch((error) => {});
  };

  const revertMeterEndData = () => {
    const uploadData = new FormData();
    uploadData.append("meterEndToReplace", selectedEnd["name"]);
    uploadData.append(
      "otherEnd",
      ends.filter((item) => item.name !== selectedEnd["name"])[0]["name"]
    );
    uploadData.append("entityName", entityName);
    uploadData.append("feederName", feederName);
    axios
      .post("/fifteenmmdp/revertMeterEndData/" + props.meterId, uploadData)
      .then((response) => {
        console.log("done");
        props.fetchGraphDataAgain();
      })
      .catch((error) => {});
  };

  const zeroFillMeterEndData = () => {
    const uploadData = new FormData();
    uploadData.append("meterEndToReplace", selectedEnd["name"]);
    uploadData.append(
      "otherEnd",
      ends.filter((item) => item.name !== selectedEnd["name"])[0]["name"]
    );
    uploadData.append("entityName", entityName);
    uploadData.append("feederName", feederName);
    axios
      .post("/fifteenmmdp/zeroFillMeterEndData/" + props.meterId, uploadData)
      .then((response) => {
        console.log("done");
        props.fetchGraphDataAgain();
      })
      .catch((error) => {});
  };

  useEffect(() => {
    setEnds([
      { name: props.end1, code: props.end1 },
      { name: props.end2, code: props.end2 },
    ]);
    setSelectedEnd({ name: props.end1, code: props.end1 });
    setEntityName(props.entity);
    setFeederName(props.feederName);
    setChangeLogRemarks("");
    setEquation("");
  }, [props]);
  useEffect(() => {
    fetch("/fifteenmmdp/fetchDateInfo/" + props.meterId)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
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
  }, [props.dataToChange]);
  return (
    <div className="p-grid">
      <div className="p-col">
        <label>Meter Data to replace </label>
        <div className="dropdown-demo">
          <Dropdown
            value={selectedEnd}
            options={ends}
            onChange={(e) => onEndChange(e)}
            optionLabel="name"
            placeholder="Select a Meter"
          />{" "}
          <Divider />
          <Button
            label="Zero Fill Unavailable Data"
            icon="pi pi-check-circle"
            className="p-button-rounded p-button-help"
            onClick={() => {
              zeroFillMeterEndData();
              console.log("Zero Fill Unavailable Data");
            }}
          />
        </div>{" "}
      </div>
      <div className="p-col">
        <label>Equation </label>
        <InputTextarea
          value={equation}
          placeholder="Put equation to replace with."
          style={{ height: "40px", width: "300px" }}
          onChange={(e) => {
            onEquationChange(e);
          }}
          rows={1}
          cols={20}
        />{" "}
      </div>
      <div className="p-col">
        <label>From </label>
        <br />
        <Calendar
          id="time24"
          value={startDate}
          dateFormat="dd/mm/yy"
          minDate={minDate}
          maxDate={maxDate}
          stepMinute={15}
          onChange={(e) => onStartDateChange(e)}
          showTime={props.dataToChange == "MWH Data" ? true : false}
        />{" "}
      </div>
      <div className="p-col">
        <label>To </label>
        <br />
        <Calendar
          id="time24"
          value={endDate}
          dateFormat="dd/mm/yy"
          minDate={minDate}
          maxDate={maxDate}
          stepMinute={15}
          onChange={(e) => onEndDateChange(e)}
          showTime={props.dataToChange == "MWH Data" ? true : false}
        />
      </div>
      <div className="p-col">
        <label>Remarks </label>
        <br />
        <InputText
          value={changeLogRemarks}
          onChange={(e) => setChangeLogRemarks(e.target.value)}
        />
      </div>
      <div className="p-col">
        <br />
        <Button
          label="Make changes"
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => {
            changeMeterEndData();
            console.log("Change");
          }}
        />
        <Divider />
        <Button
          label="Revert Back Changes"
          icon="pi pi-replay"
          className="p-button-rounded"
          onClick={() => {
            revertMeterEndData();
            console.log("revert");
          }}
        />
      </div>{" "}
    </div>
  );
}
