import http from "./httpService";
import { apiUrl } from "../config.json";

export function getAllPosts() {
  return http.get(`${apiUrl}/posts`);
}

export function deletePost(postId) {
  return http.delete(`${apiUrl}/posts/${postId}`);
}

export function getPost(postId) {
  return http.get(`${apiUrl}/posts/${postId}`);
}

export function editPost(post) {
  const postId = post._id;
  delete post._id;
  return http.put(`${apiUrl}/posts/${postId}`, post);
}

export function getMyPosts() {
  return http.get(`${apiUrl}/posts/my-posts`);
}

export function createPost(post) {
  return http.post(`${apiUrl}/posts`, post);
}

export default {
  createPost,
  getMyPosts,
  editPost,
  getPost,
  deletePost,
  getAllPosts
};
