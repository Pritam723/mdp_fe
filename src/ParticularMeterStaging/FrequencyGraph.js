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

import Plot from "react-plotly.js";

export default function FrequencyGraph(props) {
  const [freqData, setFreqData] = useState(null);

  useEffect(() => {
    fetch("/fifteenmmdp/fetchFrequencyGraphData/" + props.meterId)
      .then((res) => res.json())
      .then((result) => {
        setFreqData(result["dataToSend"]);
        console.log(result);
      });
  }, []);

  return (
    <Plot
      data={freqData}
      layout={{
        width: 1500,
        height: 500,
        title: "Frequency analysis",
        // hovermode: "closest",
      }}
    />
  );
}
