import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Row, Space, Image, Card, Col, message } from 'antd';
import { getUserEventbyEmail, getUserEvent } from 'components/networking/services';
import { UsersApi, EventFieldsApi, EventsApi } from 'helpers/request';
import React, { useEffect, useState } from 'react';

export const AdminUsers = () => {
  const [showModal, setshowModal] = useState(false);
  const [consulta, setconsulta] = useState({
    email: '',
    event: '',
  });
  const [resultSearch, setresultSearch] = useState(null);

  const HandleSearch = () => {
    if (consulta.email !== '' && consulta.event !== '') {
      getUserEventbyEmail(consulta.event, consulta.email).then((res) => {
        console.log(res[0]._id);
        EventsApi.getEventUser(res[0]._id, consulta.event).then((user) => {
          setresultSearch(user);
          console.log('result=>>>', user);
        });
      });
    } else {
      message.error('Por favor ingrese todos los campos');
    }
  };

  const CopyPassword = () => {
    if (resultSearch !== null) {
      navigator.clipboard.writeText(
        resultSearch?.properties?.password
          ? resultSearch?.properties?.password
          : resultSearch?.properties?.contrasena
          ? resultSearch?.properties?.contrasena
          : 'NO TIENE'
      );
      message.success('Contraseña copiada');
    } else {
      message.error('Por favor busque un usuario');
    }
  };

  return (
    <Card hoverable={true} title={'Consulta personaliza de contraseñas de usuarios'}>
      <Row>
        <Col span={10}>
          <Card>
            <Space direction='vertical'>
              <Input
                onChange={(e) => setconsulta({ ...consulta, email: e.target.value })}
                placeholder='Digite aqui el correo del usuario'
              />
              <Input
                onChange={(e) => setconsulta({ ...consulta, event: e.target.value })}
                placeholder='Digite aqui el id del evento'
              />
              <Button type='primary' onClick={() => setshowModal(!showModal)}>
                Ayuda!, No se cual es el id de un evento
              </Button>
              <Button icon={<SearchOutlined />} type='primary' onClick={() => HandleSearch()}>
                Consultar Datos
              </Button>
            </Space>
          </Card>
        </Col>

        <Col>
          <Card style={{ width: 400 }} title='Datos del usuario'>
            {resultSearch != null ? (
              <>
                <lable>Nombre:</lable>
                <Input value={resultSearch?.properties?.names} />

                <lable>Correo:</lable>
                <Input value='Mario Montero' value={resultSearch?.properties?.email} />

                <lable>Contraseña:</lable>
                <Input.Group compact>
                  <Input
                    style={{ width: 'calc(100% - 100px)' }}
                    value={
                      resultSearch?.properties?.contrasena
                        ? resultSearch?.properties?.contrasena
                        : resultSearch?.properties?.password
                        ? resultSearch?.properties?.password
                        : 'NO TIENE'
                    }
                  />
                  <Button onClick={() => CopyPassword()} icon={<CopyOutlined />} type='primary'>
                    Copiar
                  </Button>
                </Input.Group>
              </>
            ) : (
              <h2>no hay informacion</h2>
            )}
          </Card>
        </Col>
      </Row>

      <Modal footer={null} title='Hola Productor 👋 ' visible={showModal} onCancel={() => setshowModal(!showModal)}>
        <p>Te dejamos por aca una imagen de como puedes sacar el id del evento</p>
        <Row justify='center'>
          <Image
            width={500}
            src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Captura%20de%20pantalla%202021-11-26%20161947.png?alt=media&token=4ebe0f4c-4e6d-464e-b5d9-42c97f75625b'
          />
        </Row>
      </Modal>
    </Card>
  );
};
