import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MultiSelect } from "primereact/multiselect";
import "./cssFiles/MultiSelectDemo.css";
import "./cssFiles/StepsDemo.css";

// export default function SelectFictMeters(props) {

// }

const SelectFictMeters = forwardRef((props, _ref) => {
  const [selectedFictMeters, setSelectedFictMeters] = useState([]);
  const [fictMeters, setFictMeters] = useState([]);
  useEffect(() => {
    fetch("/fifteenmmdp/getFictMetersListed/" + props.meterId)
      .then((res) => res.json())
      .then((result) => {
        console.log("Fict getting called");
        console.log(result);
        setFictMeters(result);
        // setSelectedFictMeters(result);
      });
  }, []);
  useImperativeHandle(_ref, () => ({
    getFictMeters: () => {
      return selectedFictMeters;
    },
  }));
  return (
    <div className="card">
      <h5>Select Fictitious Meters</h5>
      <MultiSelect
        value={selectedFictMeters}
        options={fictMeters}
        onChange={(e) => setSelectedFictMeters(e.value)}
        optionLabel="name"
        placeholder="Select Fictitious Meters"
        maxSelectedLabels={1}
        filter={true}
      />
    </div>
  );
});
export default React.memo(SelectFictMeters);
