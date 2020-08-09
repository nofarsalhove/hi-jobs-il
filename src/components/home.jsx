import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import postService from "../services/postService";
import Post from "./common/post";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { swalConfirmDelete } from "../config.json";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";

class Home extends Component {
  state = {
    posts: [],
    showCV: true,
    favs: [],
    isLoading: true
  };

  allPostsBackUp = [];

  async componentDidMount() {
    const posts = (await postService.getAllPosts()).data;
    if (posts.length > 0) this.setState({ posts });
    this.allPostsBackUp = await posts;
    let favs = (await userService.getFavorites()).data;
    favs = this.mappingFavsArray(favs);
    if (favs.length > 0) this.setState({ favs });

    setTimeout(() => {
      let isLoading = { ...this.state.isLoading };
      isLoading = false;
      this.setState({ isLoading });
    }, 1500);
  }

  mappingFavsArray(favorites) {
    let favMapping = [];
    favorites.forEach(post => {
      favMapping.push(post._id);
    });
    return favMapping;
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

  handleFavorites = (postId, postTitle) => {
    let { favs } = this.state;
    let msgText = "";
    if (!this.checkIfAlreadyInFavs(postId, favs)) {
      favs.push(postId);
      this.setState({ favs });
      msgText = `${postTitle} post was added to favorites successfully`;
    } else {
      favs = favs.filter(favId => favId !== postId);
      this.setState({ favs });
      msgText = `${postTitle} post was removed from the favorites successfully`;
    }
    this.updateFavoritesPosts(favs, msgText);
  };

  async updateFavoritesPosts(favs, msgText) {
    await userService.updateFavorites({ posts: favs });
    toast(msgText);
  }

  checkIfAlreadyInFavs(postId, favs) {
    return favs.indexOf(postId) > -1 ? true : false;
  }

  handleSearch = ({ value }) => {
    let postToFilter = this.allPostsBackUp;
    if (value === "") {
      this.setState({ posts: this.allPostsBackUp });
    } else {
      const postsThatMatch = postToFilter.filter(post =>
        post.category.toUpperCase().includes(value.toUpperCase())
      );
      this.setState({ posts: postsThatMatch });
    }
  };

  render() {
    if (!userService.getCurrentUser()) return <Redirect to="/user/log-in" />;

    const { posts, showCV, isLoading } = this.state;
    return (
      <div className="container">
        <PageHeader title="Hi-JobsIL" />
        <div className="row">
          <div className="col-12 text-center mt-3">
            <p>
              Hi-JobsIL anables you to publish and search for Hi-Tech positions.
            </p>
          </div>
        </div>

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
              <div className="col-lg-8 mx-auto">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search by category.."
                  onInput={e => this.handleSearch(e.target)}
                />
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
                    handleFavorites={this.handleFavorites}
                  />
                ))}

              {!posts.length > 0 && (
                <div className="col-12 text-center">
                  <p>No posts were found...</p>
                </div>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Home;
