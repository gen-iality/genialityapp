import React, { useContext, useEffect, useState } from 'react';
import { Result, Row, Typography } from 'antd';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FrasesInspiradoras } from '../ModalsFunctions/utils';
import { app } from 'helpers/firebase';
import { UseUserEvent } from 'Context/eventUserContext';
import HelperContext from 'Context/HelperContext';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const RegistrationResult = ({ validationGeneral, basicDataUser }) => {
  const [fraseLoading, setfraseLoading] = useState('');

  useEffect(() => {
    let ramdon = Math.floor(Math.random() * FrasesInspiradoras.length);
    setfraseLoading(FrasesInspiradoras[ramdon]);
  }, []);

  useEffect(() => {
    //mientras el user espera se le dan frases motivadoras
    async function FraseInpiradora() {
      if (validationGeneral.loading) {
        let ramdon = Math.floor(Math.random() * FrasesInspiradoras.length);
        setfraseLoading(FrasesInspiradoras[ramdon]);
        console.log('FrasesInspiradoras[ramdon]', FrasesInspiradoras[ramdon]);
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
  let { HandleControllerLoginVisible } = useContext(HelperContext);

  useEffect(() => {
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
      <Spin icon={antIcon} />
      <Typography.Text type='secondary' style={{ fontSize: '18px' }}>
        Iniciando sesión con tu cuenta!
      </Typography.Text>
    </>
  );
};

export default RegistrationResult;
