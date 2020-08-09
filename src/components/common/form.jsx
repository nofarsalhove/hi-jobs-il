import React, { Component } from "react";
import Input from "./input";
import Joi from "joi-browser";
import "../../sass/form.scss";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validateForm() {
    const options = { abortEarly: false };
    // checking all form's fields validity according to the schema
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    // mapping object
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  }

  handleSubmit = e => {
    e.preventDefault();
    // send to function that checking form validity according to the schema
    const errors = this.validateForm();
    //  if there are errors we update the errors in the state, else we update that there aren't errors
    this.setState({ errors: errors || {} });
    // if there are errors we do return since we don't want to send the user input data to the server
    if (errors) return;
    // else we call a function that send the user input data to the server
    this.doSubmit();
  };

  validateProperty({ name, value }) {
    //   creating an object with the input's field name and value
    const obj = { [name]: value };
    // getting the requirements of this field from the schema
    const schema = { [name]: this.schema[name] };
    // checking if there is a validate errors in the input according to the schema
    const { error } = Joi.validate(obj, schema);
    // if there is an error we return the error message, else we return null
    return error ? error.details[0].message : null;
  }

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    // send the input data to check validity
    const errorMessage = this.validateProperty(input);
    // if there is an error in the input field we update the errors object in the state
    if (errorMessage) errors[input.name] = errorMessage.replace(/"/g, "");
    // else if there isn't an error - we remove the field's error from the errors object in the state
    else delete errors[input.name];
    // and also update the data to be the input's value
    const data = { ...this.state.data };
    data[input.name] = input.value;
    // and save(update) the data and errors in the state
    this.setState({ data, errors });
  };

  //   function to create an input field in the form
  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  //   function to create the submit button in the form
  renderBtn(label) {
    return (
      <button
        disabled={this.validateForm()}
        type="submit"
        className="btn submit-btn mx-auto"
      >
        {label}
      </button>
    );
  }
}

export default Form;
