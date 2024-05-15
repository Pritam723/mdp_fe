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

export default function ParticularMeterFinalOutput(props) {
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
  const [dateWiseFODir, setdateWiseFODir] = useState({});
  const [dates, setDates] = useState([]);
  const [sendDir, setSendDir] = useState(null);
  const [reload, setReload] = useState(false);

  const reloadListedData = () => {
    setReload(true);
    fetch("/fifteenmmdp/reloadFinalOutputData/" + meterIdParam).then((res) =>
      window.location.reload()
    );
  };
  useEffect(() => {
    fetch("/fifteenmmdp/getFinalOutputData/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          setMeterFileId(result[0].fields.meterFile);
          let _dateWiseFODir = {};
          let _dates = [];

          let dirJson = JSON.parse(result[0].fields.dirStructureFinalOutput);
          dirJson.files.forEach((element) => {
            _dates.push(element.name);
            _dateWiseFODir[element.name] = element;
          });
          if (_dates.length > 0) {
            console.log("hii");
            setDates(_dates);
            setDate(_dates[0]);
            setdateWiseFODir(_dateWiseFODir);
            setSendDir(_dateWiseFODir[_dates[0]]);
            console.log(_dateWiseFODir);
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
        <Fieldset legend="Final Output Files" toggleable>
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
                    setSendDir(dateWiseFODir[e.value]);
                  }}
                />{" "}
                {date && sendDir ? (
                  <FolderStructure
                    dir={sendDir}
                    fileType="FinalOutputFiles"
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
                    "/fifteenmmdp/downLoadFullFinalOutputFiles/" +
                    meterIdParam
                  }
                >
                  <Button
                    icon="pi pi-download"
                    className="p-button-rounded p-button-help"
                    // onClick={downLoadFullRealMeterMWHFiles}
                  />
                </a>
                {"  "}Download Final Output Files
              </div>

              <div className="p-col">
                <a
                  href={
                    proxyServer +
                    "/fifteenmmdp/finalOutputExcel/" +
                    meterIdParam
                  }
                >
                  <Button
                    icon="pi pi-download"
                    className="p-button-rounded p-button-help"
                    // onClick={downLoadFullRealMeterMWHFiles}
                  />
                </a>
                {"  "}Download Final Output Excel File
                <br /> <br />
                <a
                  href={
                    proxyServer + "/fifteenmmdp/nldcLossExcel/" + meterIdParam
                  }
                >
                  <Button
                    icon="pi pi-download"
                    className="p-button-rounded p-button-help"
                    // onClick={downLoadFullRealMeterMWHFiles}
                  />
                </a>
                {"  "}Download NLDC Loss File
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
            "Final Output Files not created yet"
          )}
        </Fieldset>
      </div>
      <div className="p-col">
        <Fieldset legend="Error during Final Output Creation" toggleable>
          {props.ErrorMessage}
        </Fieldset>
      </div>
    </>
  );
}
