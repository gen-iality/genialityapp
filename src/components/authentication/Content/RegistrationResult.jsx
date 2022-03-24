import { useContext, useEffect, useState } from 'react';
import { Result, Row, Space, Typography, Alert, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FrasesInspiradoras } from '../ModalsFunctions/utils';
import { app } from '../../../helpers/firebase';
import { UseUserEvent } from '../../../context/eventUserContext';
import HelperContext from '../../../context/HelperContext';
import { useIntl } from 'react-intl';
import { DispatchMessageService } from '../../../context/MessageService';

const RegistrationResult = ({ validationGeneral, basicDataUser }) => {
  const [fraseLoading, setfraseLoading] = useState('');

  useEffect(() => {
    let ramdon = Math.floor(Math.random() * FrasesInspiradoras.length);
    setfraseLoading(FrasesInspiradoras[ramdon]);
  }, []);

  useEffect(() => {
    //mientras el user espera se le dan frases motivadoras
    async function FraseInpiradora() {
      try {
        if (validationGeneral.loading) {
          let ramdon = Math.floor(Math.random() * FrasesInspiradoras.length);
          setfraseLoading(FrasesInspiradoras[ramdon]);
          console.log('FrasesInspiradoras[ramdon]', FrasesInspiradoras[ramdon]);
        }
      } catch (err) {
        console.log(err);
        DispatchMessageService({
          type: 'error',
          msj: 'Ha ocurrido un error',
          action: 'show',
        });
      }
    }

    let intervalFrase = setTimeout(() => {
      FraseInpiradora();
    }, 8000);

    return () => {
      clearInterval(intervalFrase);
    };
  });

  return (
    <>
      {validationGeneral.loading ? (
        <>
          <Row>
            <Typography.Text type='secondary' style={{ fontSize: '18px' }}>
              {fraseLoading}
            </Typography.Text>
          </Row>
        </>
      ) : (
        <>
          <Result status='success' title='¡Registro exitoso!' />
          <RedirectUser basicDataUser={basicDataUser} />
        </>
      )}
    </>
  );
};

const RedirectUser = ({ basicDataUser }) => {
  const cEventUser = UseUserEvent();
  let { HandleControllerLoginVisible, authModalDispatch } = useContext(HelperContext);
  const intl = useIntl();
  const [signInWithEmailAndPasswordError, setSignInWithEmailAndPasswordError] = useState(false);

  useEffect(() => {
    setSignInWithEmailAndPasswordError(false);
    const loginFirebase = async () => {
      app
        .auth()
        .signInWithEmailAndPassword(basicDataUser.email, basicDataUser.password)
        .then((response) => {
          if (response.user) {
            cEventUser.setUpdateUser(true);
            HandleControllerLoginVisible({
              visible: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setSignInWithEmailAndPasswordError(true);
        });
    };

    let loginInterval = setTimeout(() => {
      loginFirebase();
    }, 5000);

    return () => {
      clearInterval(loginInterval);
    };
  }, []);

  return (
    <>
      <Space>
        <Typography.Text type='secondary' style={{ fontSize: '18px' }}>
          {signInWithEmailAndPasswordError ? (
            <Alert
              style={{ marginTop: '5px' }}
              message={
                <>
                  {intl.formatMessage({
                    id: 'modal.feedback.errorAutomaticSession',
                    defaultMessage: 'Ha fallado el inicio de sesión automático, por favor',
                  })}
                  <Button
                    style={{ padding: 4, color: '#333F44', fontWeight: 'bold' }}
                    onClick={() => {
                      authModalDispatch({ type: 'showLogin' });
                    }}
                    type='link'>
                    {intl.formatMessage({
                      id: 'modal.feedback.title.errorlink',
                      defaultMessage: 'iniciar sesión',
                    })}
                  </Button>
                </>
              }
              type='error'
            />
          ) : (
            <>
              <LoadingOutlined style={{ fontSize: '28px' }} />
              {intl.formatMessage({
                id: 'register.result.logging_in',
                defaultMessage: 'Iniciando sesión con tu cuenta!',
              })}
            </>
          )}
        </Typography.Text>
      </Space>
    </>
  );
};

export default RegistrationResult;
