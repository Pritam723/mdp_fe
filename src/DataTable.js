import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "./cssFiles/DataTableDemo.css";
import ReactDOM from "react-dom";
import { Tag } from "primereact/tag";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useHistory } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import "primeflex/primeflex.css";
import moment from "moment";
// import "./DataTableDemo.css";
import proxyServer from "./GlobalVars";
import LoadingOverlay from "react-loading-overlay-ts";
// import { SelectButton } from "primereact/selectbutton";
import { MultiSelect } from "primereact/multiselect";

export default function DataTableCrudDemo() {
  let emptyMeter = {
    model: "fifteenmmdp.allmeterfiles",
    pk: null,
    fields: {
      year: "",
      month: "",
      zippedMeterFile: null,
      status: null,
      startDate: null,
      endDate: null,
    },
  };

  const [meters, setMeters] = useState(null);
  const [meter, setMeter] = useState(emptyMeter);
  const [meterDialog, setMeterDialog] = useState(false);
  const [selectedMeters, setSelectedMeters] = useState(null);
  const [deleteMeterDialog, setDeleteMeterDialog] = useState(false);
  const [pushMeterDialog, setPushMeterDialog] = useState(false);
  const [deleteMetersDialog, setDeleteMetersDialog] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const toast = useRef(null);
  const dt = useRef(null);
  let history = useHistory();

  useEffect(() => {
    fetch("/fifteenmmdp/getAllMeterData")
      .then((res) => res.json())
      .then((result) => {
        setMeters(result);
        console.log(result);
      });
  }, []);

  const months = [
    { month: "January", value: "January" },
    { month: "February", value: "February" },
    { month: "March", value: "March" },
    { month: "April", value: "April" },
    { month: "May", value: "May" },
  ];

  const getDatesForThisProcess = (meter_pk) => {
    fetch("/fifteenmmdp/getAllDates/" + meter_pk)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setDates(result);
      });
  };

  const openNew = () => {
    setMeter(emptyMeter);
    setSubmitted(false);
    setMeterDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setMeterDialog(false);
  };

  const hideDeleteMeterDialog = () => {
    setDeleteMeterDialog(false);
  };

  const hidePushMeterDialog = () => {
    setPushMeterDialog(false);
    setDates([]);
    setSelectedDates([]);
  };

  const hideDeleteMetersDialog = () => {
    setDeleteMetersDialog(false);
  };

  const workWithMeterData = (rowData) => {
    return (
      <Button
        label="Work with Meter Data"
        className="p-button-rounded p-button-secondary"
        onClick={() => history.push("/meterFile/" + rowData.pk)}
      />
    );
  };

  const downloadTemplate = (rowData) => {
    return (
      <>
        <a
          href={
            proxyServer + "/fifteenmmdp/media/" + rowData.fields.zippedMeterFile
          }
          download={"/fifteenmmdp/media/" + rowData.fields.zippedMeterFile}
        >
          {rowData.fields.zippedMeterFile
            ? rowData.fields.zippedMeterFile.split("/").slice(-1).pop()
            : null}
        </a>
        <br />
        <br />
        <TagDemo status={rowData.fields.status} />
      </>
    );
  };

  const dateRangeTemplate = (rowData) => {
    return (
      <>
        {moment(rowData.fields.startDate).format("DD/MM/YYYY") +
          " To " +
          moment(rowData.fields.endDate).format("DD/MM/YYYY")}
      </>
    );
  };

  const saveMeter = () => {
    setSubmitted(true);
    if (
      meter.fields.year.trim() != "" &&
      meter.fields.month.trim() != "" &&
      meter.fields.zippedMeterFile &&
      meter.fields.startDate &&
      meter.fields.endDate
    ) {
      // let _meters = [...meters]; // Fetching already existing meters. Because we will use it for both edit & creation
      // let _meter = { ...meter };

      const uploadData = new FormData();
      uploadData.append("year", meter.fields.year);
      uploadData.append("month", meter.fields.month);
      uploadData.append("startDate", meter.fields.startDate);
      uploadData.append("endDate", meter.fields.endDate);

      uploadData.append(
        "meterZippedFile",
        meter.fields.zippedMeterFile,
        meter.fields.zippedMeterFile.name
      );
      console.log(uploadData);

      if (
        moment(meter.fields.startDate, "DD/MM/YYYY") >=
        moment(meter.fields.endDate, "DD/MM/YYYY")
      ) {
        toast.current.show({
          severity: "error",
          summary: "Fix Start Date/End Date",
          detail: "Start Date can't be greater than End Date",
          life: 3000,
        });
        return;
      }

      axios
        .post("/fifteenmmdp/addNewMeterFile/", uploadData)
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Server Error",
            detail: "Data can not be added",
            life: 3000,
          });
          console.log(error);
        });

      setMeterDialog(false);
      setMeter(emptyMeter);
    }
  };

  const editMeter = (meter) => {
    setMeter({ ...meter }); // meter object spread
    setMeterDialog(true);
  };

  //   const editProduct = (product) => {
  //     setProduct({ ...product }); // product object spread
  //     setProductDialog(true);
  //   };
  const confirmDeleteMeter = (meter) => {
    setMeter(meter);
    setDeleteMeterDialog(true);
  };

  const confirmPush = (meter) => {
    setMeter(meter);
    setPushMeterDialog(true);
    getDatesForThisProcess(meter.pk);
    console.log(meter.pk);
  };

  const deleteProduct = () => {
    fetch("/fifteenmmdp/deleteNewMeterFile/" + meter.pk)
      .then((res) => {
        console.log(res);
        let _meters = meters.filter((val) => val.pk !== meter.pk);
        setMeters(_meters);
        setDeleteMeterDialog(false);
        setMeter(emptyMeter);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Meter Deleted",
          life: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.current.show({
          severity: "danger",
          summary: "Unsuccessful",
          detail: "Some error occured",
          life: 3000,
        });
      });
  };

  const pushWeeklyData = () => {
    if (selectedDates.length == 0) {
      console.log("Data not pushed");
      setPushMeterDialog(false);
      toast.current.show({
        severity: "warn",
        summary: "Unsuccessful",
        detail: "No date selected",
        life: 3000,
      });
      return;
    }
    console.log("Pushing data");
    setPushMeterDialog(false);
    setIsPushing(true);
    fetch("/fifteenmmdp/pushWeeklyMeterDataToArchive/" + meter.pk, {
      method: "POST",
      body: JSON.stringify(selectedDates),
    })
      .then((res) => {
        console.log(res);
        setMeter(emptyMeter);
        setIsPushing(false);
        if (res.status == 506) {
          toast.current.show({
            severity: "error",
            summary: "Unsuccessful",
            detail:
              "Data can only be pushed after Fictitious Meter Calculation is Done",
            life: 3000,
          });
        } else if (res.status == 200) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Meter Data Pushed Successfully",
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: "error",
            summary: "Unsuccessful",
            detail: "Some error occured. Please contact developer",
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.log("Here");
        setIsPushing(false);
        toast.current.show({
          severity: "danger",
          summary: "Unsuccessful",
          detail: "Some error occured",
          life: 3000,
        });
      });
  };

  // const findIndexById = (id) => {
  //   let index = -1;
  //   for (let i = 0; i < meters.length; i++) {
  //     if (meters[i].pk === id) {
  //       index = i;
  //       break;
  //     }
  //   }

  //   return index;
  // };

  // const confirmDeleteSelected = () => {
  //   setDeleteMetersDialog(true);
  // };

  const deleteSelectedProducts = () => {
    let _meters = meters.filter((val) => !selectedMeters.includes(val));
    setMeters(_meters);
    setDeleteMetersDialog(false);
    setSelectedMeters(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _meter = { ...meter };
    _meter["fields"][`${name}`] = val;

    setMeter(_meter);
  };

  const onFileChange = (e, name) => {
    console.log("fine");
    // const val = e.value || 0;
    let _meter = { ...meter };
    // _meter[`${name}`] = val;
    _meter.fields.zippedMeterFile = e.target.files[0];

    setMeter(_meter);
  };
  const onDateChange = (e, name) => {
    console.log(name);
    console.log(moment(e.value).format("DD-MM-YYYY"));

    let _meter = { ...meter };
    _meter["fields"][`${name}`] = moment(e.value).format("DD-MM-YYYY");
    setMeter(_meter);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New Task"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={openNew}
        />
        {/* <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedMeters || !selectedMeters.length}
        /> */}
      </React.Fragment>
    );
  };

  const TagDemo = (props) => {
    return (
      <div>
        <div className="card">
          <Tag className="p-mr-2" severity="Primary" value={props.status}></Tag>
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteMeter(rowData)}
        />{" "}
        <b>Delete Meter Data</b>
      </React.Fragment>
    );
  };

  const pushDataTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="8"
          // fill="var(--surface-ground)"
          animationDuration=".5s"
        /> */}
        <Button
          icon="pi pi-angle-double-right"
          className="p-button-rounded p-button-info"
          onClick={() => confirmPush(rowData)}
        />{" "}
        <br />
        <b>
          Push Meter Data (From: {rowData.fields.startDate} To:{" "}
          {rowData.fields.endDate}) <br />
          (Daterange in yyyy-mm-dd Format)
        </b>
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Manage Meter Files</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const meterDialogFooter = (
    <React.Fragment>
      <Button
        label="Discard Changes"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save Meter Data"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => saveMeter()}
      />
    </React.Fragment>
  );
  const deleteMeterDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMeterDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  const pushMeterDialogFooter = (
    <React.Fragment>
      Select dates{" "}
      <MultiSelect
        value={selectedDates}
        onChange={(e) => setSelectedDates(e.value)}
        options={dates}
        optionLabel="name"
        placeholder="Select Dates"
        maxSelectedLabels={1}
        className="w-full md:w-20rem"
      />
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hidePushMeterDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={pushWeeklyData}
      />
    </React.Fragment>
  );

  const deleteMetersDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMetersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <LoadingOverlay
      active={isPushing}
      spinner
      text={
        <div>
          Pushing Meter Data to Archival Application...
          <br />
          Check data in Archival Application after the process is complete.
        </div>
      }
    >
      <div className="datatable-crud-demo">
        <Toast ref={toast} />

        <div className="card">
          <Toolbar
            className="p-mb-4"
            left={leftToolbarTemplate}
            //   right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={meters}
            selection={selectedMeters}
            onSelectionChange={(e) => setSelectedMeters(e.value)}
            dataKey="pk"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Meter Data"
            globalFilter={globalFilter}
            header={header}
          >
            {/* <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column> */}
            <Column field="fields.year" header="Year" sortable></Column>
            <Column field="fields.month" header="Month" sortable></Column>
            <Column body={dateRangeTemplate} header="Date Range"></Column>
            <Column body={downloadTemplate} header="Meter Zip file"></Column>

            {/* <Column
            field="inventoryStatus"
            header="Status"
            body={TagDemo}
            sortable
          ></Column> */}

            <Column
              field="inventoryStatus"
              header="Process"
              body={workWithMeterData}
              // sortable
            ></Column>
            {/* <Column
            field="inventoryStatus"
            header="Process"
            body={processUploadedMeterData}
            sortable
          ></Column> */}

            <Column
              header="Delete Meter Data"
              body={actionBodyTemplate}
            ></Column>
            <Column header="Push To Archival" body={pushDataTemplate}></Column>
          </DataTable>
        </div>

        <Dialog
          visible={meterDialog}
          style={{ width: "450px" }}
          contentStyle={{ overflow: "visible" }}
          header="Add Meter Data"
          modal
          className="p-fluid"
          footer={meterDialogFooter}
          onHide={hideDialog} // The cross button at right
        >
          <div className="p-field">
            <label htmlFor="year" className="p-sr-only">
              Year
            </label>
            <InputText
              id="year"
              type="text"
              placeholder="Year"
              defaultValue={meter.fields.year}
              onChange={(e) => onInputChange(e, "year")}
              required
              // rows={5}
              // cols={10}
              // defaultValue={meter.fields.year}
            />
            {submitted && !meter.fields.year && (
              <small className="p-error">Year is required.</small>
            )}
          </div>

          <div className="p-field">
            <label htmlFor="month" className="p-sr-only">
              Month
            </label>
            <InputText
              id="month"
              type="text"
              placeholder="Month"
              defaultValue={meter.fields.month}
              onChange={(e) => onInputChange(e, "month")}
              required
            />
            {submitted && !meter.fields.month && (
              <small className="p-error">Month is required.</small>
            )}
          </div>

          <div className="p-field">
            <label htmlFor="startDate">Start Date</label>
            <Calendar
              id="startDate"
              dateFormat="dd/mm/yy"
              value={meter.fields.startDate}
              locale="en"
              onChange={(e) => {
                onDateChange(e, "startDate");
              }}
            ></Calendar>
            {submitted && !meter.fields.startDate && (
              <small className="p-error">Start Date is required.</small>
            )}
          </div>

          <div className="p-field">
            <label htmlFor="startDate">End Date</label>
            <Calendar
              id="endDate"
              dateFormat="dd/mm/yy"
              value={meter.fields.endDate}
              locale="en"
              onChange={(e) => {
                onDateChange(e, "endDate");
              }}
            ></Calendar>
            {submitted && !meter.fields.endDate && (
              <small className="p-error">End Date is required.</small>
            )}
          </div>

          <div className="p-field">
            <label htmlFor="zippedMeterFile" className="p-sr-only">
              Meter Zip File{" "}
            </label>
            <input
              id="zippedMeterFile"
              type="file"
              onChange={(e) => onFileChange(e, "zippedMeterFile")}
              required
              // rows={5}
              // cols={10}
              // defaultValue={meter.fields.year}
            />
            {submitted && !meter.fields.zippedMeterFile && (
              <small className="p-error">File is required.</small>
            )}
          </div>
          {/* // onChange={(evt) => setMeterZippedFile(evt.target.files[0])} */}

          {/* <div className="p-field">
          <label className="p-sr-only">Year</label>

          <InputText
            type="text"
            defaultValue={meter.fields.year}
            placeholder="Year"
            onChange={(evt) => setYear(evt.target.value)}
          />
          {submitted && !meter.name && (
            <small className="p-error">Name is required.</small>
          )}
        </div> */}

          {/* <div className="p-field">
          <label className="p-sr-only">Month</label>
          <InputText
            type="text"
            defaultValue={meter.fields.month}
            placeholder="Month"
            onChange={(evt) => setMonth(evt.target.value)}
          />
        </div> */}

          {/* <div className="p-field">
          <label className="p-sr-only">Meter Zip File </label>

          <input
            type="file"
            // defaultValue="fff"
            onChange={(evt) => setMeterZippedFile(evt.target.files[0])}
          />
        </div> */}
        </Dialog>

        <Dialog
          visible={deleteMeterDialog}
          style={{ width: "450px" }}
          header="Confirm Delete"
          modal
          footer={deleteMeterDialogFooter}
          onHide={hideDeleteMeterDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            {meter && (
              <span>
                Are you sure you want to delete{" "}
                <b>{meter.fields.zippedMeterFile}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={pushMeterDialog}
          style={{ width: "450px" }}
          header="Confirm Push"
          modal
          footer={pushMeterDialogFooter}
          onHide={hidePushMeterDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-arrow-circle-right p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            {meter && (
              <div>
                <span>
                  Are you sure you want to push? (This will overwrite data, if
                  already there)
                </span>
                <br />
              </div>
            )}
            {/* 
            <SelectButton
              value={selectedDates}
              options={dates}
              onChange={(e) => {
                console.log(e.value);
                setSelectedDates(e.value);
              }}
            /> */}
          </div>
        </Dialog>

        <Dialog
          visible={deleteMetersDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteMetersDialogFooter}
          onHide={hideDeleteMetersDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            {meter && (
              <span>
                Are you sure you want to delete the selected Meter Data?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </LoadingOverlay>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<DataTableCrudDemo />, rootElement);
