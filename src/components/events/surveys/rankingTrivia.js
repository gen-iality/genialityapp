import React, { Component } from 'react';
import { Row, Col, Card, Avatar } from 'antd';
import { firestore } from '../../../helpers/firebase';

export default class rankingTrivia extends Component {
  componentDidMount() {
    console.log('se carga ranking');
    console.log('ranking', this.props);
    // const { currentSurvey } = this.props;
    // firestore
    //   .collection('surveys')
    //   .doc(currentSurvey._id)
    //   .collection('ranking')
    //   .onSnapshot(function(result) {
    //     if (result) {
    //       console.log('infor para el ranking', result);
    //     }
    //   });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.currentSurvey !== this.props.currentSurvey) {
      const { currentSurvey } = this.props;
      if (Object.keys(currentSurvey).length) {
        firestore
          .collection('surveys')
          .doc(currentSurvey._id)
          .collection('ranking')
          .onSnapshot(function(result) {
            if (result) {
              const data = result.docs;
              data.forEach((element) => {
                console.log('info para el ranking', element.data());
              });
              //console.log('info para el ranking', result.docs);
            }
          });
      }
    }
  }

  render() {
    return (
      <Row justify='center'>
        prueba
        {/* {myName !== '' && myScore !== '' && (
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
        )} */}
      </Row>
    );
  }
}
