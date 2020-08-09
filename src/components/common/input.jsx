import React from "react";
import "../../sass/input.scss";

const Input = ({ name, label, type, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {!(type === "textarea") && (
        <input
          {...rest}
          name={name}
          id={name}
          className="form-control"
          type={type}
        />
      )}
      {type === "textarea" && (
        <textarea
          className="form-control"
          {...rest}
          name={name}
          id={name}
          rows="3"
          rezise="off"
        ></textarea>
      )}
      {/* if there is an error - this message will shown up */}
      {error && <span className="text-danger">{error}</span>}
    </div>
  );
};

export default Input;
