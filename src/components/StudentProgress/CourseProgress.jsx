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
      <p style={{ color: '#AAA' }}>
        Progreso: {progressStats}
      </p>
      )}

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

      {progressType === 'block' || progressType === undefined && (
      <Progress
        strokeColor={{
          from: '#108ee9',
          to: '#87d068',
        }}
        percent={progressPercentValue}
        status='active'
        format={noProgressSymbol ? (percent) => percent : null}
      />
      )}
    </div>
  );
}

export default CourseProgress;
