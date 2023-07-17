import { useEffect, useState } from 'react'
import { AgendaApi } from '@helpers/request'
import CMS from '../newComponent/CMS'
import { getColumnSearchProps } from '../speakers/getColumnSearch'
import { Button, Spin, Tag, Tooltip } from 'antd'
import dayjs from 'dayjs'

import lessonTypeToString from '../events/lessonTypeToString'
import { FB } from '@helpers/firestore-request'
import { StateMessage } from '@context/MessageService'

const ActivityPublishingStatus = (props) => {
  const { eventId, activityId } = props
  const [isPublished, setIsPublished] = useState(undefined)

  const toggleStatus = () => {
    const newIsPublished = !isPublished
    FB.Activities.update(eventId, activityId, { isPublished: newIsPublished })
      .then(() => setIsPublished(newIsPublished))
      .catch((err) => {
        console.error(err)
        StateMessage.show(
          null,
          'error',
          'No se ha podido actualizar la configuración de la actividad',
        )
        setIsPublished(undefined)
      })
  }

  useEffect(() => {
    if (!eventId || !activityId) return

    FB.Activities.get(eventId, activityId).then((document) => {
      setIsPublished(document?.isPublished)
    })
  }, [eventId, activityId])

  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(isPublished)
    }
  }, [isPublished])

  return (
    <Tooltip title="Click para cambiar">
      <Button
        type="link"
        onClick={toggleStatus}
        style={{ color: isPublished ? '#618a89' : '#994b53' }}
      >
        {typeof isPublished === 'undefined' ? (
          <Spin />
        ) : isPublished ? (
          'público'
        ) : (
          'oculto'
        )}
      </Button>
    </Tooltip>
  )
}

const Agenda = (props) => {
  const [columnsData, setColumnsData] = useState({})

  const columns = [
    {
      title: 'Fecha y hora inicio',
      dataIndex: 'datetime_start',
      ellipsis: true,
      sorter: (a, b) => a.datetime_start.localeCompare(b.datetime_start),
      ...getColumnSearchProps('datetime_start', columnsData),
      render(record) {
        return <div>{dayjs(record).format('DD/MM/YYYY')}</div>
      },
    },
    {
      title: 'Fecha y hora fin',
      dataIndex: 'datetime_end',
      ellipsis: true,
      sorter: (a, b) => a.datetime_end.localeCompare(b.datetime_end),
      ...getColumnSearchProps('datetime_end', columnsData),
      render(record) {
        return <div>{dayjs(record).format('DD/MM/YYYY')}</div>
      },
    },
    {
      title: 'Lección',
      dataIndex: 'name',
      //ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData),
    },
    {
      title: 'Está publicado?',
      ellipsis: true,
      render: (item) => {
        return (
          <ActivityPublishingStatus eventId={props.event._id} activityId={item._id} />
        )
      },
    },
    {
      title: 'Tipo',
      render(record) {
        if (record.type === null) {
          return <div>Genérico</div>
        }
        const typeName = lessonTypeToString(record.type.name) || 'Genérico'
        return <div>{typeName}</div>
      },
    },
    {
      title: 'Categorias',
      dataIndex: 'activity_categories',
      ellipsis: true,
      render(record) {
        return (
          <>
            {record.map((item, key) => (
              <Tag key={key} color={item.color}>
                {item.name}
              </Tag>
            ))}
          </>
        )
      },
    },
    {
      title: 'Espacios',
      dataIndex: 'space',
      ellipsis: true,
      render(record) {
        return (
          <>
            <div>{record?.name}</div>
          </>
        )
      },
    },
    {
      title: 'Conferencistas',
      dataIndex: 'hosts',
      ellipsis: true,
      render(record) {
        return (
          <>
            {record.map((item, key) => (
              <Tag key={key}>{item.name}</Tag>
            ))}
          </>
        )
      },
    },
  ]

  return (
    <CMS
      API={AgendaApi}
      eventId={props.event._id}
      title="Temas"
      back
      titleTooltip="Agregue o edite las Agendas que se muestran en la aplicación"
      addUrl={{
        pathname: `${props.parentUrl}/create-activity`,
        state: { new: true },
      }}
      columns={columns}
      // key="_id"
      editPath={`${props.parentUrl}/activity`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
      scroll={{ x: 'auto' }}
    />
  )
}

export default Agenda
