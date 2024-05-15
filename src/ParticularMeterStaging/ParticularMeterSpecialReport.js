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
import "primeflex/primeflex.css";
import axios from "axios";
import ParticularMeterEndsCompare from "./ParticularMeterEndsCompare.js";
import { Fieldset } from "primereact/fieldset";

export default function CalendarDemo() {
  const [data, setData] = useState(null);
  let { meterIdParam } = useParams();
  const [displayText, setDisplayText] = useState({ gen: [], drw: [] });
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [selectedXValue, setSelectedXValue] = useState(null);
  const [genVal, setGenVal] = useState(null);
  const [drwVal, setDrwVal] = useState(null);
  const [threshold, setThreshold] = useState(0.5);

  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };

  const onClickDot = (name, position) => {
    dialogFuncMap[`${name}`](true);
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };
  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
      </div>
    );
  };

  const DialogDemo = () => {
    return (
      <div className="dialog-demo">
        <div className="card">
          <Dialog
            header={
              "Generation vs Drawal Breakdown : " +
              selectedXValue +
              "(YYYY-MM-DD HH:MM)"
            }
            visible={displayResponsive}
            onHide={() => onHide("displayResponsive")}
            breakpoints={{ "960px": "75vw" }}
            style={{ width: "50vw" }}
            footer={renderFooter("displayResponsive")}
          >
            <h5>Generation(RN-95) Breakdown : {genVal} %</h5>

            <div className="p-d-flex p-ai-center p-flex-wrap">
              {displayText["gen"].map((item) => item)}
            </div>
            <Divider />
            <h5>Drawal(RN-96) Breakdown : {drwVal} %</h5>

            <div className="p-d-flex p-ai-center p-flex-wrap">
              {displayText["drw"].map((item) => item)}
            </div>
          </Dialog>
        </div>
      </div>
    );
  };

  const onClickHandler = (event) => {
    let point = event.points[0].pointNumber;
    console.log(event.points[0]);
    let hoverDataGeneration = event.points[0].data.hoverDataGeneration;
    let hoverDataDrawal = event.points[0].data.hoverDataDrawal;
    let dataToShow = { gen: [], drw: [] };
    Object.keys(hoverDataGeneration).forEach((item) => {
      dataToShow["gen"].push(
        <Chip
          label={item + " = " + hoverDataGeneration[item][point] + "% "}
          // icon="pi pi-tablet"
          className="p-mr-2 p-mb-2 custom-chip"
        />
      );
    });
    Object.keys(hoverDataDrawal).forEach((item) => {
      dataToShow["drw"].push(
        <Chip
          label={item + " = " + hoverDataDrawal[item][point] + "% "}
          // icon="pi pi-tablet"
          className="p-mr-2 p-mb-2 custom-chip"
        />
      );
    });
    setGenVal(event.points[0].data.genVal[point]);
    setDrwVal(event.points[0].data.drwVal[point]);

    setSelectedXValue(event.points[0].x);
    setDisplayText(dataToShow);
    onClickDot("displayResponsive");
  };

  // useEffect(() => {

  // }, []);

  const fetchLossData = () => {
    const uploadData = new FormData();
    uploadData.append("threshold", threshold);

    axios
      .post("/fifteenmmdp/specialReports/" + meterIdParam, uploadData)
      .then((res) => res.data)
      .then((result) => {
        setData(result["dataToSend"]);
        console.log(result);
      });
  };

  return (
    <>
      <Fieldset
        legend="Successive Loss Percentage Difference Method"
        toggleable
        collapsed={true}
      >
        <DialogDemo />
        <div className="p-grid">
          <div className="p-col"></div>

          <div className="p-col">
            <label>
              <b>Set Threshold : </b>
            </label>{" "}
            <InputText
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
          <div className="p-col">
            {" "}
            <Button
              label="Fetch Loss Data"
              className="p-button-rounded p-button-success"
              onClick={fetchLossData}
            />{" "}
          </div>
          <div className="p-col">Work with Graph</div>
        </div>

        <Plot
          data={data}
          layout={{
            width: 1500,
            height: 500,
            title: "Loss percentage successive difference",
            hovermode: "closest",
          }}
          onClick={(event) => {
            onClickHandler(event);
          }}
        />
      </Fieldset>
      <Divider />
      <Divider />

      <ParticularMeterEndsCompare />
    </>
  );
}
