import { Card, Result } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { withRouter } from 'react-router';
import PayForm from './payRegister';
import { useIntl } from 'react-intl';

const MessageRegister = (props) => {
  const intl = useIntl();
  return (
    <>
      {props.match.params.type == 'pay' && <PayForm eventId={props.match.params.event_id} />}
      {props.match.params.type == 'free' && (
        <Card>
          <Result
            status='success'
            title={intl.formatMessage({ id: 'registration.message.success' })}
            subTitle={
              <h2 style={{ fontSize: '20px' }}>
                {intl.formatMessage({ id: 'registration.message.success.subtitle' })}
              </h2>
            }></Result>
        </Card>
      )}
    </>
  );
};

export default withRouter(MessageRegister);