import React from "react";

const PageHeader = ({ title }) => {
  return (
    <div className="row">
      <h1 className="col-12 mt-4 text-center display-3">{title}</h1>
    </div>
  );
};

export default PageHeader;
