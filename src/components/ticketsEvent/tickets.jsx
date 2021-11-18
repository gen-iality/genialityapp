import React, { Fragment } from 'react';
import { eventTicketsApi } from '../../helpers/request';
import Moment from 'moment';
import CMS from '../newComponent/CMS';

const Tickets = (props) => {
  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
    },
    {
      title: 'Nombre',
      dataIndex: 'title',
    },
    {
      title: 'Permiso de Voto',
      dataIndex: 'allowed_to_vote',
      render (val, item) {
        return (
          <div>
            {item.allowed_to_vote ? 'Sí' : 'No'}
          </div>
        )
      }
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
      render (val, item) {
        return (
          <div>
            {Moment(item.created_at).format('DD/MM/YYYY')}
          </div>
        )
      }
    },
  ];

  return (
    <Fragment>
      <CMS 
        API={eventTicketsApi}
        eventId={props.event._id}
        title={'Tickets'}
        titleTooltip={'Agregue o edite los Tickets que se muestran en la aplicación'}
        addUrl={{
          pathname: `${props.matchUrl}/ticket`,
          state: { new: true },
        }}
        columns={columns}
        key='_id'
        editPath={`${props.matchUrl}/ticket`}
        pagination={false}
        actions
      />
    </Fragment>
  );
};

export default Tickets;
