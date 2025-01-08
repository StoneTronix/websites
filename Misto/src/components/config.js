import { yourID } from "../api/authorization.js";

export const config = {
  baseUrl: "https://nomoreparties.co/v1/frontend-st-cohort-201",
  headers: {
      authorization: '',
      "Content-Type": "application/json"
  }
};

config.headers.authorization = yourID;
