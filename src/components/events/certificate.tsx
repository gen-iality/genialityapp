import * as React from 'react';
import { useEffect, useState, createElement } from 'react';
import { Row, Col, Card, Spin, Alert, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import withContext from '../../context/withContext';
import { SurveysApi } from '@/helpers/request';
import { Survey } from '../quiz/types';
import useAsyncPrepareQuizStats from '../quiz/useAsyncPrepareQuizStats';
import { DownloadOutlined } from '@ant-design/icons';
import { AnyObject } from 'chart.js/types/basic';

export interface CertificateProps {
  cEvent?: any
  cEventUser?: any,
};

const IconText = ({ icon, text, onSubmit }: { icon: any, text: string, onSubmit: () => void}) => (
  <Button htmlType='submit' type='primary' onClick={onSubmit}>
    {createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </Button>
);

function Certificate(props: CertificateProps) {
  const [isPassed, setIsPassed] = useState<boolean | undefined>(undefined);

  const generateCert = (dataUser: AnyObject) => {
    alert('Ok, aquí descarga el certificado');
  };

  useEffect(() => {
    if (!props.cEventUser?.value?._id) return;
    if (!props.cEvent?.value?._id) return;

    (async () => {
      const surveys: Survey[] = await SurveysApi.byEvent(props.cEvent?.value?._id);

      let passed = 0;
      let notPassed = 0;

      for (let i = 0; i < surveys.length; i++) {
        const survey: Survey = surveys[i] as never;
        const stats = await useAsyncPrepareQuizStats(
          props.cEvent?.value?._id,
          survey._id!,
          props.cEventUser?.value?._id,
          survey,
        );

        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            passed = passed + 1;
          } else {
            notPassed = notPassed + 1;
          }
        }
      }

      if (passed === surveys.length) {
        setIsPassed(true);
      } else if (notPassed < surveys.length) {
        setIsPassed(false);
      }
    })();
  }, [props.cEventUser?.value, props.cEvent?.value?._id]);

  return (
    <>
    <Row gutter={[8, 8]} wrap justify='center'>
      <Col span={24}>
        <Card>
          Hola))
          <p>{props.cEvent?.value?._id}</p>
          <p>{props.cEventUser?.value?._id}</p>
          {isPassed ? 'sí' : 'no'}
          {isPassed === undefined && (
            <Spin>Cargando...</Spin>
          )}
          {!isPassed && (
            <Alert message='Certificados NO disponibles' type='error' />
          )}
          {isPassed ||1 && (
            <>
            <Alert message='Certificados disponibles' type='success' />
            <IconText
              text='Descargar certificado'
              icon={DownloadOutlined}
              onSubmit={() => generateCert(props.cEventUser.value)}
            />
            </>
          )}
        </Card>
      </Col>
    </Row>
    </>
  );
}

const Component = withContext((props: any) => <Certificate {...props} />);
export default withRouter((props: any) => <Component {...props} />);
