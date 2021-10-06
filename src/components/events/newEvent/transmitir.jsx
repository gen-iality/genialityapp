import { Col, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { useContextNewEvent } from '../../../Context/newEventContext';
import OptTranmitir from './optTransmitir';

function Transmitir() {
  const {changeTransmision,optTransmitir,changeOrganization,organization}= useContextNewEvent();
  return (
    <>
      {optTransmitir == false ? (
        <div className='step-transmision'>
          <h1 className='title-step'>Transmitir desde Evius</h1>
          <Row>
            <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
              <div className='container'>
                <div className='container-image'>
                  <img
                    style={{ width: '60%', margin: 'auto' }}
                    src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ceEvius.png?alt=media&token=caecef6c-e177-47aa-bcd5-347c754fe409'
                    alt=''
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
              <div className='container-description'>
                <div className='descriptions'>
                  <p>
                    Tu evento será transmitido desde evius usando tus camara y teniendo la posibilidad de agregar
                    efectos profesionales
                  </p>
                  {/*<a onClick={() => changeTransmision(true)}>Ver opciones de transmisión externas</a>*/}
                  {<a onClick={() => changeOrganization(true)}>Organización</a>}
                </div>
              </div>
            </Col>
          </Row>
        {organization && <Modal title="Basic Modal" visible={organization} onCancel={()=>changeOrganization(false)}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>}
        </div>
      ) : (
        <OptTranmitir />
      )}
    </>
  );
}

export default Transmitir;