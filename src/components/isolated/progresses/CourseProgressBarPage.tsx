import * as React from 'react';
import { useState } from 'react';
import { Button, Space } from 'antd';

import CourseProgressBar from '../../events/courseProgressBar/CourseProgressBar';

export interface ICourseProgressBarPageProps {
}

export function CourseProgressBarPage (props: ICourseProgressBarPageProps) {
  const [takenCourseCount, setTakenCourseCount] = useState(0);
  const [takenCourseTotal, setTakenCourseTotal] = useState(10);

  const increase = () => {
    if (takenCourseCount + 1 <= takenCourseTotal) {
      setTakenCourseCount((previous) => previous + 1)
    }
  };
  const decrease = () => {
    if (takenCourseCount - 1 >= 0) {
      setTakenCourseCount((previous) => previous - 1);
    }
  };

  return (
    <div>
      <Space direction='vertical'>
        <Button onClick={increase}>Aumentar</Button>
        <Button onClick={decrease}>Disminuir</Button>
        <CourseProgressBar total={takenCourseTotal} count={takenCourseCount} />
      </Space>
    </div>
  );
}
