import { useEffect, useState } from 'react'
import { handleRequestError } from '@helpers/utils'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import Header from '@antdComponents/Header'
import Table from '@antdComponents/Table'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { StateMessage } from '@context/MessageService'
import Service from '../agenda/roomManager/service'
import { firestore, fireRealtime } from '@helpers/firebase'
import { deleteLiveStream, deleteAllVideos } from '@adaptors/gcoreStreamingApi'
const { confirm } = Modal

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
    editByParam,
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
  } = props
  //API que sería a cual servicio llamar, para hacer los submit y remove y cualquier otra acción
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { reloadTemplatesCms } = useHelper()

  useEffect(() => {
    getList()
  }, [reloadTemplatesCms])

  const getList = async () => {
    const data = await API.byEvent(eventId)
    if (data.data) {
      setList(
        data.data
          .sort(function (a, b) {
            return a.created_at.localeCompare(-b.created_at)
          })
          .map((it, index) => ({ ...it, key: `table_cms_${index}` })),
      )
    } else {
      setList(
        data
          .sort(function (a, b) {
            return a.created_at.localeCompare(-b.created_at)
          })
          .map((it, index) => ({ ...it, key: `table_cms_${index}` })),
      )
    }
    setIsLoading(false)
  }

  const remove = (id, name) => {
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        StateMessage.show(
          'loading',
          'loading',
          'Por favor espere mientras se borra la información...',
        )
        const onHandlerRemove = async () => {
          try {
            const refActivity = `request/${eventId}/activities/${id}`
            const service = new Service(firestore)
            const configuration = await service.getConfiguration(eventId, id)
            if (configuration && configuration.typeActivity === 'eviusMeet') {
              await deleteAllVideos(name, configuration.meeting_id),
                await deleteLiveStream(configuration.meeting_id)
            }
            if (deleteCallback) await deleteCallback(id)
            await fireRealtime.ref(refActivity).remove()
            await service.deleteActivity(eventId, id)
            await API.deleteOne(id, eventId)
            StateMessage.destroy('loading')
            StateMessage.show(null, 'success', 'Se eliminó la información correctamente!')
            getList()
          } catch (e) {
            StateMessage.destroy('loading')
            StateMessage.show(null, 'error', handleRequestError(e).message)
          }
        }
        onHandlerRemove()
      },
    })
  }

  const updateMails = async (idMessage) => {
    setIsLoading(true)
    const updateMails = await API.updateOne(eventId, idMessage)
    await getList()
    StateMessage.show(null, 'success', updateMails?.message)
    setIsLoading(false)
  }

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

      <Table
        header={columns}
        loading={isLoading}
        list={list}
        setList={setList}
        key={key}
        pagination={pagination}
        actions={actions}
        editPath={editPath}
        editByParam={editByParam}
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
    </div>
  )
}

export default CMS
