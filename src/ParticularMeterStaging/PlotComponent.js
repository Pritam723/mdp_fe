<div className="accordion-demo">
  <div className="card">
    <h5>Default</h5>
    <Accordion activeIndex={0}>
      <AccordionTab header="Header I">
        <div className="p-col">
          <div className="dropdown-demo">
            <CascadeSelect
              value={selectedState}
              options={states}
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
          <InputTextarea
            value={value1}
            placeholder="Put equation to replace with."
            onChange={(e) => setValue1(e.target.value)}
            style={{ height: "40px", width: "300px" }}
            rows={1}
            cols={20}
          />{" "}
        </div>
        <div className="p-col">
          <Button
            label="Make changes"
            className="p-button-rounded p-button-success"
            onClick={console.log("Change")}
          />
        </div>{" "}
      </AccordionTab>
    </Accordion>
  </div>
</div>;
