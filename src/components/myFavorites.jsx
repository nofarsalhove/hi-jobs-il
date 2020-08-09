import React, { Component } from "react";
import userService from "../services/userService";
import PageHeader from "./common/pageHeader";
import Post from "./common/post";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

class MyFavorites extends Component {
  state = {
    posts: [],
    showCV: true,
    favsIds: [],
    isLoading: true
  };

  async componentDidMount() {
    // getting all user's favorites posts from the server
    const posts = (await userService.getFavorites()).data;
    if (posts.length > 0) this.setState({ posts });
    // mapping the posts objects array to another array only with the posts ID's
    // this is will help us to send a requiest to server in a valid way after we update this array
    let favsIds = this.mappingFavsArray(posts);
    if (favsIds.length > 0) this.setState({ favsIds });

    setTimeout(() => {
      let isLoading = { ...this.state.isLoading };
      isLoading = false;
      this.setState({ isLoading });
    }, 1500);
  }

  mappingFavsArray(posts) {
    let favMapping = [];
    posts.forEach(post => {
      favMapping.push(post._id);
    });
    return favMapping;
  }

  handleFavorites = (postId, postTitle) => {
    let { favsIds } = this.state;
    // remove the post's ID from the favorites ID's array
    favsIds = favsIds.filter(favId => favId !== postId);
    this.setState({ favsIds });
    // update the user's favoruites in the DB
    this.removeFavoritePost(favsIds, postTitle);
  };

  async removeFavoritePost(favsIds, postTitle) {
    await userService.updateFavorites({ posts: favsIds });
    toast(`${postTitle} post was removed from the favorites successfully`);
  }

  checkIfAlreadyInFavs(postId, favsIds) {
    return favsIds.indexOf(postId) > -1 ? true : false;
  }

  render() {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) return <Redirect to="/user/log-in" />;
    if (currentUser && currentUser.recruiter) return <Redirect to="/" />;

    const { posts, showCV, isLoading } = this.state;
    return (
      <div className="container">
        <PageHeader title="My Favorites" />

        {isLoading && (
          <div className="row mt-5">
            <div className="spinner-grow text-secondary mx-auto" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="row mt-5">
            {posts.length > 0 &&
              posts.map((post, index) => (
                <Post
                  key={post._id}
                  post={post}
                  index={index}
                  showCV={showCV}
                  handleFavorites={this.handleFavorites}
                />
              ))}
            {!posts.length > 0 && (
              <div className="col-12 text-center">
                <p>You didn't add any post to your favorites yet...</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default MyFavorites;
