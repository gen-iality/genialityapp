import { Spin, Result, Button, Typography } from 'antd';
import { app } from 'helpers/firebase';
import { fieldNameEmailFirst } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import ResultLink from './ResultLink';

const WithCode = () => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const querystring = window.location.search;
    const params = new URLSearchParams(querystring);
    const email = params.get('email');
    const event = params.get('event_id');
    if (email) {
      setEmail(email);
      loginWithCode();
    }
    async function loginWithCode() {
      app
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          if (event && result) {
            window.location.href = `${window.location.origin}/landing/${event}`;
          } else {
            window.location.href = `${window.location.origin}`;
          }
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        })
        .catch((error) => {
          console.log('Error al loguearse..', error);
          setError(true);
          setLoading(false);
        });
    }
  }, []);
  return (
    <>
      {loading ? <ResultLink status='loading' data={email} /> : error ? <ResultLink status='error' data={email} /> : ''}
    </>
  );
};

export default WithCode;
