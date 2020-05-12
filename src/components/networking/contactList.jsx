import React, { Fragment, useState, useEffect } from "react";

import { Spin, Alert, Col, Divider, List, Card, Avatar, Row } from "antd";

import * as Cookie from "js-cookie";
import { userRequest, getCurrentUser, getCurrentEventUser } from "./services";
import { Networking } from "../../helpers/request";

const { Meta } = Card;

export default ({ eventId }) => {
  const [contactsList, setContactsList] = useState([]);
  const [messageService, setMessageService] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const getContactList = async () => {
    // Se consulta el id del usuario por el token

    getCurrentUser(Cookie.get("evius_token")).then(async (user) => {
      // Servicio que obtiene el eventUserId del usuario actual
      let eventUser = await getCurrentEventUser(eventId, user._id);

      // Servicio que trae los contactos
      Networking.getContactList(eventId, eventUser._id).then((result) => {
        console.log("response:", result);
        if (typeof result == "object") setContactsList(result);
        if (typeof result == "string") setMessageService(result);
      });
    });
  };

  const getuserContactList = async () => {
    let response = await getCurrentUser(Cookie.get("evius_token"));
    setCurrentUserId(response);
  };

  useEffect(() => {
    getuserContactList();
    getContactList();
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
    ) : contactsList.length > 0 ? (
      <div>
        {contactsList.map((user, key) => (
          <Row key={key} justify="center">
            <Card
              // extra={
              //   <a
              //     onClick={() => {
              //       console.log("Informacion del contacto");
              //     }}>
              //     Ver contacto
              //   </a>
              // }
              style={{ width: 500, marginTop: "2%", marginBottom: "2%", textAlign: "left" }}
              bordered={true}>
              <Meta
                avatar={
                  <Avatar>
                    {user.properties.names ? user.properties.names.charAt(0).toUpperCase() : user.properties.names}
                  </Avatar>
                }
                title={user.properties.names ? user.properties.names : "No registra Nombre"}
                description={[
                  <div>
                    <br />
                    <p>Rol: {user.properties.rol ? user.properties.rol : "No registra Cargo"}</p>
                    <p>Ciudad: {user.properties.city ? user.properties.city : "No registra Ciudad"}</p>
                    <p>Correo: {user.properties.email ? user.properties.email : "No registra Correo"}</p>
                    <p>Telefono: {user.properties.phone ? user.properties.phone : "No registra Telefono"}</p>
                  </div>,
                ]}
              />
            </Card>
          </Row>
        ))}
      </div>
    ) : (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
        <Card>{messageService}</Card>
      </Col>
    );

  return <Spin></Spin>;
};
