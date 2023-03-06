import { useEffect, useState, createElement, useMemo } from 'react';
import dayjs from 'dayjs';
import { Row, Col, Card, Spin, Alert, Button, Modal, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import withContext from '@context/withContext';
import { AgendaApi, CertsApi, RolAttApi, SurveysApi } from '@helpers/request';
import { SurveyData } from '@components/events/surveys/types';
import useAsyncPrepareQuizStats from '../quiz/useAsyncPrepareQuizStats';
import { DownloadOutlined } from '@ant-design/icons';

import { activityContentValues } from '@context/activityType/constants/ui';

import certificateImage from './certificateImage';
import { firestore } from '@helpers/firebase';
import AgendaType from '@Utilities/types/AgendaType';

type CurrentEventAttendees = any; // TODO: define this type and move to @Utilities/types/

export interface CertificateProps {
  cEvent?: any
  cEventUser?: any,
  cUser?: any
};

// const originalContent = '<p><br></p><p><br></p><p>Certificamos que</p><p>[user.names],</p><p>completó con éxito el curso</p><p>[event.name]</p><p>realizado del [event.start] al [event.end].';
const originalContent = '';
const tags = [
  { tag: 'event.name', label: 'Nombre del Cursos', value: 'name' },
  { tag: 'event.start', label: 'Fecha inicio del Cursos', value: 'datetime_from' },
  { tag: 'event.end', label: 'Fecha fin del Cursos', value: 'datetime_to' },
  { tag: 'event.venue', label: 'Lugar del Cursos', value: 'venue' },
  { tag: 'event.address', label: 'Dirección del Cursos', value: 'location.FormattedAddress' },
  { tag: 'user.names', label: 'Nombre(s) de asistente', value: 'names' },
  { tag: 'user.email', label: 'Correo de asistente', value: 'email' },
  { tag: 'ticket.name', label: 'Nombre del tiquete', value: 'ticket.title' },
  { tag: 'rol.name', label: 'Nombre del Rol' },
];


const IconText = ({ icon, text, onSubmit }: { icon: any, text: string, onSubmit: () => void}) => (
  <Button htmlType="submit" type="primary" onClick={onSubmit}>
    {createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </Button>
);

function Certificate(props: CertificateProps) {
  const [wereEvaluationsPassed, setWereEvaluationsPassed] = useState<boolean | undefined>(undefined);

  const [activitiesAttendee, setActivitiesAttendee] = useState<CurrentEventAttendees[]>([]);
  const [allActivities, setAllActivities] = useState<AgendaType[]>([]);

  const background = certificateImage;

  const generateCert = async (dataUser: any) => {
    const modal = Modal.success({
      title: 'Generando certificado',
      content: <Spin>Espera</Spin>,
    });

    const certs = await CertsApi.byEvent(props.cEvent.value._id);
    const roles = await RolAttApi.byEvent(props.cEvent.value._id);
    const currentEvent = { ...props.cEvent.value }; 
    currentEvent.datetime_from = dayjs(currentEvent.datetime_from).format('DD/MM/YYYY');
    currentEvent.datetime_to = dayjs(currentEvent.datetime_to).format('DD/MM/YYYY');
    //Por defecto se trae el certificado sin rol
    let rolCert = certs.find((cert: any) => !cert.rol_id);
    //Si el asistente tiene rol_id y este corresponde con uno de los roles attendees, encuentra el certificado ligado
    const rolValidation = roles.find((rol: any) => rol._id === dataUser.rol_id);
    if (dataUser.rol_id && rolValidation)
      rolCert = certs.find((cert: any) => {
        return cert.rol._id === dataUser.rol_id;
      });
    let content = rolCert?.content ? rolCert?.content : originalContent;
    tags.map((item: any) => {
      let value;
      if (item.tag.includes('event.')) value = currentEvent[item.value];
      else if (item.tag.includes('ticket.')) value = dataUser.ticket;
      else if (item.tag.includes('rol.')) {
        if (dataUser.rol_id && roles.find((ticket: any) => ticket._id === dataUser.rol_id))
          value = roles.find((ticket: any) => ticket._id === dataUser.rol_id).name.toUpperCase();
        else value = 'ASISTENTE';
      } else value = dataUser.properties[item.value];
      return (content = content.replace(`[${item.tag}]`, value));
    });
    const body = { content, image: rolCert?.background ? rolCert?.background : background };
    const file = await CertsApi.generateCert(body);
    const blob = new Blob([file.blob], { type: file.type, charset: 'UTF-8' });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.dataType = 'json';
    link.href = data;
    link.download = 'certificado.pdf';
    link.dispatchEvent(new MouseEvent('click'));
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      modal.destroy();
    }, 60);
  };

  useEffect(() => {
    if (!props.cUser?.value?._id) return;
    if (!props.cEvent?.value?._id) return;

    // Take data to the evaluation certificates
    (async () => {
      const surveys: SurveyData[] = await SurveysApi.byEvent(props.cEvent?.value?._id);

      let passed = 0;
      let notPassed = 0;

      for (let i = 0; i < surveys.length; i++) {
        const survey: SurveyData = surveys[i] as never;
        const stats = await useAsyncPrepareQuizStats(
          props.cEvent?.value?._id,
          survey._id!,
          props.cUser?.value?._id,
          survey,
        );

        console.debug('stats', stats)
        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            passed = passed + 1;
          } else {
            notPassed = notPassed + 1;
          }
        }
      }

      console.debug('passed', passed)
      console.debug('surveys.length', surveys.length)
      if ((surveys.length >  0) && passed === surveys.length ) {
        setWereEvaluationsPassed(true);
      } else if ((surveys.length === 0) || notPassed < surveys.length) {
        setWereEvaluationsPassed(false);
      }
    })();

    // Take the date for the finished course certificate
    (async () => {
      if (!props.cEvent?.value) return;
      if (!props.cEventUser?.value) return;
      console.log('start finding course stats')

      setActivitiesAttendee([]);

      const activityFilter = (a: any) => ![activityContentValues.quizing, activityContentValues.survey].includes(a.type?.name)

      const { data }: { data: AgendaType[] } = await AgendaApi.byEvent(props.cEvent.value._id);
      const filteredData = data.filter(activityFilter);

      setAllActivities(filteredData);
      const existentActivities = filteredData.map(async (activity) => {
        const activityAttendee = await firestore
          .collection(`${activity._id}_event_attendees`)
          .doc(props.cEventUser?.value?._id)
          .get(); //checkedin_at
        if (activityAttendee.exists) return activityAttendee.data() as CurrentEventAttendees;
        return null;
      });
      // Filter existent activities and set the state
      setActivitiesAttendee(
        // Promises don't bite :)
        (await Promise.all(existentActivities)).filter((item) => !!item),
      );
    })();
  }, [props.cUser?.value, props.cEvent?.value, props.cEventUser?.value]);

  const progressPercentValue: number = useMemo(
    () => Math.round(((activitiesAttendee.length || 0) / (allActivities.length || 0)) * 100),
    [activitiesAttendee, allActivities],
  );

  return (
    <>
    <Row gutter={[8, 8]} wrap justify="center">
      <Col span={24}>
        <Card>
          {wereEvaluationsPassed === undefined && (
            <Spin>Cargando...</Spin>
          )}
          {!wereEvaluationsPassed && (
            <>
              <Alert message="Certificado de evaluaciones NO disponible" type="error" />
              <br />
            </>

          )}
          {(wereEvaluationsPassed) && (
            <>
            <Alert message="Certificado de evaluaciones disponible" type="success" />
            <br />
            <IconText
              text="Descargar certificado de evaluaciones"
              icon={DownloadOutlined}
              onSubmit={() => generateCert(props.cEventUser.value)}
            />
            </>
          )}
          {progressPercentValue === 100 && (
            <>
            <Alert message="Certificado de curso completo" type="success" />
            <br />
            <IconText
              text="Descargar certificado de curso"
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
