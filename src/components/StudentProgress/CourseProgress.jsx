import { Progress } from 'antd';

function CourseProgress(props) {
  const {
    progressType,
    hasProgressLabel=false,
    progressPercentValue,
    noProgressSymbol=false,
    progressStats,
  } = props;

  return (
    <div style={{ color: '#AAA' }}>
      {hasProgressLabel && (
      <p style={{ color: 'black', fontWeight: 'bold' }}>
        Progreso: {progressStats}
      </p>
      )}

      {progressType === 'circle' && (
      <Progress
        type='circle'
        percent={progressPercentValue}
        format={noProgressSymbol ? (percent) => progressStats : null}
      />
      )}

      {progressType === 'steps' && (
      <Progress
        percent={progressPercentValue}
        steps={activities.length || 0}
        format={noProgressSymbol ? (percent) => progressStats : null}
      />
      )}

      {progressType === 'block' || progressType === undefined && (
      <Progress
        strokeColor={{
          from: '#108ee9',
          to: '#87d068',
        }}
        percent={progressPercentValue}
        status='active'
        format={noProgressSymbol ? (percent) => progressStats : null}
      />
      )}
    </div>
  );
}

export default CourseProgress;
