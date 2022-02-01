import React, { useState } from 'react';
import { Spin, Result, Button, Typography, Grid } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import logo from '../../logo.svg';
import { firestore } from 'helpers/firebase';

const { useBreakpoint } = Grid;

const ResultLink = ({ status, data, event, verifyLink }) => {
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
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
          status={status === 'loading' ? null : 'error'}
          title={
            <Typography.Title level={1}>
              {status === 'loading' && verifyLink
                ? 'Iniciando la sesión...'
                : status === 'loading' && !verifyLink
                ? 'Verificando link'
                : 'Acceso denegado'}
            </Typography.Title>
          }
          subTitle={
            status === 'loading' ? null : (
              <Typography.Paragraph
                type='secondary'
                style={{
                  fontSize: `${screens.xs ? '14px' : '18px'}`,
                  maxWidth: '550px',
                  overflowWrap: 'anywhere',
                }}>
                El enlace enviado a {data} ya fue usado, ingrese al evento para solicitar uno nuevo.
              </Typography.Paragraph>
            )
          }
          extra={
            status === 'loading'
              ? null
              : [
                  event && (
                    <Button
                      onClick={() => {
                        window.location.href = `${window.location.origin}/landing/${event}`;
                      }}
                      size='large'
                      type='primary'
                      key='goToEvent'>
                      Ir al evento
                    </Button>
                  ),
                  <Button
                    onClick={() => {
                      window.location.href = `${window.location.origin}`;
                    }}
                    size='large'
                    type='text'
                    disabled={loading}
                    key='goToEvius'>
                    Ir a Evius
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
                    type='text'
                    key='goToEvius'>
                    Iniciar la sesión acá
                  </Button>,
                ]
          }
        />
      </div>
    </div>
  );
};

export default ResultLink;
