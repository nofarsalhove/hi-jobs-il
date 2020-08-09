import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./components/home";
import SignUp from "./components/signUp";
import Login from "./components/login";
import userService from "./services/userService";
import Logout from "./components/logout";
import RecruiterSignUp from "./components/recruiterSignUp";
import CreatePost from "./components/createPost";
import ProtectedRoute from "./components/common/protectedRoute";
import MyPosts from "./components/myPosts";
import EditPost from "./components/editPost";
import MyFavorites from "./components/myFavorites";

class App extends Component {
  state = {};

  componentDidMount() {
    // the variable user contain the user details from the token
    // and this way we know if the user is connected
    const user = userService.getCurrentUser();
    // save the user in the state
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <header>
          <ToastContainer />
          <Navbar user={user} />
        </header>

        <main style={{ minHeight: 900 }}>
          <Switch>
            <ProtectedRoute
              path="/my-posts/edit/:id"
              component={EditPost}
              recruiter={true}
            />
            <ProtectedRoute
              path="/my-posts"
              component={MyPosts}
              recruiter={true}
            />
            <ProtectedRoute
              path="/create-post"
              component={CreatePost}
              recruiter={true}
            />
            <Route path="/my-favorites" component={MyFavorites} />
            <Route path="/user/recruiter-sign-up" component={RecruiterSignUp} />
            <Route path="/user/log-out" component={Logout} />
            <Route path="/user/log-in" component={Login} />
            <Route path="/user/sign-up" component={SignUp} />
            <Route path="/" exact component={Home} />
          </Switch>
        </main>

        <footer>
          <Footer />
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
