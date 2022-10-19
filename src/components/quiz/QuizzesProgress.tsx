import { useState, useEffect } from 'react';
import { Table, Typography, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { Survey } from './types';
import QuizStatusMessage from './quizStatus';
import QuizBadge from './QuizBadge';
import useAsyncPrepareQuizStats from './useAsyncPrepareQuizStats';
import { SurveysApi } from '@helpers/request';

type Status = {
  right: number,
  total: number,
  minimum: number,
};

type RowData = {
  surveyTitle: string,
  status: Status,
  statsMessage: string,
  requiredMessage: string,
};

export interface QuizzesProgressProps {
  /**
   * The event ID
   */
   eventId: string,
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
    render: (status: Status) => (
      <QuizBadge
        right={status.right}
        total={status.total}
        minimum={status.minimum}
      />
    ),
  },
  {
    title: 'Estadística',
    dataIndex: 'statsMessage',
    key: 'statsMessage',
    render: (text) => <Typography.Text strong>{text}</Typography.Text>,
  },
  {
    title: 'Requerido',
    dataIndex: 'requiredMessage',
    key: 'requiredMessage',
    render: (text) => <p>{text}</p>
  }
];

const generatePassedMessage = (isPassedQuiz: boolean, totalAnswers: number) => {
  if (isPassedQuiz === undefined) return QuizStatusMessage.PROCESSING;
  if (totalAnswers === 0) return QuizStatusMessage.NO_QUESTIONS;
  if (isPassedQuiz) return QuizStatusMessage.PASSED;
  return QuizStatusMessage.NOT_PASSED;
};

function QuizzesProgress(props: QuizzesProgressProps) {
  const [rows, setRows] = useState<RowData[]>([]);
  const [notPassedCount, setNotPassedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    (async () => {
      const surveys: Survey[] = await SurveysApi.byEvent(props.eventId);
      setTotalCourses(surveys.length);
      // const surveys = [
      //   {
      //     survey: 'survey 2',
      //     _id: 'survey-2',
      //     minimumScore: 7,
      //     questions: { length: 10 },
      //   },
      // ];
      console.debug('surveys', surveys);

      const caughtRows: RowData[] = [];

      for (let i = 0; i < surveys.length; i++) {
        const survey: Survey = surveys[i] as never;
        const stats = await useAsyncPrepareQuizStats(props.eventId, survey._id!, props.userId, survey);

        let isPassed = undefined;
        if (stats.total > 0) {
          isPassed = stats.right >= stats.minimum;
        }

        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            setPassedCount((previous) => previous + 1);
          } else {
            setNotPassedCount((previous) => previous + 1);
          }
        }

        const rowData: RowData = {
          surveyTitle: survey.survey,
          status: {
            right: stats.right,
            total: stats.total,
            minimum: stats.minimum,
            },
          statsMessage: `${stats.right} de ${stats.total}`,
          requiredMessage: `Requeridos ${stats.minimum}`,
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
      <br />
      {notPassedCount > 0 && <Alert message='Curso reprobado' type='error' />}
      {passedCount === totalCourses && <Alert message='Curso aprobado' type='success' />}
      <Table dataSource={rows} columns={columns} />
    </section>
  );
}

export default QuizzesProgress;
