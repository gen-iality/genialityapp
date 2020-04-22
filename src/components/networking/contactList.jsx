import React, { Fragment, useState, useEffect } from "react";

import { Spin } from "antd";

import * as Cookie from "js-cookie";
import { userRequest, getCurrentUserId } from "./services";

export default ({ eventId }) => {
  const [contactsList, setContactsList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getuserContactList = async () => {
    let response = await getCurrentUserId(Cookie.get("evius_token"));

    userRequest
      .getUserRequestList(eventId, response)
      .then((requestList) => {
        console.log("esta es la respuesta :", requestList);
        setCurrentUserId(response);
        if (!requestList) setContactsList([]);
      })
      .catch((err) => {
        console.log("Hubo un problema:", err);
      });
  };

  useEffect(() => {
    getuserContactList();
  }, [eventId]);

  if (currentUserId)
    return currentUserId == "guestUser" ? (
      <h1>No es posible mostrar tus contactos</h1>
    ) : contactsList.length > 0 ? (
      <h1>Aqui se cargara la lista</h1>
    ) : (
      <h1>No tiene solicitudes actualmente</h1>
    );

  return <Spin></Spin>;
};
