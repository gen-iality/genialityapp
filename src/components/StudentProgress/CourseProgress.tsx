import { memo, ReactNode } from 'react';
import { Progress } from 'antd';

export interface CourseProgressProps {
  type: 'circle' | 'block',
  title?: string,
  hasLabel?: boolean,
  percentValue: number,
  stats?: string | ReactNode,
  steps?: number,
};

export interface SteppedCourseProgressProps extends Omit<CourseProgressProps, 'type'> {
  type: 'steps',
  steps: number
};

function CourseProgress(props: CourseProgressProps | SteppedCourseProgressProps) {
  const {
    type,
    hasLabel = false,
    percentValue,
    stats,
    title,
  } = props;

  return (
    <div style={{ color: '#AAA' }}>
      {hasLabel && <p style={{ color: 'black', fontWeight: 'bold' }}>{title || 'Mi progreso'}:</p>}

      {type === 'circle' && (
      <Progress
        type='circle'
        percent={percentValue}
        format={() => stats}
      />
      )}

      {type === 'steps' && (
      <Progress
        percent={percentValue}
        steps={props.steps || 0}
        format={() => stats}
      />
      )}

      {type === 'block' || type === undefined && (
      <Progress
        strokeColor={{
          from: '#f7981d', //'#108ee9',
          to: '#FFB453', //'#87d068',
        }}
        trailColor='#E6E6E6'
        percent={percentValue}
        status='active'
        format={() => stats}
      />
      )}
    </div>
  );
}

export default memo(CourseProgress);
