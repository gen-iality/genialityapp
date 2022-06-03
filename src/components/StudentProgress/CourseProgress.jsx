import { Progress } from 'antd';

function CourseProgress(props) {
  const {
    progressType,
    hasProgressLabel=false,
    progressPercentValue,
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
      />
      )}

      {progressType === 'steps' && (
      <Progress
        percent={progressPercentValue}
        steps={activities.length || 0}
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
      />
      )}
    </div>
  );
}

export default CourseProgress;
