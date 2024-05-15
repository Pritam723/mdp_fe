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
import "./cssFiles/Grid.css";
import "primeflex/primeflex.css";
import DataTable from "./DataTable";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import axios from "axios";
import FolderStructure from "./FolderStructure";
// import SidebarActions from "./SidebarActions";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { MultiSelect } from "primereact/multiselect";
import "./cssFiles/MultiSelectDemo.css";
import { Divider } from "primereact/divider";

import ParticularMeterExtract from "./ParticularMeterStaging/ParticularMeterExtract";
import ParticularMeterMerge from "./ParticularMeterStaging/ParticularMeterMerge";
import ParticularMeterValidate from "./ParticularMeterStaging/ParticularMeterValidate";
import ParticularMeterDateFilter from "./ParticularMeterStaging/ParticularMeterDateFilter";
import ParticularMeterMWH from "./ParticularMeterStaging/ParticularMeterMWH";
import ParticularMeterFict from "./ParticularMeterStaging/ParticularMeterFict";
import ParticularMeterFinalOutput from "./ParticularMeterStaging/ParticularMeterFinalOutput";
import ParticularMeterAnalyse from "./ParticularMeterStaging/ParticularMeterAnalyse";
import ParticularMeterSpecialReport from "./ParticularMeterStaging/ParticularMeterSpecialReport";
import SelectMeters from "./SelectMeters";
import SelectFictMeters from "./SelectFictMeters";
import SelectDates from "./SelectDates";

import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";
import "./cssFiles/StepsDemo.css";
import { useHistory } from "react-router-dom";
import proxyServer from "./GlobalVars";

export default function ParticularMeter(props) {
  let emptyMeter = {
    model: "fifteenmmdp.allmeterfiles",
    pk: null,
    fields: {
      year: "",
      month: "",
      zippedMeterFile: null,
      dirStructure: null,
      status: null,
    },
  };

  const StatusMap = {
    Uploaded: { _href: "extract", _index: 0, _processStage: "Extract" },
    Extracted: { _href: "merge", _index: 1, _processStage: "Merge" },
    Merged: { _href: "dateFilter", _index: 2, _processStage: "Date Filter" },
    DateFiltered: {
      _href: "validate",
      _index: 3,
      _processStage: "Validate",
    },
    Verified: {
      _href: "realMeterMWH",
      _index: 4,
      _processStage: "Create Real Meter MWH",
    },
    MWHCreated: {
      _href: "fictMeterMWH",
      _index: 5,
      _processStage: "Create Fictitious Meter MWH",
    },
    FictCreated: {
      _href: "finalOutput",
      _index: 6,
      _processStage: "Final Output",
    },
    FinalOutputCreated: {
      _href: "analyseData",
      _index: 7,
      _processStage: "Analyse",
    },
    AnalyseDone: {
      _href: "specialReports",
      _index: 8,
      _processStage: "Special Reports",
    },
  };
  const items = [
    {
      label: "Extract uploaded file",
      command: () => {
        history.push(`${match.url}/extract`);
        setProcessStage("Extract");
      },
    },
    {
      label: "Merge NPC Files",
      command: () => {
        history.push(`${match.url}/merge`);
        setProcessStage("Merge");
      },
    },
    {
      label: "Date Filter",
      command: () => {
        history.push(`${match.url}/dateFilter`);
        setProcessStage("Date Filter");
      },
    },
    {
      label: "Validate Merged File",
      command: () => {
        history.push(`${match.url}/validate`);
        setProcessStage("Validate");
      },
    },
    {
      label: "Create Real Meter MWH",
      command: (event) => {
        history.push(`${match.url}/realMeterMWH`);
        setProcessStage("Create Real Meter MWH");
      },
    },
    {
      label: "Create Fictitious Meter MWH",
      command: (event) => {
        history.push(`${match.url}/fictMeterMWH`);
        setProcessStage("Create Fictitious Meter MWH");
      },
    },
    {
      label: "Create Final Output",
      command: (event) => {
        history.push(`${match.url}/finalOutput`);
        setProcessStage("Final Output");
      },
    },
    {
      label: "Analyse Data",
      command: (event) => {
        history.push(`${match.url}/analyseData`);
        setProcessStage("Analyse");
      },
    },
    {
      // label: "Special Reports",
      label: "Loss Analysis",

      command: (event) => {
        history.push(`${match.url}/specialReports`);
        setProcessStage("Special Reports");
      },
    },
  ];
  const process = [
    "extract",
    "merge",
    "dateFilter",
    "validate",
    "realMeterMWH",
    "fictMeterMWH",
    "finalOutput",
    "analyseData",
    "specialReports",
  ];
  //   const location = useLocation();
  let { meterIdParam } = useParams();
  let match = useRouteMatch();
  const [meter, setMeter] = useState(emptyMeter);
  let history = useHistory();
  const [activeIndex, setActiveIndex] = useState(0);
  const [processStage, setProcessStage] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(["No Error"]);
  const [progressbarVisible, setProgressbarVisible] = useState(false);
  const [visibleOverwrite, setVisibleOverwrite] = useState(false);
  const toast = useRef(null);

  ///////////////////////////////////////
  const selectDatesRef = useRef();
  const selectMetersRef = useRef();
  const selectFictMetersRef = useRef();

  const getAllDates = () => {
    const x = selectDatesRef.current.getDates();
    console.log(x);
  };

  const getAllMeters = () => {
    const x = selectMetersRef.current.getMeters();
    console.log(x);
  };

  const getAllFictMeters = () => {
    const x = selectFictMetersRef.current.getFictMeters();
    console.log(x);
  };

  //////////////////////////////////////

  useEffect(() => {
    console.log(meterIdParam);
    fetch("/fifteenmmdp/getMeterData/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        setMeter(result[0]);
        history.push(StatusMap[result[0].fields.status]._href);
        setProcessStage(StatusMap[result[0].fields.status]._processStage);
        setActiveIndex(StatusMap[result[0].fields.status]._index);
        setRedirectTo(StatusMap[result[0].fields.status]._href);
        console.log(result);
      });
  }, []);

  // These functions are specially made for realMeterMWH Satge. To give Overwrite option
  // const processMWHOverWrite = (id,overwriteParam) => {
  //   if(overwriteParam){
  //     console.log(id)
  //     console.log("Overwrite files")
  //   }else{
  //     console.log(id)
  //     console.log("Do not overwrite")
  //   }
  // }

  const showWarn = () => {
    toast.current.show({
      severity: "warn",
      summary: "No meter/date selected.",
      detail: "Please select at least one meter and at least one date.",
      life: 3000,
    });
  };

  const processMWHOverWrite = (id, overwriteParam) => {
    console.log("already called");

    const allMeterDates = {
      realMeters: selectMetersRef.current.getMeters(),
      dates: selectDatesRef.current.getDates(),
    };
    if (
      allMeterDates.realMeters.length == 0 ||
      allMeterDates.dates.length == 0
    ) {
      showWarn();
      return;
    }
    setProgressbarVisible(true);

    axios
      .post(
        "/fifteenmmdp/realMeterMWH/" + id + "/" + overwriteParam,
        allMeterDates
      )
      .then((response) => {
        // console.log(response);
        setProgressbarVisible(false);

        window.location.reload();
      })
      .catch((error) => {
        setProgressbarVisible(false);

        console.log(error.response.data);
        let formattedErrors = [];
        error.response.data.forEach((error, index) => {
          formattedErrors.push(
            <h6 style={{ color: "Tomato" }}>
              {"(" + (index + 1) + ") " + error}
              <br />
            </h6>
          );
        });
        setErrorMsg(formattedErrors);
        // console.log("dfdf");

        // console.log(error.message);
      });
  };

  const processFictMWH = (id) => {
    const allMeterDates = {
      fictMeters: selectFictMetersRef.current.getFictMeters(),
      dates: selectDatesRef.current.getDates(),
    };
    if (
      allMeterDates.fictMeters.length == 0 ||
      allMeterDates.dates.length == 0
    ) {
      showWarn();
      return;
    }
    setProgressbarVisible(true);

    axios
      .post("/fifteenmmdp/fictMeterMWH/" + id, allMeterDates)
      .then((response) => {
        // console.log(response);
        setProgressbarVisible(false);

        window.location.reload();
      })
      .catch((error) => {
        setProgressbarVisible(false);

        console.log(error.response.data);
        let formattedErrors = [];
        error.response.data.forEach((error, index) => {
          formattedErrors.push(
            <h6 style={{ color: "Tomato" }}>
              {"(" + (index + 1) + ") " + error}
              <br />
            </h6>
          );
        });
        setErrorMsg(formattedErrors);
        // console.log("dfdf");

        // console.log(error.message);
      });
  };

  const processMeterData = (id) => {
    console.log("already called");

    if (process[activeIndex] == "realMeterMWH") {
      // console.log("i work")
      // setVisibleOverwrite(true);

      processMWHOverWrite(id, true);
      return;
    }

    if (process[activeIndex] == "fictMeterMWH") {
      // setVisibleOverwrite(true);

      processFictMWH(id);

      return;
    }

    setProgressbarVisible(true);
    axios
      .post("/fifteenmmdp/" + process[activeIndex] + "/" + id)
      .then((response) => {
        // console.log(response);
        setProgressbarVisible(false);

        window.location.reload();
      })
      .catch((error) => {
        setProgressbarVisible(false);

        console.log(error.response.data);
        let formattedErrors = [];
        error.response.data.forEach((error, index) => {
          formattedErrors.push(
            <h6 style={{ color: "Tomato" }}>
              {"(" + (index + 1) + ") " + error}
              <br />
            </h6>
          );
        });
        setErrorMsg(formattedErrors);
        // console.log("dfdf");

        // console.log(error.message);
      });
  };

  function ProcessUploadedMeterData(props) {
    console.log("I am called");
    // console.log(props);
    return (
      <div>
        <Button
          label={processStage}
          className="p-button-rounded"
          onClick={() => processMeterData(props.id)}
        />
        {processStage == "Create Real Meter MWH" ||
        processStage == "Create Fictitious Meter MWH" ? (
          <div>
            {processStage == "Create Real Meter MWH" ? (
              <>
                <SelectMeters meterId={props.id} ref={selectMetersRef} />
                {/* <button onClick={getAllMeters}> Get Real Meters </button> */}
              </>
            ) : (
              <>
                <SelectFictMeters
                  meterId={props.id}
                  ref={selectFictMetersRef}
                />
                {/* <button onClick={getAllFictMeters}>
                  {" "}
                  Get Fictitious Meters{" "}
                </button> */}
              </>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  return (
    <div className="p-grid p-dir-col">
      <div className="p-col">
        <div className="steps-demo">
          <Toast ref={toast}></Toast>
          <div className="card">
            <ConfirmDialog
              visible={visibleOverwrite}
              onHide={() => setVisibleOverwrite(false)}
              message="Keep existing files as it is? If you choose NO, existing files will be overwritten."
              header="Keep Files/Overwrite"
              icon="pi pi-exclamation-triangle"
              accept={() => {
                processMWHOverWrite(meter.pk, false);
              }}
              reject={() => {
                processMWHOverWrite(meter.pk, true);
              }}
            />
          </div>

          <div className="card">
            <div className="p-grid">
              <div className="p-col">
                <h5>Working with the uploaded Meter File</h5>
              </div>
              <div className="p-col">
                <h5>
                  <a href="/">Jump to home</a>
                </h5>
              </div>
            </div>
            <Steps
              model={items}
              activeIndex={activeIndex}
              onSelect={(e) => setActiveIndex(e.index)}
              readOnly={false}
            />
          </div>
        </div>{" "}
      </div>

      <div className="p-col">
        <h5>Particular Meter Data</h5>
        <Fieldset legend="Meter File Details" toggleable>
          <div className="p-col">
            <div className="p-grid">
              <div className="p-col">
                <h5>Year</h5> {meter.fields.year}
              </div>
              <div className="p-col">
                <h5>Month</h5> {meter.fields.month}
              </div>
              <div className="p-col">
                <h5>File</h5>
                <a
                  href={
                    proxyServer +
                    "/fifteenmmdp/media/" +
                    meter.fields.zippedMeterFile
                  }
                  download={
                    "/fifteenmmdp/media/" + meter.fields.zippedMeterFile
                  }
                >
                  {meter.fields.zippedMeterFile
                    ? meter.fields.zippedMeterFile.split("/").slice(-1).pop()
                    : null}
                </a>
              </div>
              <div className="p-col">
                {" "}
                <h5>Process</h5> <ProcessUploadedMeterData id={meter.pk} />{" "}
              </div>
              <div className="p-col">
                {" "}
                <h5>Status</h5> {meter.fields.status}{" "}
                {processStage == "Create Real Meter MWH" ||
                processStage == "Create Fictitious Meter MWH" ? (
                  <>
                    <SelectDates meterId={meter.pk} ref={selectDatesRef} />
                    {/* <button onClick={getAllDates}> Get Dates </button> */}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </Fieldset>
      </div>

      <div className="p-col">
        <Switch>
          <Route path={`${match.path}/extract`}>
            <ParticularMeterExtract
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>
          <Route path={`${match.path}/merge`}>
            {" "}
            <ParticularMeterMerge
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>
          <Route path={`${match.path}/dateFilter`}>
            {" "}
            <ParticularMeterDateFilter
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>{" "}
          <Route path={`${match.path}/validate`}>
            {" "}
            <ParticularMeterValidate
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>{" "}
          <Route path={`${match.path}/realMeterMWH`}>
            {" "}
            <ParticularMeterMWH
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>{" "}
          <Route path={`${match.path}/fictMeterMWH`}>
            {" "}
            <ParticularMeterFict
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>{" "}
          <Route path={`${match.path}/finalOutput`}>
            {" "}
            <ParticularMeterFinalOutput
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>{" "}
          <Route path={`${match.path}/analyseData`}>
            {" "}
            <ParticularMeterAnalyse
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>
          <Route path={`${match.path}/specialReports`}>
            {" "}
            <ParticularMeterSpecialReport
              progressbarVisible={progressbarVisible}
              ErrorMessage={errorMsg}
            />
          </Route>
          <Redirect to={`${match.url}/${redirectTo}`} />
        </Switch>
      </div>
    </div>
  );
}
