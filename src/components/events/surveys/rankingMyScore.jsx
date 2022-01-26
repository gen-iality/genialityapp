import React, { useContext } from 'react';
import { Row, Col, Avatar, Spin } from 'antd';
import { HelperContext } from '../../../Context/HelperContext';

export default function RankingMyScore({ myScore }) {
  let { imageforDefaultProfile } = useContext(HelperContext);
  const { name, score, imageProfile, index } = myScore;

  function formatName(name) {
    const result = decodeURIComponent(name);
    return result;
  }
  return (
    <>
      {!myScore ? (
        <Spin tip='Cargando...' size='large' />
      ) : (
        <div style={{ marginTop: 16 }}>
          {name === '' ? (
            <div className='card-games-ranking ranking-user'></div>
          ) : (
            <div className='card-games-ranking ranking-user'>
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginTop: '3px' }}>Mi Puntaje</h3>
              <Row justify='space-between'>
                <Col span={4}>
                  <Avatar
                    src={imageProfile ? imageProfile : imageforDefaultProfile}
                    style={{ filter: ' drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25))' }}
                    size={45}
                  />
                </Col>
                <Col span={10}>
                  <h3 style={{ fontWeight: '700' }}>{formatName(name ? name : ' ')}</h3>
                </Col>
                <Col span={6}>
                  <h4>{score ? score : 0} pts</h4>
                </Col>
                <Col span={4}>
                  <h3 style={{ fontWeight: '700' }}>{index ? index : ' '}</h3>
                </Col>
              </Row>
            </div>
          )}
        </div>
      )}
    </>
  );
}
