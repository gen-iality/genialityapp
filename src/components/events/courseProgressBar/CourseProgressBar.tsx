import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import Step from './Step';

import './CourseProgressBar.css';

type Activity = {
  _id: string,
  name: string,
};

export interface CourseProgressBarProps {
  total: number,
  count: number,
  linkFormatter: (activityId: string) => string,
  activities: Activity[],
};

function CourseProgressBar(props: CourseProgressBarProps) {
  const {
    total,
    count,
    linkFormatter,
    activities,
  } = props;

  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    if (count === total) {
      setProgressWidth(100);
    } else {
      setProgressWidth((100 / (total - 1)) * count);
    }
  }, [count, total]);

  if (total === 0) {
    return null;
  }

  return (
    <div className='CourseProgressBar-container'>
      <div className='CourseProgressBar-line' style={{ height: progressWidth + "%" }}></div>
      {Array.from(Array(total).keys()).map((i, j) => (
        <Step
          isActive={i < count}
        >
          <Link to={linkFormatter(activities[j]._id)} key={`key_${j}`}>
            <Tooltip placement="right" title={`Ir a la actividad "${activities[j].name}"`}>
              {i+1}
            </Tooltip>
          </Link>
        </Step>
      ))}
    </div>
  );
}

export default CourseProgressBar;