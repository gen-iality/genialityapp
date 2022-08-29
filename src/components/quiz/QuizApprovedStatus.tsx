import * as React from 'react';
import { useState, useEffect } from 'react';

import { Badge } from 'antd';
import { SurveysApi } from '@/helpers/request';
import { Survey } from './types';

import { UseCurrentUser } from '@context/userContext';
import useAsyncPrepareQuizStats from './useAsyncPrepareQuizStats';

export interface QuizApprovedStatusProps {
  eventId: string,
};

function QuizApprovedStatus(props: QuizApprovedStatusProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState('estimando...');
  const [backgroundColor, setBackgroundColor] = useState('#9C835F');

  const cUser = UseCurrentUser();

  // NOTE: if you want to add colors, create a state and check the logic that says if the quiz was passed or not completed.

  useEffect(() => {
    if (!cUser?.value?._id) return;
    (async () => {
      const surveys: Survey[] = await SurveysApi.byEvent(props.eventId);

      let passed = 0;
      let notPassed = 0;

      for (let i = 0; i < surveys.length; i++) {
        const survey: Survey = surveys[i] as never;
        const stats = await useAsyncPrepareQuizStats(props.eventId, survey._id!, cUser?.value?._id, survey);

        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            passed = passed + 1;
          } else {
            notPassed = notPassed + 1;
          }
        }
      }

      if (passed === surveys.length) {
        setStatus('aprobado');
        setBackgroundColor('#5EB841');
      } else if (notPassed < surveys.length) {
        setStatus('reprobado');
        setBackgroundColor('#B8415A');
      } else if (passed < surveys.length) {
        setStatus('no completado');
        setBackgroundColor('#9C835F');
      };

      setIsLoaded(true);      
    })();
  }, [cUser?.value]);

  return (
    <>
    {isLoaded && <Badge count={status} style={{ backgroundColor }} />}
    </>
  );
}

export default QuizApprovedStatus;