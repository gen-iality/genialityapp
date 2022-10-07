import * as React from 'react';
import { useEffect, useState, createElement } from 'react';
import dayjs from 'dayjs';
import { Row, Col, Card, Spin, Alert, Button, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import withContext from '@context/withContext';
import { CertsApi, RolAttApi, SurveysApi } from '@helpers/request';
import { Survey } from '../quiz/types';
import useAsyncPrepareQuizStats from '../quiz/useAsyncPrepareQuizStats';
import { DownloadOutlined } from '@ant-design/icons';

import certificateImage from './certificateImage';

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
  <Button htmlType='submit' type='primary' onClick={onSubmit}>
    {createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </Button>
);

function Certificate(props: CertificateProps) {
  const [isPassed, setIsPassed] = useState<boolean | undefined>(undefined);

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

    (async () => {
      const surveys: Survey[] = await SurveysApi.byEvent(props.cEvent?.value?._id);

      let passed = 0;
      let notPassed = 0;

      for (let i = 0; i < surveys.length; i++) {
        const survey: Survey = surveys[i] as never;
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
      if (passed === surveys.length) {
        setIsPassed(true);
      } else if (notPassed < surveys.length) {
        setIsPassed(false);
      }
    })();
  }, [props.cUser?.value, props.cEvent?.value?._id]);

  return (
    <>
    <Row gutter={[8, 8]} wrap justify='center'>
      <Col span={24}>
        <Card>
          {isPassed === undefined && (
            <Spin>Cargando...</Spin>
          )}
          {isPassed === false && (
            <Alert message='Certificados NO disponibles' type='error' />
          )}
          {(isPassed) && (
            <>
            <Alert message='Certificados disponibles' type='success' />
            <br />
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
