import http from "./httpService";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";

const tokenKey = "token";

export function getFavorites() {
  return http.get(`${apiUrl}/users/posts`);
}

export function updateFavorites(favs) {
  return http.patch(`${apiUrl}/users/posts`, favs);
}

// this function is creates since when the user send a request to the server to do some actions
// we must send the request with his token to check if the user is authorized
// for example if the user is recruiter, he able to add job post, delete, update
export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function logout() {
  // when the user logout we remove his token from the loclStorage
  // and that way we know that he isn't connect
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    // try to get the token from the localStorage (if the user is connected)
    const jwt = localStorage.getItem(tokenKey);
    // decoded the token and get the payload with the current user data (id and if his recruiter)
    return jwtDecode(jwt);
  } catch (ex) {
    //   if there is no token in the localStorage - if the user isn't connected
    return null;
  }
}

// this function that allow us to login the user to our system after authentication his email and password
export async function login(email, password) {
  //first we send the user email and password to the server and check if there is a user with this data - this user
  const { data } = await http.post(`${apiUrl}/auth`, { email, password });
  // if there is a user with the same data we get a token and save it in the localStorage
  localStorage.setItem(tokenKey, data.token);
}

export default {
  login,
  getCurrentUser,
  logout,
  getJwt,
  updateFavorites,
  getFavorites
};
