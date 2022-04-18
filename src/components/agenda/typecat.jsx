import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import { Tag } from 'antd';
import CMS from '../newComponent/CMS';

const AgendaTypeCat = (props) => {
  const columnsOriginal = [
    {
      title: 'Nombre',
      dataIndex: 'name',
    },
  ];
  const [columns, setColumns] = useState([]);
  const eventID = props.event._id;
  const subject = props.match.url.split('/').slice(-1)[0];
  const apiURL = subject === 'categorias' ? CategoriesAgendaApi : TypesAgendaApi;

  useEffect(() => {
    if (subject === 'categorias') {
      /*Validación que me permite anexar en las columnas el campo de color en caso de que 'subjet' sea 'categoria'*/
      columnsOriginal.splice(1, 0, {
        title: 'Color',
        dataIndex: 'color',
        render(val, item) {
          return (
            <Tag color={val} style={{ width: '70px' }}>
              {val}
            </Tag>
          );
        },
      });
    }
    setColumns(columnsOriginal);
  }, []);

  return (
    <CMS
      API={apiURL}
      eventId={eventID}
      title={`${subject === 'categorias' ? 'Categorías' : 'Tipos'} de Actividad`}
      //back
      titleTooltip={'Agregue o edite las Preguntas Frecuentes que se muestran en la aplicación'}
      addUrl={{
        pathname: `${props.matchUrl}/add${subject}`,
        state: { new: true },
      }}
      columns={columns}
      key='_id'
      editPath={`${props.matchUrl}/edit${subject}`}
      pagination={false}
      actions
    />
  );
};

export default withRouter(AgendaTypeCat);
