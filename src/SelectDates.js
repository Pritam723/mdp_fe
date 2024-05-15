import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MultiSelect } from "primereact/multiselect";
import "./cssFiles/MultiSelectDemo.css";
import "./cssFiles/StepsDemo.css";

// export default function SelectDates(props) {

// }

const SelectDates = forwardRef((props, _ref) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [dates, setDates] = useState([]);
  useEffect(() => {
    fetch("/fifteenmmdp/getAllDates/" + props.meterId)
      .then((res) => res.json())
      .then((result) => {
        console.log("Dates getting called");
        console.log(result);
        setDates(result);
        // setSelectedDates(result);
      });
  }, []);

  useImperativeHandle(_ref, () => ({
    getDates: () => {
      return selectedDates;
    },
  }));

  return (
    <div className="card">
      <h5>Select Dates</h5>
      <MultiSelect
        value={selectedDates}
        options={dates}
        onChange={(e) => setSelectedDates(e.value)}
        optionLabel="name"
        placeholder="Select Dates"
        maxSelectedLabels={1}
        filter={true}
      />
    </div>
  );
});

export default React.memo(SelectDates);
