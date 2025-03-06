import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/";

const Api = axios.create({
  baseURL: API_URL,
});

export default Api;
