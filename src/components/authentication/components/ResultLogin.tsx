import { Result } from 'antd';
import React, { useEffect } from 'react';
import { app } from '../../../helpers/firebase';
import { UseUserEvent } from '../../../context/eventUserContext';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import { DataUserInterface } from '../types';
import Loading from '@/components/profile/loading';
import { useHistory } from 'react-router';

export default function ResultLogin({ status, user, eventId, close }: { status: 'loading' | 'error' | 'success' , user : DataUserInterface, eventId: string, close: ()=> void}) {
  const cEventUser = UseUserEvent();
  let { helperDispatch } = useHelper();

  useEffect(() => {
    const loginFirebase = async () => {
      
      app
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((response) => {
          if (response.user) {
            cEventUser.setUpdateUser(true);
            helperDispatch({ type: 'showLogin', visible: false });
            window.location.pathname = `/${eventId}`
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if(status === 'success'){ 
      loginFirebase();
    }
  }, [status]);

  return (
    <div>
        {status === 'loading' && (
           <Loading/>
        )}
        {status === 'success' && (
            <Result status='success' title='Felicidades !' subTitle='Pronto entraras al evento' />
        )}
        {status === 'error' && (
            <Result  status='error' title='Ups !' subTitle='Algo salio mal' />
        )}
    </div>
  )
}
