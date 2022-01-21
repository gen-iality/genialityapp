import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

function NoMatchPage(props) {
  return (
    <Result
      status='error'
      title='Lo sentimos!'
      subTitle={
        <div>
          Lamentablemente la ruta actual <div>{props.eventId && <code>{props.location.pathname}</code>}</div> no está
          disponible
        </div>
      }
      extra={[
        props?.path ? (
          <Link to={`${props.path}/main`}>
            <Button type='primary' key='eventData'>
              Ir a datos del evento
            </Button>
          </Link>
        ) : (
          <Link to={`/`}>
            <Button type='primary' key='eventData'>
              Ver más eventos
            </Button>
          </Link>
        ),

        <Link to={`/landing/${props.eventId ? props.eventId : props.match.params.id}`}>
          <Button key='moreEvents'>Ir a la landing de este evento</Button>
        </Link>,
      ]}
    />
  );
}

export default NoMatchPage;
