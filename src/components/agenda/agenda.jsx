import { useEffect, useMemo, useState } from 'react'
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
  const [pendingPublishStatus, setPendingPublishStatus] = useState(undefined)

  const toggleStatus = () => {
    if (typeof pendingPublishStatus === 'undefined') {
      setPendingPublishStatus(false)
    } else {
      setPendingPublishStatus((previous) => !previous)
    }
  }

  useEffect(() => {
    if (
      typeof pendingPublishStatus === 'undefined' ||
      typeof isPublished === 'undefined' ||
      pendingPublishStatus === isPublished
    )
      return
    const newIsPublished = pendingPublishStatus

    FB.Activities.update(eventId, activityId, { isPublished: newIsPublished }).catch(
      (err) => {
        console.error(err)
        StateMessage.show(
          null,
          'error',
          'No se ha podido actualizar la configuración de la actividad',
        )
      },
    )
  }, [pendingPublishStatus, isPublished])

  useEffect(() => {
    if (!eventId || !activityId) return

    FB.Activities.get(eventId, activityId).then((document) => {
      // typeof pendingPublishStatus === 'undefined' &&
      //   setPendingPublishStatus(document?.isPublished)
      setIsPublished(document?.isPublished)
    })
  }, [eventId, activityId])

  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(isPublished)
    }
  }, [isPublished])

  useEffect(() => {
    if (
      typeof pendingPublishStatus === 'boolean' &&
      typeof isPublished === 'boolean' &&
      pendingPublishStatus !== isPublished
    ) {
      setIsPublished(pendingPublishStatus)
      console.log('update publish status to', pendingPublishStatus)
    }
  }, [isPublished, pendingPublishStatus])

  const status = useMemo(() => {
    if (
      typeof isPublished === 'undefined' &&
      typeof pendingPublishStatus === 'undefined'
    ) {
      return 'público'
    } else if (
      typeof isPublished === 'undefined' &&
      typeof pendingPublishStatus === 'boolean'
    ) {
      return pendingPublishStatus ? 'público' : 'oculto'
    } else if (typeof isPublished === 'boolean') {
      if (typeof pendingPublishStatus === 'undefined')
        setPendingPublishStatus(isPublished)
      return pendingPublishStatus ?? isPublished ? 'público' : 'oculto'
    }
  }, [isPublished, pendingPublishStatus])

  return (
    <Button
      type="link"
      onClick={toggleStatus}
      style={{ color: isPublished ? '#618a89' : '#994b53' }}
    >
      {status}
    </Button>
  )
}

const Agenda = (props) => {
  const [columnsData, setColumnsData] = useState({})
  const [isPublishedActivityMap, setIsPublishedActivityMap] = useState({})

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
      filters: [
        { text: 'Público', value: true },
        { text: 'Oculto', value: false },
      ],
      onFilter: (status, item) => {
        console.log(status, item)
        return isPublishedActivityMap[item._id] === status
      },
      render: (item) => {
        return (
          <ActivityPublishingStatus
            eventId={props.event._id}
            activityId={item._id}
            onChange={(status) => {
              setIsPublishedActivityMap((previous) => ({
                ...previous,
                [item._id]: status,
              }))
            }}
          />
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
      title="Lecciones"
      back
      titleTooltip="Agregue o edite las Agendas que se muestran en la aplicación"
      addUrl="create-activity"
      addUrlState={{ new: true }}
      columns={columns}
      // key="_id"
      editPath="activity"
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
      scroll={{ x: 'auto' }}
    />
  )
}

export default Agenda
