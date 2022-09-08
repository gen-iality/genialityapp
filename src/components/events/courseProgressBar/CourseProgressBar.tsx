import * as React from 'react';
import { useState, useEffect } from 'react';

import Step from './Step';

import './CourseProgressBar.css';

export interface CourseProgressBarProps {
  total: number,
  count: number,
};

function CourseProgressBar(props: CourseProgressBarProps) {
  const {
    total,
    count,
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
      {Array.from(Array(total).keys()).map((i) => (
        <Step
          isActive={i < count}
        >
          {i+1}
        </Step>
      ))}
    </div>
  );
}

export default CourseProgressBar;