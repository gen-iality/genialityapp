import React from 'react';
import { Row, Col } from 'antd';
import ReactPlayer from 'react-player';
import EventLanding from './eventLanding';
import { UseEventContext } from '../../Context/eventContext';


const EventHome = () => {
  /*Contextos*/
  let cEvent = UseEventContext();

  return (
    <>
      <Row justify='center'>
        <Col sm={24} md={16} lg={18} xl={18}>
          {cEvent.value && cEvent.value._id !== '5f0b95ca34c8116f9b21ebd6' && (
            <EventLanding  />
          )}
          {cEvent.value && cEvent.value._id === '5f0b95ca34c8116f9b21ebd6' && (
            <>
              <ReactPlayer
                width={'100%'}
                style={{
                  display: 'block',
                  margin: '0 auto',
                }}
                url={cEvent.value.video}
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
                        controls
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default EventHome;
