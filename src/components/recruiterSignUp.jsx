import React from "react";
import Form from "./common/form";
import PageHeader from "./common/pageHeader";
import Joi from "joi-browser";
import httpService from "../services/httpService";
import { apiUrl } from "../config.json";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";

class RecruiterSignUp extends Form {
  state = {
    data: {
      name: "",
      email: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    name: Joi.string()
      .min(2)
      .required()
      .label("Name"),
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .min(6)
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    const data = { ...this.state.data };
    data.recruiter = true;

    try {
      // after we check if the recruiter's data is valid we send his data to the server to add him to DB
      await httpService.post(`${apiUrl}/users`, data);
      // we alse log him in
      await userService.login(data.email, data.password);
      // after we save his data in the DB we redirect him to the create post page
      window.location = "/create-post";
    } catch (ex) {
      //  if the recruiter chose an email that belong to other user
      if (ex.response && ex.response.status === 400) {
        this.setState({ errors: { email: "Email is taken" } });
      }
    }
  };

  render() {
    // if the user already connect and he try to access the login page via the URL,
    // we don't want that he do login another time
    // so if he's already connect we redirect him to the home page
    if (userService.getCurrentUser()) return <Redirect to="/" />;

    // else if the user isn't connected, we show him the registered form
    return (
      <div className="container">
        <PageHeader title="Recruiter's Sign Up" />
        <div className="row">
          <div className="col-12 text-center mt-3">
            <p>Sign up to Hi-JobsIL and publish a job position today!</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mx-auto">
            <form onSubmit={this.handleSubmit} method="POST" autoComplete="off">
              {this.renderInput("name", "Name")}
              {this.renderInput("email", "Email", "email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderBtn("Next")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RecruiterSignUp;
