import React, { useState, useEffect } from "react";
import { Spin, Alert, Col, Card, Avatar, Row } from "antd";
import * as Cookie from "js-cookie";
import { getCurrentUser, getCurrentEventUser } from "./services";
import { Networking } from "../../helpers/request";
import { EventFieldsApi } from "../../helpers/request";
import { formatDataToString } from "../../helpers/utils";

const { Meta } = Card;

const ContactList = ({ eventId }) => {
  const [contactsList, setContactsList] = useState([]);
  const [messageService, setMessageService] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProperties, setUserProperties] = useState([]);



  useEffect(() => {
    const getuserContactList = async () => {
      let response = await getCurrentUser(Cookie.get("evius_token"));
      setCurrentUserId(response);
    };
    const getContactList = async () => {
      // Se consulta el id del usuario por el token

      getCurrentUser(Cookie.get("evius_token")).then(async (user) => {
        // Servicio que obtiene el eventUserId del usuario actual
        let eventUser = await getCurrentEventUser(eventId, user._id);

        // Servicio que trae los contactos
        Networking.getContactList(eventId, eventUser._id).then((result) => {
          if (typeof result == "object") setContactsList(result);
          if (typeof result == "string") setMessageService(result);
        });
      });
    };
    const getProperties = async () => {
      let properties = await EventFieldsApi.getAll(eventId)
      setUserProperties(properties)
    }
    getuserContactList();
    getContactList();
    getProperties();
  }, [eventId]);


  if (currentUserId)
    return currentUserId === "guestUser" ? (
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
        {contactsList.map((contact, key) => {

          const user = contact.properties ? contact.properties : contact.user
          return (
            <Row key={'contactlist' + key} justify="center">
              <Card
                extra={
                  (
                    (user.nodewhatsapp && user.nodewhatsapp !== null && user.nodewhatsapp.length === 10) ||
                    (user.nodecelular && user.nodecelular !== null && user.nodecelular.length === 10) ||
                    (user.numerodecelular && user.numerodecelular !== null && user.numerodecelular.length === 10)
                  ) && (
                    <a href={"https://api.whatsapp.com/send?phone=57" + (user.nodewhatsapp ? user.nodewhatsapp : user.nodecelular ? user.nodecelular : user.numerodecelular)} target="_blank" rel="noreferrer">
                      <span>Hola soy {user.names}, <br />Escribeme por WhatsApp</span>
                    </a>)}
                style={{ width: 500, marginTop: "2%", marginBottom: "2%", textAlign: "left" }}
                bordered={true}>
                <Meta
                  avatar={
                    <Avatar>
                      {user.names ? user.names.charAt(0).toUpperCase() : user.names}
                    </Avatar>
                  }
                  title={user.names ? user.names : "No registra Nombre"}
                  description={[(
                    <div key={'contact' + key}>
                      <br />

                      {
                        userProperties.map((property, key) => (

                          ((user[property.name] !== undefined) && (!property.visibleByAdmin)) && (
                            <div key={'contact-property' + key}>

                              {
                                <p><strong>{property.label}</strong>: {formatDataToString(user[property.name], property)}</p>
                              }
                            </div>
                          )
                        ))
                      }
                    </div>

                  )

                  ]}
                />
              </Card>
            </Row>
          )
        })}
      </div>
    ) : (
          <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
            <Card>{messageService}</Card>
          </Col>
        );

  return <Spin></Spin>;
};
export default ContactList