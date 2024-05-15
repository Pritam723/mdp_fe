import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import FileUploadDemo from "./FileUpload";
import FormLayoutDemo from "./FormLayoutDemo";
import AppWrapper from "./AppWrapper";
import DataTable from "./DataTable";
import TempSave from "./tempSave";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SidebarActions from "./SidebarActions";

ReactDOM.render(<AppWrapper />, document.getElementById("root"));
