import { FunctionComponent, useEffect, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { SpeakersApi } from '@helpers/request'
import { Table, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import Header from '@antdComponents/Header'
import { columns } from './columns'
import { StateMessage } from '@context/MessageService'
import { useHelper } from '@context/helperContext/hooks/useHelper'

const SortableItem = sortableElement((props) => <tr {...props} />)
const SortableContainer = sortableContainer((props) => <tbody {...props} />)

const { confirm } = Modal

interface ISpeakersListPageProps {
  eventID: any
  parentUrl: string
}

const SpeakersListPage: FunctionComponent<ISpeakersListPageProps> = (props) => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [dataSpeakers, setdataSpeakers] = useState<any[]>([])
  const { isLoading, data, refetch } = useQuery('getSpeakersByEvent', () =>
    SpeakersApi.byEvent(props.eventID),
  )
  const { eventIsActive } = useHelper()
  const cEventIsActive = eventIsActive

  useEffect(() => {
    setdataSpeakers(data)
  }, [data])

  const queryClient = useQueryClient()

  function sortAndIndexSpeakers() {
    const data = dataSpeakers
    let list = []
    if (data) {
      list = data.sort((a, b) => (a.sort && b.sort ? a.sort - b.sort : 0))
      list = list.map((speaker, index) => {
        return { ...speaker, index: speaker.sort == index ? speaker.sort : index }
      })
      list = list.sort((a, b) => a.index - b.index)

      return list
    }
  }

  function remove(info: any) {
    //Se coloco la constante "eventId" porque se perdia al momento de hacer la llamada al momento de eliminar
    StateMessage.show('loading', 'loading', 'Por favor espere...')
    const eventId = props.eventID
    confirm({
      title: `¿Está seguro de eliminar a ${info.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemoveSpeaker = () => {
          try {
            updateOrDeleteSpeakers.mutateAsync({ speakerData: info, eventId })
            StateMessage.destroy('loading')
            StateMessage.show(
              null,
              'success',
              'Se eliminó correctamente al conferencista!',
            )
          } catch (e) {
            StateMessage.destroy('loading')
            StateMessage.show(
              null,
              'error',
              'Ha ocurrido un problema eliminando al conferencista!',
            )
          }
        }
        onHandlerRemoveSpeaker()
      },
    })
  }

  //FN para búsqueda en la tabla 2/3
  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  //FN para búsqueda en la tabla 3/3
  function handleReset(clearFilters) {
    clearFilters()
    setSearchText('')
  }

  //FN para el draggable 1/3
  function onSortEnd({ oldIndex, newIndex }) {
    const eventId = props.eventID
    if (oldIndex !== newIndex) {
      let newData = arrayMove(
        [].concat(sortAndIndexSpeakers()),
        oldIndex,
        newIndex,
      ).filter((el) => !!el)
      if (newData) {
        newData = newData.map((speaker, key) => {
          return { ...speaker, index: key }
        })
      }
      updateOrDeleteSpeakers.mutateAsync({ newData, state: 'update', eventId })
    }
  }

  const updateOrDeleteSpeakers = useMutation(
    'getSpeakersByEvent',
    async (queryData) => {
      if (queryData.state === 'update') {
        await Promise.all(
          queryData.newData.map(async (speaker, index) => {
            const speakerChange = { ...speaker, order: index + 1 }
            await SpeakersApi.editOne(speakerChange, speaker._id, queryData.eventId)
          }),
        )
      } else {
        await SpeakersApi.deleteOne(queryData.speakerData._id, queryData.eventId)
      }
    },
    {
      // Optimistically update the cache value on mutate, but store
      // the old value and return it so that it's accessible in case of
      // an error
      onMutate: async () => {
        //
        await queryClient.cancelQueries('getSpeakersByEvent')
        const previousValue = queryClient.getQueryData('getSpeakersByEvent')
        return previousValue
      },
      // On failure, roll back to the previous value
      onError: (err, queryData, previousValue) => {
        if (queryData.state === 'update') {
          queryClient.setQueryData('getSpeakersByEvent', () => previousValue)
          StateMessage.show(
            null,
            'error',
            `Hubo un error al guardar la posición de los conferencista, Error tipo: ${err.response.statusText}`,
          )
        } else {
          StateMessage.show(
            null,
            'error',
            `Hubo un error intentando borrar el conferencista ${queryData.speakerData.name}, Error tipo: ${err.response.statusText}`,
          )
        }
      },
      // After success , refetch the query
      onSuccess: (data, queryData, previousValue) => {
        if (queryData.state === 'update') {
          queryClient.setQueryData('getSpeakersByEvent', queryData.newData)
          StateMessage.show(
            null,
            'success',
            'La posición de los conferencistas ha sido actualizada correctamente!',
          )
        } else {
          // queryClient.fetchQuery('getSpeakersByEvent', SpeakersApi.byEvent(queryData.eventId), {
          //   staleTime: 500,
          // });
          const updateSpeakersAfterADelete = dataSpeakers.filter(
            (speakers) => speakers._id !== queryData.speakerData._id,
          )
          setdataSpeakers(updateSpeakersAfterADelete)
          StateMessage.show(
            null,
            'success',
            `El conferencista  ${queryData.speakerData.name} ha sido eliminado satisfactoriamente`,
          )
          sortAndIndexSpeakers()
        }
      },
    },
  )

  //FN para el draggable 2/3
  const DraggableContainer = (secondProps: any) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...secondProps}
    />
  )

  //FN para el draggable 3/3
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = sortAndIndexSpeakers()?.findIndex(
      (x) => x.index === restProps['data-row-key'],
    )
    return <SortableItem index={index} {...restProps} />
  }

  const columnsData = {
    data: {
      ...props,
      matchUrl: props.parentUrl,
    },
    searchedColumn: searchedColumn,
    handleSearch,
    handleReset,
    remove,
    searchText: searchText,
    refetch,
    cEventIsActive,
  }

  return (
    <div>
      <Header
        title="Conferencistas"
        titleTooltip="Agregue o edite las personas que son conferencistas"
        addUrl={{
          pathname: `${props.parentUrl}/speaker`,
          state: { new: true },
        }}
        /* listLenght={sortAndIndexSpeakers()} */
      />

      <Table
        columns={columns(columnsData)}
        dataSource={sortAndIndexSpeakers()}
        size="small"
        rowKey="index"
        loading={isLoading}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
        pagination={false}
      />
    </div>
  )
}

export default SpeakersListPage
