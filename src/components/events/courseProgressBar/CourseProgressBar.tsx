import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import { activityContentValues } from '@context/activityType/constants/ui';

import lessonTypeToString from '../lessonTypeToString';

import Step from './Step';
import Line from './Line';

import './CourseProgressBar.css';

type Activity = {
  _id: string;
  type?: { name: string },
  name: string;
  activity_id: string;
};

export interface CourseProgressBarProps {
  count: number;
  linkFormatter: (activityId: string) => string;
  activities: Activity[];
  activitiesAttendee: Activity[];
  onChange?: () => void;
}

function CourseProgressBar(props: CourseProgressBarProps) {
  const { count, linkFormatter, activities, activitiesAttendee } = props;

  const [currentId, setCurrentId] = useState(null);

  if (activities.length === 0) {
    return null;
  }

  return (
    <div>
      <div className='CourseProgressBar-container'>
        <div className='CourseProgressBar-innerContainer'>
          {activities.map((activity, index) => (
            <div className='CourseProgressBar-stepContainer'>
              <Line isActive={activitiesAttendee.filter(attende => attende.activity_id == activity._id).length} />
              <Link to={linkFormatter(activity._id)} key={`key_${index}`}>
                <Step
                  /* onChangeFunction={onChange} */
                  onClick={props.onChange}
                  setCurrentId={setCurrentId}
                  currentId={currentId}
                  id={activity._id}
                  key={activity._id}
                  isActive={activitiesAttendee.filter(attende => attende.activity_id == activity._id).length}
                  isSurvey={[activityContentValues.quizing, activityContentValues.survey].includes(activity.type?.name as any)}
                >
                  <Tooltip
                    placement='right'
                    title={`Ir ${
                      [activityContentValues.quizing, activityContentValues.survey].includes(activity.type?.name! as any)
                        ? 'al cuestionario'
                        : 'a la actividad'
                    } "${activity.name}", tipo ${(
                      activity.type?.name ? lessonTypeToString(activity.type?.name) : 'sin contenido'
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
