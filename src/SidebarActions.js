import React, { useState, useRef } from "react";
import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";
import "./cssFiles/StepsDemo.css";
import { useHistory } from "react-router-dom";

export default function StepsDemo() {
  let history = useHistory();
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useRef(null);
  const items = [
    {
      label: "Personal",
      command: (event) => {
        history.push("/meterFile/10");
        toast.current.show({
          severity: "info",
          summary: "First Step",
          detail: event.item.label,
        });
      },
    },
    {
      label: "Seat",
      command: (event) => {
        toast.current.show({
          severity: "info",
          summary: "Seat Selection",
          detail: event.item.label,
        });
      },
    },
    {
      label: "Seat",
      command: (event) => {
        toast.current.show({
          severity: "info",
          summary: "Seat Selection",
          detail: event.item.label,
        });
      },
    },
    {
      label: "Seat",
      command: (event) => {
        toast.current.show({
          severity: "info",
          summary: "Seat Selection",
          detail: event.item.label,
        });
      },
    },
    {
      label: "Seat",
      command: (event) => {
        toast.current.show({
          severity: "info",
          summary: "Seat Selection",
          detail: event.item.label,
        });
      },
    },
    {
      label: "Seat",
      command: (event) => {
        toast.current.show({
          severity: "info",
          summary: "Seat Selection",
          detail: event.item.label,
        });
      },
    },
    {
      label: "Seat",
      command: (event) => {
        toast.current.show({
          severity: "info",
          summary: "Seat Selection",
          detail: event.item.label,
        });
      },
    },
    {
      label: "Payment",
      command: (event) => {
        toast.current.show({
          severity: "info",
          summary: "Pay with CC",
          detail: event.item.label,
        });
      },
    },
    {
      label: "Confirmation",
      command: (event) => {
        toast.current.show({
          severity: "info",
          summary: "Last Step",
          detail: event.item.label,
        });
      },
    },
  ];

  return (
    <div className="steps-demo">
      <Toast ref={toast}></Toast>

      <div className="card">
        <h5>Interactive</h5>
        <Steps
          model={items}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
          readOnly={false}
        />
      </div>
    </div>
  );
}
