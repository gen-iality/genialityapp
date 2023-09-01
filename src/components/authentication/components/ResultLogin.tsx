import { Card, Result, Typography } from 'antd';
import React, { useEffect } from 'react';
import { app } from '../../../helpers/firebase';
import { UseUserEvent } from '../../../context/eventUserContext';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import { DataUserInterface } from '../types';
import Loading from '@/components/profile/loading';
import { useHistory } from 'react-router';

export default function ResultLogin({ status, user, eventId, close, bgColor }: { status: 'loading' | 'error' | 'success' , user : DataUserInterface, eventId: string, close: ()=> void, bgColor: string}) {
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
          <Card>
            <Result 
              style={{ padding: '30px 0', borderRadius: 20, backgroundColor: '#FFFFFF50', border: 'none' }}
              status='success' 
              title={<Typography.Title level={5}>¡Felicidades!</Typography.Title>} 
              subTitle={<Typography.Text strong>Pronto entraras al evento</Typography.Text>}
            />
          </Card>
        )}
        {status === 'error' && (
          <Result  
            style={{ padding: '30px 0', borderRadius: 20, backgroundColor: '#FFFFFF50', border: 'none' }}
            status='error' 
            title={<Typography.Title level={5}>¡Ups!</Typography.Title>} 
            subTitle={<Typography.Text strong>Algo salio mal</Typography.Text>}
          />
          
        )}
    </div>
  )
}
