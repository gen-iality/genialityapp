import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Steps } from 'antd';

import { activityContentValues } from '@/context/activityType/constants/ui';

import lessonTypeToString from '../lessonTypeToString';

import Step from './Step';
import Line from './Line';

import './CourseProgressBar.css';

/* const { Step } = Steps; */

type Activity = {
  _id: string;
  name: string;
  activity_id: string;
};

export interface CourseProgressBarProps {
  count: number;
  linkFormatter: (activityId: string) => string;
  activities: Activity[];
  activitiesAttendee: Activity[];
}

function CourseProgressBar(props: CourseProgressBarProps) {
  const { count, linkFormatter, activities, activitiesAttendee } = props;

  console.log('903.activities', activities);
  console.log('903.activitiesAttendee', activitiesAttendee);

  let [currentId, setCurrentId] = useState(null);

  if (activities.length === 0) {
    return null;
  }

  return (
    <div>
      {/* <Steps style={{ maxHeight: '100vh', width: 'auto' }} direction='vertical' size='small' labelPlacement='vertical'>
        {activities.map((activity, index) => (
          <Step
            onClick={() => {
              history.push(`/landing/${cEventContext.value._id}/activity/${activity._id}`);
            }}
            type='navigation'
            icon={
              <Tooltip placement='topLeft' title={activity.name}>
                <div>{index + 1} </div>
              </Tooltip>
            }
            status={
              activitiesAttendee.filter(attende => attende.activity_id == activity._id).length ? 'process' : 'wait'
            }
          />
        ))}
      </Steps> */}

      <div className='CourseProgressBar-container'>
        <div className='CourseProgressBar-innerContainer'>
          {activities.map((activity, index) => (
            <div className='CourseProgressBar-stepContainer'>
              <Line isActive={activitiesAttendee.filter(attende => attende.activity_id == activity._id).length} />
              <Link to={linkFormatter(activity._id)} key={`key_${index}`}>
                <Step
                  /* onChangeFunction={onChange} */
                  setCurrentId={setCurrentId}
                  currentId={currentId}
                  id={activity._id}
                  key={activity._id}
                  isActive={activitiesAttendee.filter(attende => attende.activity_id == activity._id).length}
                  isSurvey={[activityContentValues.quizing, activityContentValues.survey].includes(activity.type?.name)}
                >
                  <Tooltip
                    placement='right'
                    title={`Ir ${
                      [activityContentValues.quizing, activityContentValues.survey].includes(activity.type?.name)
                        ? 'al cuestionario'
                        : 'a la actividad'
                    } "${activity.name}", tipo ${(
                      lessonTypeToString(activity.type?.name) || 'sin contenido'
                    ).toLowerCase()}`}
                  >
                    {index + 1}
                  </Tooltip>
                </Step>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseProgressBar;
