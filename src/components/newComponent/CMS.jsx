import { useEffect, useState } from 'react';
import { handleRequestError } from '../../helpers/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { DispatchMessageService } from '../../context/MessageService';
import Loading from '../profile/loading';
import Service from '../agenda/roomManager/service';
import { firestore, fireRealtime } from '@/helpers/firebase';
import { deleteLiveStream, deleteAllVideos } from '@/adaptors/gcoreStreamingApi';
const { confirm } = Modal;

const CMS = (props) => {
  const {
    API,
    eventId,
    title,
    titleTooltip,
    back,
    addUrl,
    columns,
    key,
    pagination,
    actions,
    editPath,
    search,
    setColumnsData,
    draggable,
    downloadFile,
    exportData,
    fileName,
    extra,
    addFn,
    editFn,
    extraFn,
    extraFnIcon,
    extraFnTitle,
    extraFnType,
    description,
    form,
    save,
    saveMethod,
    titleTable,
    noRemove,
    extraPath,
    extraPathTitle,
    extraPathIcon,
    extraPathType,
    extraPathId,
    extraPathStateName,
    scroll,
    widthAction,
    deleteCallback,
    extraPathUpdate,
    extraPathUpdateTitle,
  } = props;
  //API que sería a cual servicio llamar, para hacer los submit y remove y cualquier otra acción
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  let { reloadTemplatesCms } = useHelper();

  useEffect(() => {
    getList();
  }, [reloadTemplatesCms]);

  const getList = async () => {
    const data = await API.byEvent(eventId);
    if (data.data) {
      setList(
        data.data.sort(function(a, b) {
          return a.created_at.localeCompare(-b.created_at);
        })
      );
    } else {
      setList(
        data.sort(function(a, b) {
          return a.created_at.localeCompare(-b.created_at);
        })
      );
    }
    setLoading(false);
  };

  const remove = (id, name) => {
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        DispatchMessageService({
          type: 'loading',
          key: 'loading',
          msj: 'Por favor espere mientras se borra la información...',
          action: 'show',
        });
        const onHandlerRemove = async () => {
          try {
            const refActivity = `request/${eventId}/activities/${id}`;
            const service = new Service(firestore);
            const configuration = await service.getConfiguration(eventId, id);
            if (configuration && configuration.typeActivity === 'eviusMeet') {
              await deleteAllVideos(name, configuration.meeting_id), await deleteLiveStream(configuration.meeting_id);
            }
            if (deleteCallback) await deleteCallback(id);
            await fireRealtime.ref(refActivity).remove();
            await service.deleteActivity(eventId, id);
            await API.deleteOne(id, eventId);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
            getList();
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: handleRequestError(e).message,
              action: 'show',
            });
          }
        };
        onHandlerRemove();
      },
    });
  };

  const updateMails = async (idMessage) => {
    setLoading(true);
    const updateMails = await API.updateOne(eventId, idMessage);
    await getList();
    DispatchMessageService({
      type: 'success',
      msj: updateMails?.message,
      action: 'show',
    });
    setLoading(false);
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
        description={description}
        form={form}
        save={save}
        saveMethod={saveMethod}
      />

      {/* {list.length > 0 ? ( */}
      <Table
        header={columns}
        loading={loading}
        list={list}
        setList={setList}
        key={key}
        pagination={pagination}
        actions={actions}
        editPath={editPath}
        editFn={editFn}
        remove={remove}
        noRemove={noRemove}
        search={search}
        setColumnsData={setColumnsData}
        draggable={draggable}
        downloadFile={downloadFile}
        exportData={exportData}
        fileName={fileName}
        extraFn={extraFn}
        extraFnIcon={extraFnIcon}
        extraFnTitle={extraFnTitle}
        extraFnType={extraFnType}
        titleTable={titleTable}
        extraPath={extraPath}
        extraPathTitle={extraPathTitle}
        extraPathIcon={extraPathIcon}
        extraPathType={extraPathType}
        extraPathId={extraPathId}
        extraPathStateName={extraPathStateName}
        scroll={scroll} //Bien se puede pasar un auto, y toma el scroll de ser necesario
        widthAction={widthAction}
        extraPathUpdate={extraPathUpdate}
        extraPathUpdateTitle={extraPathUpdateTitle}
        updateMails={updateMails}
      />
      {/* ) : (
        <Loading />
      )} */}
    </div>
  );
};

export default CMS;
