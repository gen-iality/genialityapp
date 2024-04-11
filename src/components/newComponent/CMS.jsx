import { useEffect, useState } from "react";
import { handleRequestError } from "../../helpers/utils";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Header from "../../antdComponents/Header";
import Table from "../../antdComponents/Table";
import { useHelper } from "../../context/helperContext/hooks/useHelper";
import { DispatchMessageService } from "../../context/MessageService";
import Loading from "../profile/loading";
import Service from "../agenda/roomManager/service";
import { firestore, fireRealtime } from "@/helpers/firebase";
import {
  deleteLiveStream,
  deleteAllVideos,
} from "@/adaptors/gcoreStreamingApi";
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
    listLenght,
    messageHeaderAlert,
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

  const removeActivity = async (id, name, eventId) => {
    try {
      const refActivity = `request/${eventId}/activities/${id}`;
      const refActivityViewers = `viewers/${eventId}/activities/${id}`;
      const service = new Service(firestore);
      console.log(service);
      const configuration = await service.getConfiguration(eventId, id);
      console.log(configuration);
      if (configuration && configuration.typeActivity === "eviusMeet") {
        console.log("No validó para borrar");
        await Promise.all([
          deleteAllVideos(name, configuration.meeting_id),
          deleteLiveStream(configuration.meeting_id),
        ]);
      }

      if (deleteCallback) {
        console.log("valido deletecallback");
        await deleteCallback(id);
      }

      // await fireRealtime.ref(refActivity).remove();
      // await fireRealtime.ref(refActivityViewers).remove();
      if (configuration) {
        await service.deleteActivity(eventId, id);
      }
      await API.deleteOne(id, eventId);
      await getList();
      showSuccessMessage();
    } catch (e) {
      showErrorMessage(e);
    } finally {
      DispatchMessageService({ key: "loading", action: "destroy" });
    }
  };

  const showSuccessMessage = () => {
    DispatchMessageService({
      type: "success",
      msj: "Se eliminó la información correctamente!",
      action: "show",
    });
  };

  const showErrorMessage = (e) => {
    DispatchMessageService({
      type: "error",
      msj: handleRequestError(e).message,
      action: "show",
    });
  };

  const remove = (id, name) => {
    confirm({
      title: `¿Está seguro de eliminar la información? ${id}, ${name}, ${eventId}`,
      icon: <ExclamationCircleOutlined />,
      content: "Una vez eliminado, no lo podrá recuperar",
      okText: "Borrar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: () => {
        DispatchMessageService({
          type: "loading",
          key: "loading",
          msj: "Por favor espere mientras se borra la información...",
          action: "show",
        });
        console.log("dasdasdasd");
        removeActivity(id, name, eventId);
      },
    });
  };

  const updateMails = async (idMessage) => {
    setLoading(true);
    const updateMails = await API.updateOne(eventId, idMessage);
    await getList();
    DispatchMessageService({
      type: "success",
      msj: updateMails?.message,
      action: "show",
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
        listLenght={listLenght}
        messageHeaderAlert={messageHeaderAlert}
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
