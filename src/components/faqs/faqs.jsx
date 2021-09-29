import React, { useState, useEffect } from 'react';
import { FaqsApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';

const { confirm } = Modal;

const Faqs = (props) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
    },
    {
      title: 'Contenido',
      dataIndex: 'content',
      render(val, item) {
        return (
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        )
      }
    }
  ];

  useEffect(() => {
    getFaqs();
  }, [])

  const getFaqs = async () => {
    const data = await FaqsApi.byEvent(props.event._id);
    setList(data);
    setLoading(false);
    console.log(data);
  };

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
            await FaqsApi.deleteOne(id, props.event._id);
            message.destroy(loading.key);
            message.open({
              type: 'success',
              content: <> Se eliminó la información correctamente!</>,
            });
            getFaqs();
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
        title={'Preguntas Frecuentes'}
        titleTooltip={'Agregue o edite las Preguntas Frecuentes que se muestran en la aplicación'}
        addUrl={{
          pathname: `${props.matchUrl}/faq`,
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
        editPath={`${props.matchUrl}/faq`}
        remove={remove}
      />
    </div>
  );
}

export default Faqs;
