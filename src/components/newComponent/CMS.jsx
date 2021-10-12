import { useEffect, useState } from 'react';
import { handleRequestError } from '../../helpers/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';

const { confirm } = Modal;

const CMS = ( props ) => {
  const {  API, eventId, title, titleTooltip, back, addUrl, columns, key, pagination, actions, editPath, 
    search, setColumnsData, draggable, downloadFile, exportData, fileName, extra, addFn, editFn
  } = props;
  //API que sería a cual servicio llamar, para hacer los submit y remove y cualquier otra acción
  const [ list, setList ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    getList();
  }, [])

  const getList = async () => {
    const data = await API.byEvent(eventId);
    if(data.data){
      setList(data.data);
    } else {
      setList(data);
    }
    setLoading(false);
  }

  const remove = (id) => {
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
            await API.deleteOne(id, eventId);
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
        title={title}
        titleTooltip={titleTooltip}
        back={back}
        addUrl={addUrl}
        extra={extra}
        addFn={addFn}
      />

      <Table 
        header={columns}
        loading={loading}
        list={list}
        /* setList={setList} */
        key={key}
        pagination={pagination}
        actions={actions}
        editPath={editPath}
        editFn={editFn}
        remove={remove}
        search={search}
        setColumnsData={setColumnsData}
        draggable={draggable}
        downloadFile={downloadFile}
        exportData={exportData}
        fileName={fileName}
      />
    </div>
  )
}

export default CMS;