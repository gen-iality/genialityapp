import { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Tag, Row, Col, Tooltip, Button, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';

const { confirm } = Modal;

const AgendaTypeCat = (props) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const columnsOriginal = [
    {
      title: 'Nombre',
      dataIndex: 'name',
    }
  ];
  const [columns, setColumns ] = useState([]);
  const eventID = props.event._id;
  const subject = props.match.url.split('/').slice(-1)[0];
  const apiURL = subject === 'categorias' ? CategoriesAgendaApi : TypesAgendaApi;

  useEffect(() => {
    getList();
    if(subject === 'categorias'){
      /*Validación que me permite anexar en las columnas el campo de color en caso de que 'subjet' sea 'categoria'*/
      columnsOriginal.splice(1,0, {
        title: 'Color',
        dataIndex: 'color',
        render(val, item) {
          return (
            <Tag color={val} style={{'width': '70px'}}>
              {val}
            </Tag>
          )
        }
      });
    } 
    setColumns(columnsOriginal);
  }, [])

  const getList = async () => {
    const response = await apiURL.byEvent(eventID);
    setList(response);
    setLoading(false);
  }

  const remove = async (id) => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
    });
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          try {
            await apiURL.deleteOne(id, eventID);
            message.destroy(loading.key);
            message.open({
              type: 'success',
              content: <> Se eliminó la información correctamente!</>,
            });
            getList();
          } catch (e) {
            message.destroy(loading.key);
            message.open({
              type: 'error',
              content: handleRequestError(e).message,
            });
          }
        }
        onHandlerRemove();
      }
    });
  };

  return (
    <div>
      <Header 
        title={`${subject === 'categorias' ? 'Categorías' : 'Tipos'} de Actividad`}
        back
        addUrl={{ 
          pathname: `${props.matchUrl}/categorias/categoria`, 
          state: { new: true }
        }}
      />
      
      <Table 
        header={columns}
        loading={loading}
        list={list}
        key='_id'
        pagination={false}
        actions
        editPath={`${props.matchUrl}/categorias/categoria`}
        remove={remove}
      />
    </div>
  );
}

export default withRouter(AgendaTypeCat);
