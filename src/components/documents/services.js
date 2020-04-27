import React from "react";
import axios from "axios";
import { ApiUrl } from "../../helpers/constants";

export function getFiles(EventID) {
  return new Promise(async (resolve, reject) => {
    let response = "";
    await axios
      .get(`${ApiUrl}/api/events/${EventID}/getallfiles`)
      .then((docs) => {
        response = docs.data.data.length != 0 ? docs.data.data : false;
      })
      .catch((err) => {
        console.log(err);
      });
    resolve(response);
  });
}
