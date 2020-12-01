import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';
import {Row, Col, Card, Avatar} from 'antd';
import { BuildOutlined, ArrowLeftOutlined, VideoCameraOutlined } from '@ant-design/icons';

export default function ListadoJuegos(props) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    let gameId = '0biWfCwWbUGhbZmfhkvu';
    firestore.collection('juegos/' + gameId + '/puntajes/').onSnapshot(function(querySnapshot) {
      var puntajes = [];
      querySnapshot.forEach(function(doc) {
        puntajes.push(doc.data());
      });
      setRanking(puntajes);
    });
  }, []);

  return (
    <>
      {/* <ul>
        <li onClick={() => props.changeContentDisplayed('game')}>Juego 1</li>
        <li onClick={() => props.changeContentDisplayed('game2')}>Juego 2</li>
        <li onClick={() => props.changeContentDisplayed('conference')}>Conferencia</li>
      </ul> */}
      <Row justify='space-between'>
        <Col span={4}>
          <ArrowLeftOutlined onClick={() => props.changeContentDisplayed('conference')} />
        </Col>
        <Col span={14}>
         <h2 style={{fontWeight:'700'}}> Volver a la Conferencia  </h2>
        </Col>
        <Col span={4}>
          <VideoCameraOutlined />
        </Col>  
      </Row> 
      {/*JUEGOS*/}
      <Card 
        hoverable
        onClick={() => props.changeContentDisplayed('game')} 
        style={{cursor:'pointer', marginTop:'12px'}}>
        <Row justify='space-between'>
          <Col lg={6}>
           <Avatar size={38} icon={<BuildOutlined />} style={{ backgroundColor: '#87d068' }}/>
         </Col>
         <Col lg={18}>
          <h2 style={{fontWeight:'700'}}>Juego 1</h2>
         </Col>  
        </Row>  
      </Card>
      <Card 
        hoverable
        onClick={() => props.changeContentDisplayed('game2')} 
        style={{cursor:'pointer', marginTop:'12px'}}>
        <Row justify='space-between'>
          <Col lg={6}>
           <Avatar size={38} icon={<BuildOutlined />} style={{ backgroundColor: '#87d068' }}/>
         </Col>
         <Col lg={18}>
          <h2 style={{fontWeight:'700'}}>Juego 2</h2>
         </Col>  
        </Row>  
      </Card>
      {/*RANKING*/}
     <Row justify='center'>
       <h2 hoverable style={{fontSize:'19px', fontWeight:'700'}}>Ranking de jugadores</h2>
       <Card style={{width:'354px', padding:'5px'}}>
         <Row justify='space-between'>
          <Col lg={6}>
           <Avatar size={38}>26</Avatar>
         </Col>
         <Col lg={18}>
          <h3 style={{fontWeight:'700'}}>TU</h3>
          <h4>112.123 Pts</h4>
         </Col>  
         </Row>                
       </Card>
       {ranking.map((item, key) => (
       <Card hoverable style={{width:'354px', padding:'5px'}} key={'item' + key}>        
           <Row justify='space-between'>
            <Col lg={6}>
              <Avatar size={38}> 1 </Avatar>
            </Col>
            <Col lg={18}>
              <h3>Nombre del jugador</h3>
              <h4>{item.puntaje} Pts</h4>
            </Col>  
            </Row>        
         </Card> 
        ))}         
     </Row>
    </>
  );
}
