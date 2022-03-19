import { useState } from 'react';
import { Result, Button, Typography, Grid } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import logo from '../../logo.svg';
import { firestore } from '../../helpers/firebase';
import { useIntl } from 'react-intl';

const { useBreakpoint } = Grid;

const ResultLink = ({ status, data, event, verifyLink }) => {
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  // statust -> loading || error
  status = status ? status : 'loading';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#ECF2F7',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          width: `${screens.xs ? '90%' : '60%'}`,
          height: `${screens.xs ? '80%' : '70%'}`,
          borderRadius: '25px',
        }}>
        <img
          onClick={() => {
            window.location.href = `${window.location.origin}`;
          }}
          style={{
            cursor: 'pointer',
            height: `${screens.xs ? '20px' : '30px'}`,
            position: 'absolute',
            bottom: `${screens.xs ? '4%' : '6%'}`,
            // right: `${screens.xs ? '10%' : '22%'}`,
          }}
          src={logo}
          alt='logo'
        />
        <Result
          icon={status === 'loading' && <LoadingOutlined />}
          status={status === 'loading' ? null : 'info'}
          title={
            <Typography.Title level={screens.xs ? 2 : 1}>
              {status === 'loading' && verifyLink
                ? intl.formatMessage({
                    id: 'result_link.title.logging_in',
                    defaultMessage: 'Iniciando la sesión...',
                  })
                : status === 'loading' && !verifyLink
                ? intl.formatMessage({
                    id: 'result_link.title.checking_link',
                    defaultMessage: 'Verificando link',
                  })
                : intl.formatMessage({
                    id: 'result_link.title.another_device',
                    defaultMessage: 'Ya has iniciado la sesión en otro dispositivo',
                  })}
            </Typography.Title>
          }
          subTitle={
            status === 'loading' ? null : (
              <Typography.Paragraph
                type='secondary'
                style={{
                  fontSize: `${screens.xs ? '14px' : '18px'}`,
                  overflowWrap: 'anywhere',
                }}>
                {intl.formatMessage({
                  id: 'result_link.description',
                  defaultMessage:
                    'Si quieres acceder a la plataforma en este dispositivo has clic en Continuar y cerraremos tu sesión en el otro dispositivo que tienes vinculado, de lo contrario dar clic en Cancelar.',
                })}
              </Typography.Paragraph>
            )
          }
          extra={
            status === 'loading'
              ? null
              : [
                  <Button
                    onClick={() => {
                      window.location.href = `${window.location.origin}`;
                    }}
                    size='large'
                    type='text'
                    disabled={loading}
                    key='goToEvius'>
                    {intl.formatMessage({
                      id: 'header.confirm.cancelText',
                      defaultMessage: 'Cancelar',
                    })}
                  </Button>,
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      const conectionRef = firestore.collection(`connections`);
                      const docRef = await conectionRef.where('email', '==', data).get();
                      if (docRef.docs.length > 0) {
                        //console.log('DOCUMENT ID==>', docRef.docs[0].id);
                        await conectionRef.doc(docRef.docs[0].id).delete();
                        setLoading(false);
                        window.location.href = window.location.href;
                      }
                      setLoading(false);
                    }}
                    size='large'
                    loading={loading}
                    type='primary'
                    key='goToEvius'>
                    {intl.formatMessage({
                      id: 'result_link.continue',
                      defaultMessage: 'Continuar',
                    })}
                  </Button>,
                ]
          }
        />
      </div>
    </div>
  );
};

export default ResultLink;
