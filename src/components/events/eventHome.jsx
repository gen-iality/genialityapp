import React from 'react';
import { Row, Col } from 'antd';
import ReactPlayer from 'react-player';
import EventLanding from './eventLanding';

const EventHome = (props) => {
  console.log('eventHome', props);
  return (
    <>
      <Row justify='center'>
        <Col sm={24} md={16} lg={18} xl={18}>
          {props.cEvent && props.cEvent._id !== '5f0b95ca34c8116f9b21ebd6' && (
            <EventLanding
              event={props.cEvent}
              currentUser={props.cUser}
              usuarioRegistrado={props.cEventUser}
              //   toggleConference={this.toggleConference}
              //   showSection={this.showSection}
            />
          )}
          {props.cEvent && props.cEvent._id === '5f0b95ca34c8116f9b21ebd6' && (
            <>
              <ReactPlayer
                width={'100%'}
                style={{
                  display: 'block',
                  margin: '0 auto',
                }}
                url={event.video}
                //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                controls
              />
              <div className='the-lobby-video-column'>
                <div className='the-lobby-video'>
                  <div className='the-lobby-video-wrap-holder'>
                    <div className='the-lobby-video-holder'>
                      <img src='/lobby/TIRA_PANTALLA.png' alt='' />
                    </div>
                    <div className='the-lobby-video-holder'>
                      <img src='/lobby/TIRA_PANTALLA.png' alt='' />
                    </div>
                  </div>
                  <div className='the-lobby-video-wrap'>
                    <div className='the-lobby-video-container'>
                      <ReactPlayer
                        url={
                          'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/WhatsApp%20Video%202020-07-26%20at%2018.57.30.mp4?alt=media&token=d304d8b9-530d-4972-9a00-373bd19b0158'
                        }
                        //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                        controls
                      />
                    </div>
                  </div>
                </div>
                {
                  // Todo: Poner link a listado de empresas
                }
                {/*
              <Button onClick={this.showSection('companies')} className="the-lobby-exhibitors-btn">
              <img src="/lobby/BOTON_STANDS.png" alt=""/>
              </Button>
            */}
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default EventHome;
