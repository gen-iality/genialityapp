import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';
import { Row, Col, Card, Avatar } from 'antd';
import { ArrowLeftOutlined, VideoCameraOutlined } from '@ant-design/icons';

// const rankingDemo = [
//   {
//     name: 'Iván Sánchez',
//     puntaje: 85,
//   },
//   {
//     name: 'Juan Lopez',
//     puntaje: 78,
//   },
//   {
//     name: 'Diana Silva',
//     puntaje: 79,
//   },
//   {
//     name: 'Beatriz Pinzón',
//     puntaje: 100,
//   },
//   {
//     name: 'Felipe Casas',
//     puntaje: 5,
//   },
//   {
//     name: 'Jorge Jiménez',
//     puntaje: 15,
//   },
//   {
//     name: 'Nicolas Gomez',
//     puntaje: 100,
//   },
// ];

export default function ListadoJuegos(props) {
  const [ranking, setRanking] = useState([]);
  const [myName, setMyName] = useState('');
  const [myScore, setMyScore] = useState('');

  useEffect(() => {
    props.changeContentDisplayed('games');

    let gameId = '0biWfCwWbUGhbZmfhkvu';

    //Consulta del puntaje del currentUser
    firestore
      .collection('juegos/' + gameId + '/puntajes/')
      .doc(props.currentUser._id)
      .onSnapshot(function(response) {
        const myScore = response.data();

        if (myScore) {
          setMyName(myScore.name);
          setMyScore(myScore.puntaje);
        }
      });

    //Consulta de todos los puntajes
    firestore
      .collection('juegos/' + gameId + '/puntajes/')
      .orderBy('puntaje', 'desc')
      .limit(10)
      .onSnapshot(function(querySnapshot) {
        var puntajes = [];
        querySnapshot.forEach(function(doc) {
          puntajes.push(doc.data());
        });
        setRanking(puntajes);
      });
  }, [props.currentUser]);

  function formatName(name) {
    const result = decodeURIComponent(name);
    return result;
  }

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
          <h2 style={{ fontWeight: '700' }}> Volver a la Conferencia </h2>
        </Col>
        <Col span={4}>
          <VideoCameraOutlined />
        </Col>
      </Row>
      {/*JUEGOS*/}
      {/* <Card
        hoverable
        onClick={() => props.changeContentDisplayed('game')}
        style={{ cursor: 'pointer', marginTop: '12px' }}>
        <Row justify='space-between'>
          <Col span={6}>
            <Avatar size={38} icon={<BuildOutlined />} style={{ backgroundColor: '#87d068' }} />
          </Col>
          <Col span={18}>
            <h2 style={{ fontWeight: '700' }}>Juego 1</h2>
          </Col>
        </Row>
      </Card> */}
      <Card
        hoverable
        onClick={() => props.changeContentDisplayed('games')}
        style={{ cursor: 'pointer', marginTop: '12px' }}>
        <Row justify='space-between' onClick={() => props.changeContentDisplayed('games')}>
          <Col span={6}>
            <Avatar size={38} style={{ backgroundColor: '#87d068' }}>
              {' '}
              <img
                src='https://cdn0.iconfinder.com/data/icons/gaming-console/128/2-512.png'
                style={{ width: '40px' }}
              />
            </Avatar>
          </Col>
          <Col span={18}>
            <h2 style={{ fontWeight: '700' }}>Juego 1</h2>
          </Col>
        </Row>
      </Card>
      {/*RANKING*/}
      <Row justify='center'>
        {myName !== '' && myScore !== '' && (
          <>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginTop: '3px' }}>Mi Puntaje</h3>
            <div className='card-games-ranking ranking-user'>
              <Row justify='space-between'>
                <Col span={6}>
                  <Avatar size={38}>
                    {myName && myName.charAt(0).toUpperCase()}
                    {myName && myName.substring(myName.indexOf(' ') + 1, myName.indexOf(' ') + 2)}
                  </Avatar>
                </Col>
                <Col span={12}>
                  <h3 style={{ fontWeight: '700' }}>{props.currentUser.displayName}</h3>
                </Col>
                <Col span={6}>
                  <h4>{myScore} pts</h4>
                </Col>
              </Row>
            </div>
          </>
        )}
        <h3 style={{ fontSize: '14px', fontWeight: '700', marginTop: '3px' }}>Ranking de jugadores</h3>
        <div className='container-ranking'>
          {ranking.length &&
            ranking.map((item, key) => (
              <>
                <div className='card-games-ranking' key={'item' + key}>
                  <Row justify='space-between'>
                    <Col span={6}>
                      <Avatar size={35}>
                        {item.name && item.name.charAt(0).toUpperCase()}
                        {item.name && item.name.substring(item.name.indexOf(' ') + 1, item.name.indexOf(' ') + 2)}
                      </Avatar>
                    </Col>
                    <Col span={12}>
                      <h3>{formatName(item.name)}</h3>
                    </Col>
                    <Col span={6}>
                      <h4>{item.puntaje} Pts</h4>
                    </Col>
                  </Row>
                </div>
              </>
            ))}
        </div>
      </Row>
    </>
  );
}
