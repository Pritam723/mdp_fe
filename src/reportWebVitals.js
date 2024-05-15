const TagDemo = () => {
  return (
    <div>
      <div className="card">
        <h5>Tags</h5>
        <Tag className="p-mr-2" value="Primary"></Tag>
        <Tag className="p-mr-2" severity="success" value="Success"></Tag>
        <Tag className="p-mr-2" severity="info" value="Info"></Tag>
        <Tag className="p-mr-2" severity="warning" value="Warning"></Tag>
        <Tag severity="danger" value="Danger"></Tag>
      </div>
    </div>
  );
};

// const statusBodyTemplate = (rowData) => {
//   return (
//     <span className={`product-badge status-instock`}>
//       {rowData.inventoryStatus}
//     </span>
//   );
// };
