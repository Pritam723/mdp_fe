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

  const reloadListedData = () => {
    setReload(true);
    fetch("/fifteenmmdp/reloadFictMeterMWHData/" + meterIdParam).then((res) =>
      window.location.reload()
    );
  };
  useEffect(() => {
    fetch("/fifteenmmdp/getFictMeterMWHData/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          setMeterFileId(result[0].fields.meterFile);
          let _dateWiseMWHDir = {};
          let _dates = [];

          let dirJson = JSON.parse(result[0].fields.dirStructureFictMWH);
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

  return (
    <>
      <div className="p-col">
        <Fieldset legend="Fictitious Meter MWH Files" toggleable>
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
                    fileType="FictMeterMWHFiles"
                    meterId={meterFileId}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="p-col">
                <a
                  href={
                    proxyServer +
                    "/fifteenmmdp/downLoadFullFictMeterMWHFiles/" +
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
                <br /> <br />
                <a
                  href={
                    proxyServer +
                    "/fifteenmmdp/downLoadFullAllMWHFiles/" +
                    meterIdParam
                  }
                >
                  <Button
                    icon="pi pi-download"
                    className="p-button-rounded p-button-help"
                    // onClick={downLoadFullRealMeterMWHFiles}
                  />
                </a>
                {"  "}Download All Meter Files(Datewise)
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
            </div>
          ) : (
            "Fictitious Meter MWH Files not created yet"
          )}
        </Fieldset>
      </div>
      <div className="p-col">
        <Fieldset
          legend="Error during Fictitious Meter MWH Creation"
          toggleable
        >
          {props.ErrorMessage}
        </Fieldset>
      </div>
    </>
  );
}
