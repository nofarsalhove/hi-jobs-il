import React from "react";
import Form from "./common/form";
import PageHeader from "./common/pageHeader";
import Joi from "joi-browser";
import postService from "../services/postService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class CreatePost extends Form {
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

  doSubmit = async () => {
    const data = { ...this.state.data };
    await postService.createPost(data);
    toast("A new post is created");
    this.props.history.replace("/my-posts");
  };

  render() {
    return (
      <div className="container">
        <PageHeader title="Create Post" />

        <div className="row">
          <div className="col-12 text-center mt-3">
            <p>Add a position job post now</p>
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
              {this.renderBtn("Create Post")}
              <Link className="btn btn-light ml-2" to="/my-posts">
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatePost;
