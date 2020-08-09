import React from "react";
import PageHeader from "./common/pageHeader";
import Form from "./common/form";
import Joi from "joi-browser";
import http from "../services/httpService";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";

class SignUp extends Form {
  state = {
    data: { name: "", email: "", password: "" },
    errors: {}
  };

  schema = {
    name: Joi.string()
      .required()
      .min(2)
      .label("Name"),
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .required()
      .min(6)
      .label("Password")
  };

  doSubmit = async () => {
    const data = { ...this.state.data };
    data.recruiter = false;

    try {
      // after we check if the user's data is valid we send his data to the server to add him to DB
      await http.post(`${apiUrl}/users`, data);
      // show a message accordingly
      toast("A new acoount is created");
      // after we save his data in the DB we redirect him to the login page
      this.props.history.replace("/user/log-in");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        this.setState({ errors: { email: "Email is taken" } });
      }
    }
  };

  render() {
    // if the user already connect and he try to access the sign up page via the URL,
    // we don't want that he do sign up another time
    // so if he's alread connect we redirect him to the home page
    if (userService.getCurrentUser()) return <Redirect to="/" />;

    // else if the user isn't connected, we show him the registered form
    return (
      <div className="container">
        <PageHeader title="Sign Up for Hi-JobsIL" />
        <div className="row">
          <div className="col-12 text-center mt-3">
            <p>Sign up to Hi-JobsIL and search for job positions today!</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 mx-auto">
            <form onSubmit={this.handleSubmit} method="POST" autoComplete="off">
              {this.renderInput("name", "Name")}
              {this.renderInput("email", "Email", "email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderBtn("Sign Up")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
