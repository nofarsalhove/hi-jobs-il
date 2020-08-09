import React from "react";
import userService from "../../services/userService";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  const currentUser = userService.getCurrentUser();
  return (
    <Route
      {...rest}
      render={props => {
        if (!currentUser || (rest.recruiter && !currentUser.recruiter))
          return (
            <Redirect
              to={{
                pathname: "/user/log-in",
                state: { from: props.location }
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
