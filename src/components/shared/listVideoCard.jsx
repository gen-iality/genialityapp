import { Col, Row } from 'antd'
import VideoCard from './videoCard'
import { useEventContext } from '@context/eventContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useState, useEffect } from 'react'

const ListVideoCard = () => {
  const cEvent = useEventContext()
  const { activitiesEvent } = useHelper()
  const [existActivity, setExistActivity] = useState(0)
  function ExistvideoInActivity() {
    activitiesEvent &&
      activitiesEvent.map((activity) => {
        if (activity.video != undefined || activity.video != null) {
          {
            setExistActivity(1)
          }
        }
      })
  }
  useEffect(() => {
    ExistvideoInActivity()
  }, [activitiesEvent])

  if (!cEvent.value) {
    return <>Cargando...</>
  }

  let countactivityToShow = 0

  return (
    <>
      {existActivity === 1 && (
        <Row gutter={[20, 20]} style={{ margin: '25px' }}>
          {activitiesEvent &&
            activitiesEvent.map((activity, index) => {
              if (countactivityToShow < 3) {
                if (activity.video) {
                  countactivityToShow++
                  return (
                    <Col key={index} xs={0} sm={0} md={24} lg={8} xl={8}>
                      <VideoCard
                        bordered={false}
                        key={cEvent.value._id}
                        event={cEvent.value}
                        action={{ name: 'Ver', url: `landing/${cEvent.value._id}` }}
                        activity={activity}
                      />
                    </Col>
                  )
                }
              }
            })}
        </Row>
      )}
    </>
  )
}

export default ListVideoCard
