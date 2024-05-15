import React, { useEffect, useState } from "react";
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
import { SelectButton } from "primereact/selectbutton";
import proxyServer from "../GlobalVars";
import { Divider } from "primereact/divider";
import Plot from "react-plotly.js";
import FrequencyGraph from "./FrequencyGraph";
export default function ParticularMeterMWH(props) {
  // let emptyRealMeterMWH = {
  //   model: "fifteenmmdp.realmetermwh",
  //   pk: null,
  //   fields: {
  //     meterFile: null,
  //     dirStructureMWH: null,
  //   },
  // };
  //   const location = useLocation();
  let { meterIdParam } = useParams();
  // let match = useRouteMatch();

  // const [realMeterMWHData, setRealMeterMWHData] = useState(emptyRealMeterMWH);
  const [meterFileId, setMeterFileId] = useState(null);
  const [date, setDate] = useState(null);
  const [dateWiseMWHDir, setdateWiseMWHDir] = useState({});
  const [dates, setDates] = useState([]);
  const [sendDir, setSendDir] = useState(null);
  const [reload, setReload] = useState(false);

  // const downLoadFullRealMeterMWHFiles = () => {
  //   "/fifteenmmdp/downloadRealMeterMWHFile/8/7"

  //   console.log("jajaja");
  // };

  useEffect(() => {
    fetch("/fifteenmmdp/getRealMeterMWHData/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          setMeterFileId(result[0].fields.meterFile);
          let _dateWiseMWHDir = {};
          let _dates = [];

          let dirJson = JSON.parse(result[0].fields.dirStructureRealMWH);
          dirJson.files.forEach((element) => {
            _dates.push(element.name);
            _dateWiseMWHDir[element.name] = element;
          });
          if (_dates.length > 0) {
            console.log("hii");
            setDates(_dates);
            setDate(_dates[0]);
            setdateWiseMWHDir(_dateWiseMWHDir);
            setSendDir(_dateWiseMWHDir[_dates[0]]);
            console.log(_dateWiseMWHDir);
          }
        }
        console.log(result);
      });
    // .catch((error) => {
    //   console.log("Some server side error");
    // });
  }, []);

  const reloadListedData = () => {
    setReload(true);
    fetch("/fifteenmmdp/reloadRealMeterMWHData/" + meterIdParam).then((res) =>
      window.location.reload()
    );
  };

  return (
    <>
      <div className="p-col">
        <Fieldset legend="Real Meter MWH Files" toggleable>
          {props.progressbarVisible ? (
            <>
              <h5>Processing</h5>
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px" }}
              ></ProgressBar>
            </>
          ) : dates.length ? (
            <div className="p-grid">
              <div className="p-col">
                <SelectButton
                  value={date}
                  options={dates}
                  onChange={(e) => {
                    console.log(e.value);
                    setDate(e.value);
                    setSendDir(dateWiseMWHDir[e.value]);
                  }}
                />{" "}
                {date && sendDir ? (
                  <FolderStructure
                    dir={sendDir}
                    fileType="RealMeterMWHFiles"
                    meterId={meterFileId}
                  />
                ) : (
                  <></>
                )}
              </div>{" "}
              <div className="p-col">
                <a
                  href={
                    proxyServer +
                    "/fifteenmmdp/downLoadFullRealMeterMWHFiles/" +
                    meterIdParam
                  }
                >
                  <Button
                    icon="pi pi-download"
                    className="p-button-rounded p-button-help"
                    // onClick={downLoadFullRealMeterMWHFiles}
                  />
                </a>
                {"  "}Download Files
              </div>
              <div className="p-col">
                {!reload ? (
                  <Button
                    icon="pi pi-undo"
                    className="p-button-rounded p-button-info p-button-outlined"
                    onClick={reloadListedData}
                  />
                ) : (
                  <i
                    className="pi pi-spin pi-spinner"
                    style={{ fontSize: "2em" }}
                  ></i>
                )}
                {"   "}Reload Listed Files{" "}
              </div>
              <Divider />
              <FrequencyGraph meterId={meterIdParam} />
            </div>
          ) : (
            "Real Meter MWH Files not created yet"
          )}
        </Fieldset>
      </div>
      <div className="p-col">
        <Fieldset legend="Error during Real Meter MWH Creation" toggleable>
          {props.ErrorMessage}
        </Fieldset>
      </div>
    </>
  );
}
