import React from "react";
import PageHeader from "./common/pageHeader";
import Form from "./common/form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import postService from "../services/postService";
import { toast } from "react-toastify";

class EditPost extends Form {
  state = {
    data: {
      title: "",
      company: "",
      jobDescription: "",
      jobRequirements: "",
      category: ""
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .min(2)
      .max(255)
      .required()
      .label("Title"),
    company: Joi.string()
      .min(2)
      .max(255)
      .required()
      .label("Company"),
    jobDescription: Joi.string()
      .min(2)
      .max(1024)
      .required()
      .label("Position Description"),
    jobRequirements: Joi.string()
      .min(2)
      .max(1024)
      .required()
      .label("Position Requirements"),
    category: Joi.string()
      .min(2)
      .max(255)
      .required()
      .label("Category")
  };

  async componentDidMount() {
    //   getting the post ID fron the URL
    const postId = this.props.match.params.id;
    // grtting the post's data from the server
    const { data } = await postService.getPost(postId);
    this.setState({ data: this.mapToViewModel(data) });
  }

  //   mapping the post object to be like this
  mapToViewModel(post) {
    return {
      _id: post._id,
      title: post.title,
      company: post.company,
      jobDescription: post.jobDescription,
      jobRequirements: post.jobRequirements,
      category: post.category
    };
  }

  doSubmit = async () => {
    const data = { ...this.state.data };
    await postService.editPost(data);
    toast(`${data.title} is updated successfully`);
    this.props.history.replace("/my-posts");
  };

  render() {
    return (
      <div className="container">
        <PageHeader title="Edit Post" />

        <div className="row">
          <div className="col-12 text-center mt-3">
            <p>Edit your own post</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mx-auto">
            <form onSubmit={this.handleSubmit} method="POST" autoComplete="off">
              {this.renderInput("title", "Title")}
              {this.renderInput("company", "Company")}
              {this.renderInput(
                "jobDescription",
                "Position Description",
                "textarea"
              )}
              {this.renderInput(
                "jobRequirements",
                "Position Requirements",
                "textarea"
              )}
              {this.renderInput("category", "Category")}
              {this.renderBtn("Update")}
              <Link to="/my-posts" className="btn btn-light ml-2">
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
