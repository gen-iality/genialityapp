import { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Table, Tag, Row, Col, Tooltip, Button, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';

const { confirm } = Modal;

const AgendaTypeCat = (props) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(
  [
    {
      title: 'Nombre',
      dataIndex: 'name',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      render(val, item) {
        return (
          <Tag color={val} style={{'width': '70px'}}>
            {val}
          </Tag>
        )
      }
    },
    {
      title: 'Opciones',
      dataIndex: 'options',
      render(val, item) {      
        return (
          <Row wrap gutter={[8, 8]}>
            <Col >
              <Tooltip placement='topLeft' title='Editar Categoría' >
                <Link 
                  key='edit' 
                  to={{ pathname: `${props.matchUrl}/categorias/categoria`, state: { edit: item._id } }}
                >
                  <Button icon={<EditOutlined />} type='primary' size="small" />
                </Link>
              </Tooltip>
            </Col>
            <Col >
              <Tooltip placement='topLeft' title='Eliminar Categoría' >
                <Button
                  key='delete'
                  onClick={() => remove(item._id)}
                  icon={<DeleteOutlined />}
                  type='danger'
                  size="small"
                />
              </Tooltip>
            </Col>    
          </Row>
        );
      },
    }
  ]);
  const eventID = props.event._id;
  const subject = props.match.url.split('/').slice(-1)[0];
  const apiURL = subject === 'categorias' ? CategoriesAgendaApi : TypesAgendaApi;
  /* const headers = subject === 'categorias' ? ['Nombre', 'Color', ''] : ['Nombre', '']; */

  useEffect(() => {
    getList();
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
      title: `¿Está seguro de eliminar la categoría?`,
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
              content: <> Se eliminó categoría correctamente!</>,
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
        columns={columns}
        loading={loading}
        dataSource={list}
        hasData={list.length}
        pagination={false}
        rowKey='_id'
      />
    </div>
  );
}

export default withRouter(AgendaTypeCat);
