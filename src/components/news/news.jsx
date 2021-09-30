import React, { useState, useEffect } from 'react';
import { NewsFeed, Actions } from '../../helpers/request';
import Loading from '../loaders/loading';
import Moment from 'moment';
import EventContent from '../events/shared/content';
import EvenTable from '../events/shared/table';
import TableAction from '../events/shared/tableAction';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import axios from 'axios/index';
import ImageInput from '../shared/imageInput';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';
import moment from 'moment';

const { confirm } = Modal;

const News = ( props ) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
    },
    {
      title: 'Fecha de Publicación',
      dataIndex: 'time',
      render(val, item) {
        return (
          <div>
            {moment(item.time).format('YYYY-DD-MM')}
          </div>
        )
      }
    }
  ];

  useEffect(() => {
    getNews();
  }, [])


  const getNews = async () => {
    const data = await NewsFeed.byEvent(props.event._id);    
    setList(data);
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
            await NewsFeed.deleteOne(id, props.event._id);
            message.destroy(loading.key);
            message.open({
              type: 'success',
              content: <> Se eliminó la información correctamente!</>,
            });
            getNews();
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
  
  return(
    <div>
      <Header
        title={'Noticias'}
        titleTooltip={'Agregue o edite las Noticias que se muestran en la aplicación'}
        addUrl={{
          pathname: `${props.match.url}/new`,
          state: { new: true },
        }}
      />

      <Table 
        header={columns}
        loading={loading}
        list={list}
        key='_id'
        pagination={false}
        actions
        editPath={`${props.match.url}/new`}
        remove={remove}
      />
    </div>
  )
}

export default withRouter(News);
