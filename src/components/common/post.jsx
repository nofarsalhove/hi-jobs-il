import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../sass/post.scss";
import userService from "../../services/userService";
import ReactTooltip from "react-tooltip";

class Post extends Component {
  state = {
    isUp: false
    // isAddedToFavs: false
  };

  // this function converts the date string that we received from mongoDB to Date
  // and return a Date format dd/mm/yyyy
  convertToDate(strDate) {
    Date.parse(strDate); //parsing the string to milliseconds (unix time)
    const date = new Date(strDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  //this function checks if the user is a recruiter and if the user's id of the post is the same id of the current user that connect to the system - this help us to let the recruiter delete only his posts from the home page
  checkRecruiter() {
    const { post } = this.props;
    const user = userService.getCurrentUser();
    return post.user_id._id === user._id ? true : false;
  }

  rotateArrow = () => {
    let { isUp } = this.state;
    isUp = isUp ? false : true;
    this.setState({ isUp });
  };

  render() {
    const { post, index, showCV, deletePost, handleFavorites } = this.props;
    const user = userService.getCurrentUser();
    const { isUp } = this.state;

    return (
      <div className="post col-11 col-lg-8 mx-auto my-3">
        <ReactTooltip />
        <div className="pt-2">
          {this.checkRecruiter() && (
            <React.Fragment>
              <Link
                data-tip="Edit Post"
                className="mr-2"
                to={`/my-posts/edit/${post._id}`}
              >
                <i className="fas fa-edit"></i>
              </Link>
              <Link
                data-tip="Delete post"
                className="text-danger"
                to=""
                onClick={e => deletePost(e, post._id, post.title)}
              >
                <i className="far fa-trash-alt"></i>
              </Link>
            </React.Fragment>
          )}
          {!user.recruiter && (
            <Link to="" onClick={() => handleFavorites(post._id, post.title)}>
              <i className="far fa-heart" data-tip="Add/Remove Favorite"></i>
            </Link>
          )}
          <button
            className="load-more btn position-absolute"
            type="button"
            data-toggle="collapse"
            data-target={`#collapseExample${index}`}
            aria-expanded="false"
            aria-controls={`collapseExample${index}`}
            onClick={this.rotateArrow}
            data-tip="Read More"
          >
            <i
              className={
                isUp
                  ? "fas fa-arrow-circle-down rotate-arrow fa-lg"
                  : "fas fa-arrow-circle-down fa-lg"
              }
            ></i>
          </button>
          <h2 className="text-center">{post.title}</h2>
          <div className="text-center">{post.company}</div>
          <div className="description card card-body border-0 ">
            <h4>Positon Description</h4>
            <p className="mb-0">{post.jobDescription}</p>
          </div>
        </div>
        <div className="collapse" id={`collapseExample${index}`}>
          <div className="card card-body border-0 py-0">
            <h4>Positon Requirements</h4>
            <p>{post.jobRequirements}</p>
            <h4>Category</h4>
            <p>{post.category}</p>
            <div className="row p-3">
              <p className="mb-0">
                Publish date: {this.convertToDate(post.createdAt)}
              </p>
              <p className="d-flex ml-auto mb-0">
                Published by: {post.user_id.name}
              </p>
            </div>
            {showCV && !user.recruiter && (
              <button className="send-cv btn text-white mb-3" disabled>
                Send CV
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
