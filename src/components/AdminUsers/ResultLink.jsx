import React from 'react';
import { Spin, Result, Button, Typography, Grid } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import logo from '../../logo.svg';

const { useBreakpoint } = Grid;

const ResultLink = ({ status, data, event }) => {
  const screens = useBreakpoint();
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
              {status === 'loading' ? 'Iniciando la sesión...' : 'Acceso denegado'}
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
                    key='goToEvius'>
                    Ir a Evius
                  </Button>,
                ]
          }
        />
      </div>
    </div>
  );
};

export default ResultLink;
