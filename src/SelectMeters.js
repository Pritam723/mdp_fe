import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MultiSelect } from "primereact/multiselect";
import "./cssFiles/MultiSelectDemo.css";
import "./cssFiles/StepsDemo.css";

// export default function SelectMeters(props) {

// }

const SelectMeters = forwardRef((props, _ref) => {
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [meters, setMeters] = useState([]);
  useEffect(() => {
    fetch("/fifteenmmdp/getRealMetersListed/" + props.meterId)
      .then((res) => res.json())
      .then((result) => {
        console.log("Getting called");
        console.log(result);
        setMeters(result);
        // setSelectedMeters(result);
      });
  }, []);
  useImperativeHandle(_ref, () => ({
    getMeters: () => {
      return selectedMeters;
    },
  }));
  return (
    <div className="card">
      <h5>Select Real Meters</h5>
      <MultiSelect
        value={selectedMeters}
        options={meters}
        onChange={(e) => setSelectedMeters(e.value)}
        optionLabel="name"
        placeholder="Select Real Meters"
        maxSelectedLabels={1}
        filter={true}
        // virtualScrollerOptions={{ itemSize: 43 }}
      />
    </div>
  );
});
export default React.memo(SelectMeters);
