import React, { useState, useEffect } from 'react';
import { Spin, Alert, Col, Card, Avatar, Row, Button } from 'antd';
import { Networking } from '../../helpers/request';
import { EventFieldsApi } from '../../helpers/request';
import { formatDataToString } from '../../helpers/utils';

//context
import { UseUserEvent } from '../../Context/eventUserContext';
import { UseEventContext } from '../../Context/eventContext';
import { UseCurrentUser } from '../../Context/userContext';

const { Meta } = Card;

const ContactList = ({ tabActive }) => {
  const [contactsList, setContactsList] = useState([]);
  const [messageService, setMessageService] = useState('');
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(false);
 console.log("TAB ACTIVE==>"+tabActive)
  //contextos
  let userEventContext = UseUserEvent();
  let eventContext = UseEventContext();
  let userCurrentContext = UseCurrentUser();

  useEffect(() => {
    setLoading(true);

    const getContactList = async () => {
      // Servicio que trae los contactos
      Networking.getContactList(eventContext.value._id, userEventContext.value._id).then((result) => {
        if (typeof result == 'object') {
          setContactsList(result);
        }
        if (typeof result == 'string') setMessageService(result);             
        setLoading(false);
      });
    };
    const getProperties = async () => {
      let properties = await EventFieldsApi.getAll(eventContext.value._id);     
      setUserProperties(properties);
    };

    if (tabActive === 'mis-contactos') {
      getProperties();
      // getuserContactList();
      getContactList();
    }
  }, [eventContext.value._id, tabActive]);

  if (userCurrentContext.value._id && !loading)
    return userCurrentContext.value._id === 'guestUser' ? (
      <Col xs={22} sm={22} md={15} lg={15} xl={15} style={{ margin: '0 auto' }}>
        <Alert
          message='Iniciar Sesión'
          description='Para poder ver contactos es necesario iniciar sesión.'
          type='info'
          showIcon
        />
      </Col>
    ) : contactsList.length > 0 && !loading ? (
      <div>
        {contactsList.map((contact, key) => {
          const user = contact.properties ? contact.properties : contact.user;
          return (
            <Row key={'contactlist' + key} justify='center'>
              <Card
                extra={
                  ((user.telefono && user.telefono !== null && user.telefono.length === 10) ||
                    (user.nodewhatsapp && user.nodewhatsapp !== null && user.nodewhatsapp.length === 10) ||
                    (user.nodecelular && user.nodecelular !== null && user.nodecelular.length === 10) ||
                    (user.numerodecelular && user.numerodecelular !== null && user.numerodecelular.length === 10)) && (
                    <a
                      href={
                        'https://api.whatsapp.com/send?phone=57' +
                        (user.nodewhatsapp
                          ? user.nodewhatsapp
                          : user.nodecelular
                          ? user.nodecelular
                          : user.numerodecelular
                          ? user.numerodecelular
                          : user.telefono)
                      }
                      target='_blank'
                      rel='noreferrer'>
                      <span>
                        Hola soy {user.names}, <br />
                        Escribeme por WhatsApp
                      </span>
                    </a>
                  )
                }
                style={{ width: 500, marginTop: '2%', marginBottom: '2%', textAlign: 'left' }}
                bordered={true}>
                <Meta
                  avatar={<Avatar>{user.names ? user.names.charAt(0).toUpperCase() : user.names}</Avatar>}
                  title={user.names ? user.names : 'No registra Nombre'}
                  description={[
                    <div key={'contact' + key}>
                      <br />

                      {userProperties.map(
                        (property, key) =>
                          user[property.name] !== undefined &&
                          !property.visibleByAdmin &&
                          (property.visibleByContacts || property.visibleByContacts == 'only_for_my_contacts') && (
                            <div key={'contact-property' + key}>
                              {
                                <p>
                                  <strong>{property.label}</strong>: {formatDataToString(user[property.name], property)}
                                </p>
                              }
                            </div>
                          )
                      )}
                    </div>
                  ]}
                />
                <Col xs={24}>
                  <Button
                    block
                    size='large'
                    style={{ backgroundColor: '#363636', color: 'white' }}
                    onClick={() => null/*agendarCita(contact._id, contact)*/}>
                    {'Agendar cita'}
                  </Button>
                </Col>
              </Card>
            </Row>
          );
        })}
      </div>
    ) : (
      contactsList.length == 0 &&
      !loading && (
        <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: '0 auto' }}>
          <Card style={{textAlign:'center'}} >{messageService}</Card>
        </Col>
      )
    );
  if (!userCurrentContext._id || loading) return <Spin></Spin>;
};
export default ContactList;
