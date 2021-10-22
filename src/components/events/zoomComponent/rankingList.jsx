import React, { useState, useEffect } from 'react';
import { Row, Col, Avatar } from 'antd';

export default function RankingList({ data }) {
  function formatName(name) {
    const result = decodeURIComponent(name);
    return result;
  }

  const [list, setList] = useState([]);

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'red !important' }}>Ranking de jugadores</h3>
      <div className='container-ranking' style={{ marginTop: 16 }}>
        {list.length > 0 ? (
          list.map((item, key) => (
            <div className='card-games-ranking' key={'item' + key}>
              <Row justify='space-between' align='middle'>
                <Col span={6}>
                  <Avatar size={35}>
                    {item.name && item.name.charAt(0).toUpperCase()}
                    {item.name && item.name.substring(item.name.indexOf(' ') + 1, item.name.indexOf(' ') + 2)}
                  </Avatar>
                </Col>
                <Col span={12}>
                  <h3 style={{ color: 'red !important' }}>{formatName(item.name)}</h3>
                </Col>
                <Col span={6}>
                  <h4 style={{ color: 'red !important' }}>{item.score} Pts</h4>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <div className='card-games-ranking'>
            <Row>
              <Col>No hay resultados</Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}
