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
import Plot from "react-plotly.js";
import { Dropdown } from "primereact/dropdown";
import { CascadeSelect } from "primereact/cascadeselect";
import { Divider } from "primereact/divider";
import proxyServer from "../GlobalVars";

import "../cssFiles/AccordionDemo.css";
import ChangeMeterDataComponent from "./ChangeMeterDataComponent";
import ComponentWiseAnalysis from "./ComponentWiseAnalysis";

export default function ParticularMeter(props) {
  let { meterIdParam } = useParams();

  const [xAxisData, setXAxisData] = useState([]);
  const [end1Data, setEnd1Data] = useState([]);
  const [end2data, setEnd2Data] = useState([]);
  const [diff, setDiff] = useState([]);
  const [diffPercentage, setDiffPercentage] = useState([]);

  const [stateWiseData, setStateWiseData] = useState({});
  const [feeders, setFeeders] = useState([]);

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedFeeder, setSelectedFeeder] = useState({
    id: null,
    "Feeder Name": "",
    End1: "",
    End2: "",
  });

  const [polarity, setPolarity] = useState({
    name: "Default",
    multiplier: "def",
  });

  const polarityArray = [
    { name: "Default", multiplier: "def" },
    { name: "Opposite", multiplier: "opp" },
  ];

  const [dataType, setDataType] = useState({
    name: "MWH Data",
    type: "MWH Data",
  });

  const dataTypeArray = [
    {
      name: "MWH Data",
      type: "MWH Data",
    },
    {
      name: "Active Data",
      type: "Active Data",
    },
    {
      name: "Reactive High",
      type: "Reactive High",
    },
    {
      name: "Reactive Low",
      type: "Reactive Low",
    },
  ];

  const entities = [
    {
      type: "States",
      code: "states",
      entities: [
        { name: "BIHAR", code: "BH" },
        { name: "WEST BENGAL", code: "WB" },
        { name: "DVC", code: "DVC" },
        { name: "GRIDCO", code: "GR" },
        { name: "SIKKIM", code: "SKM" },
        { name: "JHARKHAND", code: "JH" },
      ],
    },
    {
      type: "Generators",
      code: "generators",
      entities: [
        { name: "BARH(NTPC)", code: "BARH(NTPC)" },
        { name: "FARAKKA", code: "FARAKKA" },
        { name: "Kahalgaon", code: "Kahalgaon" },
        { name: "Talcher", code: "Talcher" },
        { name: "BRBCL", code: "BRBCL" },
        { name: "DARLIPALLI", code: "DARLIPALLI" },
        { name: "MTPS", code: "MTPS" },
        { name: "NPGC", code: "NPGC" },
        { name: "NHPC", code: "NHPC" },
        { name: "NORTH KARANPURA", code: "NORTH KARANPURA" },
        { name: "TALCHER  SOLAR", code: "TALCHER  SOLAR" },
      ],
    },
    {
      type: "Inter-Regional",
      code: "interregional",
      entities: [
        { name: "NER", code: "NER" },
        { name: "SR", code: "SR" },
        { name: "NR", code: "NR" },
        { name: "WR", code: "WR" },
      ],
    },

    {
      type: "Other-Entity",
      code: "otherentity",
      entities: [
        { name: "ECR", code: "ECR" },
        { name: "GODA", code: "GODA" },
      ],
    },

    {
      type: "IPP",
      code: "ipp",
      name: "IPP",
    },
    {
      type: "TRANSNATIONAL",
      code: "transnational",
      name: "TRANSNATIONAL",
    },
    {
      type: "PGCIL",
      code: "pgcil",
      name: "PGCIL",
    },
    {
      type: "Others",
      code: "others",
      name: "Others",
    },
  ];

  const onFeederChange = (e) => {
    setSelectedFeeder(e.value);
    setXAxisData([]);
    setEnd1Data([]);
    setEnd2Data([]);
    setDiff([]);
    console.log(e.value);
  };
  const onPolarityChange = (e) => {
    setPolarity(e.value);
    console.log(e.value);
  };

  const onDataTypeChange = (e) => {
    setDataType(e.value);
    console.log(e.value);
  };

  const onStateChange = (e) => {
    console.log(stateWiseData);
    setSelectedEntity(e.value);
    setFeeders(stateWiseData[e.value.name]);
    setSelectedFeeder(stateWiseData[e.value.name][0]);
    setXAxisData([]);
    setEnd1Data([]);
    setEnd2Data([]);
    setDiff([]);
    console.log(e.value);
  };
  useEffect(() => {
    fetch("/fifteenmmdp/analyseData/" + meterIdParam)
      .then((res) => res.json())
      .then((result) => {
        setStateWiseData(result);
        console.log(result);
      });
  }, []);

  useEffect(() => {
    fetchGraphData();
  }, [dataType, polarity]);

  const fetchGraphData = () => {
    console.log(selectedFeeder);
    axios
      .post(
        "/fifteenmmdp/fetchGraphData/" +
          meterIdParam +
          "/" +
          selectedFeeder["End1"].trim() +
          "/" +
          selectedFeeder["End2"].trim() +
          "/" +
          polarity.multiplier +
          "/" +
          dataType.type
      )
      .then((response) => {
        console.log(response);
        setXAxisData(response.data.xAxisData);
        setEnd1Data(response.data.end1Data);
        setEnd2Data(response.data.end2Data);
        setDiff(response.data.diff);
        setDiffPercentage(response.data.diffPercentage);
        // window.location.reload();
      })
      .catch((error) => {});
  };
  return (
    <>
      <div className="p-col">
        <Fieldset legend="Analyse" toggleable>
          <div className="p-grid">
            <div className="p-col">
              <div className="dropdown-demo">
                <CascadeSelect
                  value={selectedEntity}
                  options={entities}
                  optionLabel={"name"}
                  optionGroupLabel={"type"}
                  optionGroupChildren={["entities"]}
                  style={{ minWidth: "14rem" }}
                  placeholder={"Select an Entity"}
                  onChange={onStateChange}
                />
              </div>
            </div>
            <div className="p-col">
              <div className="dropdown-demo">
                <Dropdown
                  value={selectedFeeder}
                  options={feeders}
                  onChange={onFeederChange}
                  optionLabel="Feeder Name"
                  filter
                  filterBy="Feeder Name"
                  placeholder="Select Feeder"
                />
              </div>{" "}
            </div>{" "}
            <div className="p-col">
              <div className="dropdown-demo">
                <Dropdown
                  value={polarity}
                  options={polarityArray}
                  onChange={onPolarityChange}
                  optionLabel="name"
                  placeholder="Select Polarity"
                />
              </div>{" "}
            </div>
            <div className="p-col">
              <div className="dropdown-demo">
                <Dropdown
                  value={dataType}
                  options={dataTypeArray}
                  onChange={onDataTypeChange}
                  optionLabel="name"
                  placeholder="Select Polarity"
                />
              </div>
            </div>
            <div className="p-col">
              <Button
                label="Fetch Data"
                className="p-button-rounded p-button-success"
                onClick={fetchGraphData}
              />

              {"  "}
              <a
                href={
                  proxyServer +
                  "/fifteenmmdp/fetchGraphDataExcel/" +
                  meterIdParam +
                  "/" +
                  selectedFeeder["End1"].trim() +
                  "/" +
                  selectedFeeder["End2"].trim() +
                  "/" +
                  polarity.multiplier +
                  "/" +
                  dataType.type
                }
              >
                <Button
                  icon="pi pi-file-excel"
                  className="p-button-rounded p-button-info p-button-outlined"
                />
              </a>
              {"  "}
              <a
                href={
                  proxyServer +
                  "/fifteenmmdp/fetchMeterChangeLog/" +
                  meterIdParam
                }
                target="_blank"
              >
                <Button
                  icon="pi pi-book"
                  className="p-button-rounded p-button-info p-button-outlined"
                />
              </a>
            </div>{" "}
            <div className="p-col">Work with graph </div>
          </div>
          {selectedEntity ? (
            <Plot
              data={[
                {
                  x: xAxisData,
                  y: end1Data,
                  type: "line",
                  // mode: "lines+markers",
                  // marker: { color: "red" },
                  name: selectedFeeder["End1"],
                },
                {
                  type: "line",
                  x: xAxisData,
                  y: end2data,
                  marker: { color: "red" },
                  name: selectedFeeder["End2"],
                },
                {
                  type: "line",
                  x: xAxisData,
                  y: diff,
                  marker: { color: "green" },
                  name: "Difference",
                  // visible: "legendonly",
                },
                {
                  type: "line",
                  x: xAxisData,
                  y: diffPercentage,
                  marker: { color: "purple" },
                  name: "Difference Percentage",
                  visible: "legendonly",
                },
              ]}
              layout={{
                width: 1500,
                height: 500,
                title: selectedFeeder["End1"] + " vs " + selectedFeeder["End2"],
              }}
            />
          ) : (
            <></>
          )}
          <Divider />
          {selectedFeeder["End1"] || selectedFeeder["End2"] ? (
            <ChangeMeterDataComponent
              meterId={meterIdParam}
              entity={selectedEntity["name"]}
              feederName={selectedFeeder["Feeder Name"]}
              end1={selectedFeeder["End1"].trim()}
              end2={selectedFeeder["End2"].trim()}
              fetchGraphDataAgain={fetchGraphData}
              dataToChange={dataType.type}
            />
          ) : (
            <></>
          )}
        </Fieldset>
      </div>{" "}
      <div className="p-col">
        {(selectedFeeder["End1"] || selectedFeeder["End2"]) &&
        dataType.type == "MWH Data" ? (
          <Fieldset legend="Component analysis" toggleable>
            <ComponentWiseAnalysis
              meterId={meterIdParam}
              end1={selectedFeeder["End1"].trim()}
              end2={selectedFeeder["End2"].trim()}
            />
          </Fieldset>
        ) : (
          <></>
        )}{" "}
      </div>
    </>
  );
}
