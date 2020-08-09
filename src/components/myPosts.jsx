import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import postService from "../services/postService";
import Post from "./common/post";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { swalConfirmDelete } from "../config.json";
import { toast } from "react-toastify";
import "../sass/my-posts.scss";
import "../sass/common.scss";

class MyPosts extends Component {
  state = {
    posts: [],
    showCV: false,
    isLoading: true
  };

  async componentDidMount() {
    const { data } = await postService.getMyPosts();
    if (data.length > 0) this.setState({ posts: data });

    setTimeout(() => {
      let isLoading = { ...this.state.isLoading };
      isLoading = false;
      this.setState({ isLoading });
    }, 1800);
  }

  deletePost = (e, postId, postTitle) => {
    e.preventDefault();

    Swal.fire(swalConfirmDelete).then(result => {
      if (result.value) this.handleDelete(postId, postTitle);
    });
  };

  async handleDelete(postId, postTitle) {
    let { posts } = this.state;
    posts = posts.filter(post => post._id !== postId);
    this.setState({ posts });
    await postService.deletePost(postId);
    toast(`${postTitle} post was deleted successfully`);
  }

  render() {
    const { posts, showCV, isLoading } = this.state;
    return (
      <div className="container">
        <PageHeader title="My Posts" />

        {isLoading && (
          <div className="row mt-5">
            <div className="spinner-grow text-secondary mx-auto" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {!isLoading && (
          <React.Fragment>
            <div className="row mt-5">
              <div className="col-11 col-lg-8 mx-auto px-0">
                <Link to="/create-post" className="btn create-btn btn-info">
                  <i className="fas fa-plus"></i> Create Post
                </Link>
              </div>
            </div>

            <div className="row mt-3">
              {posts.length > 0 &&
                posts.map((post, index) => (
                  <Post
                    key={post._id}
                    post={post}
                    index={index}
                    showCV={showCV}
                    deletePost={this.deletePost}
                  />
                ))}
              {!(posts.length > 0) && (
                <div className="col-12 text-center">
                  <p>You have not published any posts yet...</p>
                </div>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default MyPosts;
