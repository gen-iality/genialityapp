import { Progress } from 'antd';

export interface CourseProgressProps {
  progressType: 'circle' | 'block',
  hasProgressLabel?: boolean,
  progressPercentValue: number,
  progressStats?: string,
  steps?: number,
};

export interface SteppedCourseProgressProps extends Omit<CourseProgressProps, 'progressType'> {
  progressType: 'steps',
  steps: number
};

function CourseProgress(props: CourseProgressProps | SteppedCourseProgressProps) {
  const {
    progressType,
    hasProgressLabel = false,
    progressPercentValue,
    progressStats,
  } = props;

  return (
    <div style={{ color: '#AAA' }}>
      {hasProgressLabel && <p style={{ color: 'black', fontWeight: 'bold' }}>Mi progreso:</p>}

      {progressType === 'circle' && (
      <Progress
        type='circle'
        percent={progressPercentValue}
        format={progressStats ? (percent) => progressStats : undefined}
      />
      )}

      {progressType === 'steps' && (
      <Progress
        percent={progressPercentValue}
        steps={props.steps || 0}
        format={progressStats ? (percent) => progressStats : undefined}
      />
      )}

      {progressType === 'block' || progressType === undefined && (
      <Progress
        strokeColor={{
          from: '#f7981d', //'#108ee9',
          to: '#FFB453', //'#87d068',
        }}
        trailColor='#E6E6E6'
        percent={progressPercentValue}
        status='active'
        format={progressStats ? (percent) => progressStats : undefined}
      />
      )}
    </div>
  );
}

export default CourseProgress;
