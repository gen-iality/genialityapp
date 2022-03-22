import { Row, Col, Avatar } from 'antd';

export default function RankingMyScore({ myScore }) {
  const { name, score } = myScore;
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: '14px', fontWeight: '700', marginTop: '3px' }}>Mi Puntaje</h3>
      {name !== '' && (
        <div className='card-games-ranking ranking-user'>
          <Row justify='space-between'>
            <Col span={6}>
              <Avatar size={38}>
                {name && name.charAt(0).toUpperCase()}
                {name && name.substring(name.indexOf(' ') + 1, name.indexOf(' ') + 2)}
              </Avatar>
            </Col>
            <Col span={12}>
              <h3 style={{ fontWeight: '700' }}>{name}</h3>
            </Col>
            <Col span={6}>
              <h4>{score ? score : 0} pts</h4>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
