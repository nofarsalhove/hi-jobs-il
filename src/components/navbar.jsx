import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "../sass/navbar.scss";

class Navbar extends Component {
  state = {};

  render() {
    const { user } = this.props;
    return (
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ background: "#7a9694" }}
      >
        <Link className="navbar-brand" to="/">
          Hi-Jobs<i className="fas fa-laptop-code fa-lg"></i>IL
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {user && user.recruiter && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-posts">
                  My Posts
                </NavLink>
              </li>
            )}
            {user && !user.recruiter && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-favorites">
                  My Favorites
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ml-auto">
            {!user && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/user/sign-up">
                    Sign up
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/user/log-in">
                    Log in
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/user/recruiter-sign-up">
                    Recruiter
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/user/log-out">
                  Log out
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
