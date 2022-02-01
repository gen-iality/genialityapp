import { ControlOutlined } from '@ant-design/icons';
import { Spin, Result, Button, Typography } from 'antd';
import { app, firestore } from 'helpers/firebase';
import { EventsApi } from 'helpers/request';
import { fieldNameEmailFirst } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import ResultLink from './ResultLink';

const WithCode = () => {
  const [email, setEmail] = useState();
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [verifyLink, setVerifyLink] = useState(false);
  const conectionRef = firestore.collection(`connections`);
  useEffect(() => {
    //REFERENCIA FIRESTORE

    const querystring = window.location.search;
    const params = new URLSearchParams(querystring);
    let email = params.get('email');
    const event = params.get('event_id');
    if (email) {
      setEmail(email);
      setEvent(event);
      email = email.replace('%40', '@');
      conectionRef
        .where('email', '==', email)
        .get()
        .then((resp) => {
          if (resp.docs.length == 0) {
            loginWithCode();
          } else {
            setError(true);
            setLoading(false);
          }
        });
    }
    async function loginWithCode() {
      app
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          setVerifyLink(true);
          if (event && result) {
            window.location.href = `${window.location.origin}/landing/${event}`;
          } else {
            window.location.href = `${window.location.origin}`;
          }
        })
        .catch(async (error) => {
          console.log('Error al loguearse1..', error);
          let refreshLink;
          if (event) {
            refreshLink = await EventsApi.refreshLinkEmailUserEvent(email, event);
          } else {
            refreshLink = await EventsApi.refreshLinkEmailUser(email);
          }
          if (refreshLink) {
            window.location.href = refreshLink;
            /*fetch(refreshLink).then((result) => {
              if (event && result) {
                console.log('RESULTACA===>', result);
                // window.location.href = `${window.location.origin}/landing/${event}`;
              } else {
                window.location.href = `${window.location.origin}`;
              }
            });*/
          } else {
            console.log('NOT REQUEST');
          }
        });
    }
  }, []);
  return (
    <>
      {loading ? (
        <ResultLink status='loading' verifyLink={verifyLink} data={email} />
      ) : error ? (
        <ResultLink status='error' data={email} event={event} />
      ) : (
        ''
      )}
    </>
  );
};

export default WithCode;
