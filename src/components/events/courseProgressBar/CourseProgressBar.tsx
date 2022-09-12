import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import { activityContentValues } from '@/context/activityType/constants/ui';

import lessonTypeToString from '../lessonTypeToString';

import Step from './Step';

import './CourseProgressBar.css';

type Activity = {
  _id: string,
  name: string,
};

export interface CourseProgressBarProps {
  count: number,
  linkFormatter: (activityId: string) => string,
  activities: Activity[],
};

function CourseProgressBar(props: CourseProgressBarProps) {
  const {
    count,
    linkFormatter,
    activities,
  } = props;

  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    if (count === activities.length) {
      setProgressWidth(100);
    } else {
      setProgressWidth((100 / (activities.length - 1)) * count);
    }
  }, [count, activities.length]);

  const cssStyleForHeight = useMemo(() => {
    if (activities.length > 25) {
      return {}
    } else if (activities.length > 16) {
      return {maxHeight: '100vh'}
    } else if (activities.length == 1) {
      return {maxHeight: '20vh'}
    } else {
      return {maxHeight: '80vh'}
    }
  }, [activities]);

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className='CourseProgressBar-container' style={{...cssStyleForHeight}}>
      <div className='CourseProgressBar-line' style={{ height: progressWidth + "%" }}></div>
      {activities.map((activity, index) => (
        <Link to={linkFormatter(activity._id)} key={`key_${index}`}>
          <Step
            isActive={index < count}
            isSurvey={
              [activityContentValues.quizing,
                activityContentValues.survey].includes(activity.type?.name)
            }
          >
            <Tooltip
              placement="right"
              title={`Ir ${[activityContentValues.quizing, activityContentValues.survey].includes(activity.type?.name)? 'al cuestionario' : 'a la actividad'} "${activity.name}", tipo ${(lessonTypeToString(activity.type?.name)||'sin contenido').toLowerCase()}`}
            >
              {index+1}
            </Tooltip>
          </Step>
        </Link>
      ))}
    </div>
  );
}

export default CourseProgressBar;