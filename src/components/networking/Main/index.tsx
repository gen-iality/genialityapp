import { Button, Col, Row, Tabs,Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import Report from '../report';
import { UseEventContext } from '@/context/eventContext';
import { PlusCircleOutlined } from '@ant-design/icons';
import MeetingList from './components/MeetingList';
import MeetingForm from './components/MeetingForm';
import { IMeeting } from './interfaces/meetings.interfaces';
import { listenAttendees, listenMeetings } from './services/meenting.service';


export default function Networking() {
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(false);
  const [attendees, setAttendees] = useState([])
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    if(!!eventId) {
      const unsubscribeAttendees = listenAttendees(eventId, setAttendees)
      const unsubscribeMeetings = listenMeetings(eventId, setMeetings)
      return () => {
        unsubscribeAttendees()
        unsubscribeMeetings()
      }
    }
  }, [])

  useEffect(() => {
    console.log({ attendees, meetings })
  },[attendees, meetings]) 

  const openModal = (modo?:string) => {
    if (modo ==='edit') setEdicion(true)
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
    setEdicion(false);
  };

  const eventContext = UseEventContext();
  const eventId = eventContext?.idEvent;
  const dataPruebas : IMeeting[] = [
    {
      name  : 'prueba 0',
      place : 'barranquilla/la-victoria',
      date  : new Date(Date.now() + 86400000),
      participants : [
        {
          name : 'carlos',
          email : 'carloprueba@gmail.com',
          phone : '234992904',
          attendance : 'sin asistir'
        },
        {
          name : 'luis',
          email : 'luisprueba@gmail.com',
          phone : '3223231212',
          attendance : 'sin asistir'
        },
        {
          name : 'carlos',
          email : 'carloprueba@gmail.com',
          phone : '234992904',
          attendance : 'sin asistir'
        },
        {
          name : 'luis',
          email : 'luisprueba@gmail.com',
          phone : '3223231212',
          attendance : 'sin asistir'
        }
      ]
    },
    {
      name  : 'prueba 1',
      place : 'barranquilla/la-victoria',
      date  : new Date(),
      participants : [
        {
          name : 'carlos',
          email : 'carloprueba@gmail.com',
          phone : '234992904',
          attendance : 'sin asistir'
        },
        {
          name : 'luis',
          email : 'luisprueba@gmail.com',
          phone : '3223231212',
          attendance : 'sin asistir'
        }
      ]
    },{
      name  : 'prueba 2',
      place : 'barranquilla/la-victoria',
      date  : new Date(),
      participants : [
        {
          name : 'carlos',
          email : 'carloprueba@gmail.com',
          phone : '234992904',
          attendance : 'sin asistir'
        },
        {
          name : 'luis',
          email : 'luisprueba@gmail.com',
          phone : '3223231212',
          attendance : 'sin asistir'
        }
      ]
    },{
      name  : 'prueba 3',
      place : 'barranquilla/la-victoria',
      date  : new Date(),
      participants : [
        {
          name : 'carlos',
          email : 'carloprueba@gmail.com',
          phone : '234992904',
          attendance : 'sin asistir'
        },
        {
          name : 'luis',
          email : 'luisprueba@gmail.com',
          phone : '3223231212',
          attendance : 'sin asistir'
        }
      ]
    },{
      name  : 'prueba 4',
      place : 'barranquilla/la-victoria',
      date  : new Date(),
      participants : [
        {
          name : 'carlos andres rubio viloria',
          email : 'carloprueba@gmail.com',
          phone : '234992904',
          attendance : 'sin asistir'
        },
        {
          name : 'luis',
          email : 'luisprueba@gmail.com',
          phone : '3223231212',
          attendance : 'sin asistir'
        }
      ]
    }
  ]
  
  return (
    <Tabs defaultActiveKey={'1'}>
      
      <Tabs.TabPane tab='Agendar citas' key={1}>
      {modal && (
								<Modal
									visible={modal}
									title={edicion?'Editar reunion':'Agregar Reunion'}
									footer={false}
									onCancel={closeModal}
									okText={'Guardar'}>
									<MeetingForm cancel={closeModal}/>
								</Modal>
							)}
        <Row justify='end' wrap gutter={[8, 8]}>
          <Col>
            <Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={()=>openModal()}>
              Agregar
            </Button>
          </Col>
        </Row>
        <Row justify='center' wrap gutter={[0, 16]}>
          <Col span={24}>
            <MeetingList meentings={dataPruebas}/>
          </Col>
        </Row>
      </Tabs.TabPane>

      <Tabs.TabPane tab='Report de networking' key={2}>
        <Report props={eventId} />
      </Tabs.TabPane>

    </Tabs>
  );
}
