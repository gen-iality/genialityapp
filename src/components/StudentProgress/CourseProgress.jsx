import { Progress, Row, Col } from 'antd';

function CourseProgress(props) {
  const {
    progressType,
    hasProgressLabel = false,
    progressPercentValue,
    noProgressSymbol = false,
    progressStats,
  } = props;

  return (
    <div style={{ color: '#AAA' }}>
      {hasProgressLabel && <p style={{ color: 'black', fontWeight: 'bold' }}>Mi Progreso:</p>}

      {progressType === 'circle' && (
        <Progress
          type='circle'
          percent={progressPercentValue}
          format={noProgressSymbol ? (percent) => percent : null}
        />
      )}

      {progressType === 'steps' && (
        <Progress
          percent={progressPercentValue}
          steps={activities.length || 0}
          format={noProgressSymbol ? (percent) => percent : null}
        />
      )}

      {progressType === 'block' ||
        (progressType === undefined && (
          <Row justify='space-between'>
            <Col flex='auto'>
              <Progress strokeColor='#f7981d' trailColor='#E6E6E6' percent={progressPercentValue} showInfo={false} />
            </Col>
            <Col flex='none' style={{ paddingLeft: '10px', color: 'black' }}>
              {progressStats}
            </Col>
          </Row>
        ))}
    </div>
  );
}

export default CourseProgress;
