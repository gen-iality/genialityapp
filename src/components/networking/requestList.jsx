import React, { Fragment, useState, useEffect } from "react";

import { Spin, Alert, Col, Divider } from "antd";

import * as Cookie from "js-cookie";
import { userRequest, getCurrentUserId } from "./services";

export default ({ eventId }) => {
  const [requestList, setRequestList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getUserRequestList = async () => {
    let userId = await getCurrentUserId(Cookie.get("evius_token"));

    userRequest
      .getUserRequestList(eventId, userId)
      .then((list) => {
        console.log("esta es la respuesta :", list);
        setCurrentUserId(userId);
        if (list) setRequestList(list);
      })
      .catch((err) => {
        console.log("Hubo un problema:", err);
      });
  };

  useEffect(() => {
    getUserRequestList();
  }, [eventId]);

  if (currentUserId)
    return currentUserId == "guestUser" ? (
      <Col xs={22} sm={22} md={15} lg={15} xl={15} style={{ margin: "0 auto" }}>
        <Alert
          message="Iniciar Sesión"
          description="Para poder ver contactos es necesario iniciar sesión."
          type="info"
          showIcon
        />
      </Col>
    ) : requestList.length > 0 ? (
      <Divider>Aqui se cargara la lista</Divider>
    ) : (
      <Divider>No tiene solicitudes actualmente</Divider>
    );

  return <Spin></Spin>;
};
