import * as React from 'react';
import { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table'

import { SurveysApi } from '@/helpers/request';
import { Question, Survey } from './types';
import useQuizQuestionStats from './useQuizQuestionStats';
import QuizStatusMessage from './quizStatus';
import QuizBadge from './QuizBadge';

type RowData = {
  surveyTitle: string,
  status: {
    isPassed?: boolean,
    message: string,
  },
  statsMessage: string,
};

export interface QuizzesProgressProps {
  /**
   * The event ID
   */
   eventId: string,
   /**
    * The activity ID
    */
   activityId: string,
   /**
    * The current user ID
    */
   userId: string,
}

const columns: ColumnsType<RowData> = [
  {
    title: 'Examen',
    dataIndex: 'surveyTitle',
    key: 'exam',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    render: ({isPassed, message}) => (
      <QuizBadge isPassedQuiz={isPassed} passedMessage={message}/>
    ),
  },
  {
    title: 'Estadística',
    dataIndex: 'statsMessage',
    key: 'statsMessage',
    render: (text) => <Typography.Text strong>{text}</Typography.Text>,
  },
];

const generatePassedMessage = (isPassedQuiz: boolean, totalAnswers: number) => {
  if (isPassedQuiz === undefined) return QuizStatusMessage.PROCESSING;
  if (totalAnswers === 0) return QuizStatusMessage.NO_QUESTIONS;
  if (isPassedQuiz) return QuizStatusMessage.PASSED;
  return QuizStatusMessage.NOT_PASSED;
};

const QuizzesProgress: React.FunctionComponent<QuizzesProgressProps> = (props) => {
  const [rows, setRows] = useState<RowData[]>([]);

  useEffect(() => {
    (async () => {
      const surveys: Survey[] = await SurveysApi.byEvent(props.eventId);
      console.debug('surveys', surveys);

      const caughtRows: RowData[] = [];

      for (let i = 0; i < surveys.length; i++) {
        const survey: Survey = surveys[i];
        const questions: Question[] = survey.questions || [];

        let totalResponses = questions.length;
        let goodResponses = 0;
        let winnedPoints = 0;

        // Find in each question all answers.
        // NOTE: not try to optimize using .forEach or .map at least that you know to use Promise.all
        console.debug('The survey\'s questions are:');
        for (let j = 0; j < questions.length; j++) {
          const question = questions[j];
          const stats = await useQuizQuestionStats(survey, question, props.userId);
          goodResponses = goodResponses + stats.passedAmount
          winnedPoints = winnedPoints + parseInt(stats.winnedPoints as any);
        }

        console.debug(survey.survey, 'winnedPoints >= survey.minimumScore', winnedPoints, survey.minimumScore);

        let isPassed = undefined;
        if (totalResponses > 0) {
          isPassed = winnedPoints >= survey.minimumScore;
        }

        const rowData: RowData = {
          surveyTitle: survey.survey,
          statsMessage: `${goodResponses} de ${totalResponses}`,
          status: {
            isPassed,
            message: generatePassedMessage(
              winnedPoints >= survey.minimumScore,
              totalResponses,
            )
          },
        };

        caughtRows.push(rowData);
      }

      console.debug('caughtRows', caughtRows);
      setRows(caughtRows);
    })();
  }, []);

  return (
    <section>
      <Typography.Text strong>Progreso de quices</Typography.Text>
      <Table dataSource={rows} columns={columns} />
    </section>
  );
}

export default QuizzesProgress;
