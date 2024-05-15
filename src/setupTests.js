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

export default function ParticularMeterMWH(props) {
  let emptyRealMeterMWH = {
    model: "fifteenmmdp.realmetermwh",
    pk: null,
    fields: {
      meterFile: null,
      dirStructureMWH: null,
    },
  };
  //   const location = useLocation();
  let { meterIdParam } = useParams();
  let match = useRouteMatch();

  const [realMeterMWHData, setRealMeterMWHData] = useState(emptyRealMeterMWH);

  useEffect(() => {
    fetch("/fifteenmmdp/getRealMeterMWHData/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          setRealMeterMWHData(result[0]);
        }
        console.log(result);
        console.log(
          JSON.parse(result[0].fields.dirStructureRealMWH).files.length
        );
      })
      .catch((error) => {
        console.log("Some server side error");
      });
  }, []);

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
          ) : realMeterMWHData.fields.dirStructureRealMWH ? (
            <FolderStructure
              dir={realMeterMWHData.fields.dirStructureRealMWH}
              fileType="RealMeterMWHFiles"
              meterId={realMeterMWHData.fields.meterFile}
            />
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
