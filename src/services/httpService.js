import axios from "axios";
import { toast } from "react-toastify";
import userService from "./userService";

// this line add to every user's request his token in the request header ander the property x-auth-token
axios.defaults.headers.common["x-auth-token"] = userService.getJwt();

// axios function that is called in any time that we get an error
// and if this is an error of type 403 or 404 a message pop up to the user
axios.interceptors.response.use(null, error => {
  const expectedError = error.response && error.response.status >= 403;
  if (expectedError) toast.error("An unexpected error occurred");
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete
};
