import React from "react";
import PageHeader from "./common/pageHeader";
import Form from "./common/form";
import Joi from "joi-browser";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";

class Login extends Form {
  state = {
    data: {
      email: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    email: Joi.string()
      .email()
      .required()
      .label("Email"),
    password: Joi.string()
      .min(6)
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    const { email, password } = this.state.data;
    try {
      // after checking user's data authentication
      // we check if the email and password are corect according to his that in the DB
      // and if corect we save his token is the localStorage and enter him in
      await userService.login(email, password);
      // after login we redirect him to the home page
      window.location = "/";
    } catch (ex) {
      // if his email is wrong
      if (ex.response && ex.response.status === 400) {
        this.setState({ errors: { email: ex.response.data } });
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
        <PageHeader title="Login" />
        <div className="row">
          <div className="col-12 text-center mt-3">
            <p>Login to your Hi-JobsIL account</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 mx-auto">
            <form onSubmit={this.handleSubmit} methos="POST" autoComplete="off">
              {this.renderInput("email", "Email", "email")}
              {this.renderInput("password", "Password", "password")}
              {this.renderBtn("Log in")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
