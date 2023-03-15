import { Button, Col, Row, Modal } from 'antd';
import React, { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import MeetingList from '../components/MeetingList';
import MeetingForm from '../components/MeetingForm';
import { IMeeting, typeAttendace } from '../interfaces/meetings.interfaces';
import { useContext } from 'react';
import { NetworkingContext } from '../context/NetworkingContext';

export default function Meentign() {
  const { 
    attendees, 
    meetings, 
    meentingSelect, 
    modal,
    edicion, 
    closeModal , 
    openModal  } = useContext(NetworkingContext);



  const dataPruebas: IMeeting[] = [
    {
      id: 'f54e1515g51r15gf',
      name: 'Walmart',
      place: 'barranquilla/la-victoria',
      date: new Date(Date.now() + 86400000),
      participants: [
        {
          id: 'f54erf41r5f',
          name: 'carlos',
          email: 'carloprueba@gmail.com',
          attendance: typeAttendace.unconfirmed,
        },
        {
          id: 'f54erf4ef5eff',
          name: 'luis',
          email: 'luisprueba@gmail.com',
          attendance: typeAttendace.unconfirmed,
        },
        {
          id: 'f54erf4515f1fe',
          name: 'federico',
          email: 'carloprueba@gmail.com',
          attendance: typeAttendace.unconfirmed,
        },
        {
          id: 'f54erf4fe5e5f2',
          name: 'marlon',
          email: 'luisprueba@gmail.com',
          attendance: typeAttendace.unconfirmed,
        },
      ],
    },
    {
      id: 'f54erf41r5f45e45e5e5e55w',
      name: 'Amazon',
      place: 'barranquilla/la-victoria',
      date: new Date(Date.now() + 86400000),
      participants: [
        {
          id: 'f54erg165615115rg',
          name: 'carlos',
          email: 'carloprueba@gmail.com',

          attendance: typeAttendace.unconfirmed,
        },
        {
          id: 'f54erf4F4e5f45e45f45efe',
          name: 'luis',
          email: 'luisprueba@gmail.com',

          attendance: typeAttendace.unconfirmed,
        },
      ],
    },
    {
      id: 'f54erf41r5f45e45e5eFe54f45ef45e5f5e55w',
      name: 'United Health',
      place: 'barranquilla/la-victoria',
      date: new Date(Date.now() + 86400000),
      participants: [
        {
          id: 'e231fe521fe231fe1fe52f',
          name: 'carlos',
          email: 'carloprueba@gmail.com',
          attendance: typeAttendace.unconfirmed,
        },
        {
          id: 'e1gfefe1f23e1f32e1f23ef',
          name: 'luis',
          email: 'luisprueba@gmail.com',
          attendance: typeAttendace.unconfirmed,
        },
      ],
    },
    {
      id: 'f54erf41rf54e54f156ef4156ef1e',
      name: 'Barkshire Hathaway',
      place: 'barranquilla/la-victoria',
      date: new Date(Date.now() + 86400000),
      participants: [
        {
          id: 'f54erf41r5fe51f5e1f5e1f5ef',
          name: 'carlos',
          email: 'carloprueba@gmail.com',

          attendance: typeAttendace.unconfirmed,
        },
        {
          id: '4fef1e51f5e41f5e1f45e1f5e1f',
          name: 'luis',
          email: 'luisprueba@gmail.com',

          attendance: typeAttendace.unconfirmed,
        },
      ],
    },
    {
      id: 'f54erf41r5f45e454ef54ef415ef',
      name: 'Samsung Electronics',
      place: 'barranquilla/la-victoria',
      date: new Date(Date.now() + 86400000),
      participants: [
        {
          id: 'f54erf41r5f45e435e1f5e41f5e1f',
          name: 'carlos andres rubio viloria',
          email: 'carloprueba@gmail.com',

          attendance: typeAttendace.unconfirmed,
        },
        {
          id: 'f54erf41r5f45e45e5e5f51ef15ef1ef',
          name: 'luis',
          email: 'luisprueba@gmail.com',

          attendance: typeAttendace.unconfirmed,
        },
      ],
    },
  ];
  return (
    <>
      {modal && (
        <Modal
          visible={modal}
          title={edicion ? 'Editar reunion' : 'Agregar Reunion'}
          footer={false}
          onCancel={closeModal}
          okText={'Guardar'}>
          <MeetingForm cancel={closeModal} attendees={attendees} edit={edicion} reunion_info={meentingSelect} />
        </Modal>
      )}
      <Row justify='end' wrap gutter={[8, 8]}>
        <Col>
          <Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={() => openModal()}>
            Agregar
          </Button>
        </Col>
      </Row>
      <Row justify='center' wrap gutter={[0, 16]}>
        <Col span={24}>
          <MeetingList meentings={dataPruebas} />
        </Col>
      </Row>
    </>
  );
}
