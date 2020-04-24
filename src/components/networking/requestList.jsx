import React, { Fragment, useState, useEffect } from "react";

import { Spin, Alert, Col, Divider, Card, List, Button, Avatar } from "antd";

import * as Cookie from "js-cookie";
import { Networking } from "../../helpers/request";
import { userRequest, getCurrentUserId, getCurrentEventUser } from "./services";

export default ({ eventId }) => {
  const [requestList, setRequestList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Funcion que obtiene la lista de solicitudes o invitaciones recibidas
  const getInvitationsList = async () => {
    // Se consulta el id del usuario por el token
    getCurrentUserId(Cookie.get("evius_token")).then(async (userId) => {
      // Se consulta la informacion del Id recibido en Firebase (EventUser)
      let response = await getCurrentEventUser(eventId, userId);

      Networking.getInvitationsReceived(eventId, response._id).then(({ data }) => {
        console.log("esta es la respuesta :", data);
        setCurrentUserId(userId);
        if (data) setRequestList(data);
      });
    });
  };

  // Funcion para aceptar o rechazar una invitacion o solicitud
  const sendResponseToInvitation = (userId, state) => {
    let data = { response: state ? "acepted" : "rejected" };
    Networking.acceptOrDeclineInvitation(eventId, userId, data)
      .then((result) => {
        console.log("Respuesta enviada :", result);
      })
      .catch((err) => {
        console.log("Hubo un problema :", err);
      });
  };

  useEffect(() => {
    getInvitationsList();
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
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
        <Card>
          <List
            dataSource={requestList}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                actions={[
                  <Button onClick={() => sendResponseToInvitation(item.id_user_requested, true)}>Aceptar</Button>,
                  <Button onClick={() => sendResponseToInvitation(item.id_user_requested, false)}>Rechazar</Button>,
                ]}>
                <List.Item.Meta
                  avatar={
                    <Avatar>
                      {item.id_user_requested ? item.id_user_requested.charAt(0).toUpperCase() : item.id_user_requested}
                    </Avatar>
                  }
                  title={item.id_user_requested}
                  style={{ textAlign: "left" }}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    ) : (
      <Divider>No tiene solicitudes actualmente</Divider>
    );

  return <Spin></Spin>;
};
