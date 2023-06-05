import { useState } from 'react'
import type { FunctionComponent } from 'react'
import { Card, Col, Row } from 'antd'
import { useNewEventContext, NewEventActionEnum } from '@context/newEventContext'
import type { EventTypeType } from '@Utilities/types/EventType'

type CardType = {
  title: string
  description: string
  type?: EventTypeType
}

interface EventTypeSectionProps {
  onEventTypeSectionChange?: (et: EventTypeType) => void
}

const EventTypeSection: FunctionComponent<EventTypeSectionProps> = (props) => {
  const { onEventTypeSectionChange = () => {} } = props

  const { dispatch } = useNewEventContext()

  const [selectedEventType, setSelectedEventType] = useState<EventTypeType>('onlineEvent')

  const [cards] = useState<CardType[]>([
    { title: 'Curso', description: 'Curso básico', type: 'onlineEvent' },
    {
      title: 'Certificación',
      description: 'Curso básico con la funcionalidad de que es un curso certificado',
      type: 'certification',
    },
  ])

  const handleSelectEventType = (et: EventTypeType) => {
    setSelectedEventType(et)
    onEventTypeSectionChange(et)
    console.log('user select event type:', et)
    dispatch({ type: NewEventActionEnum.EVENT_TYPE, payload: { event_type: et } })
  }

  return (
    <>
      <Row justify="center" gutter={[16, 16]} align="stretch">
        {cards.length === 0 ? (
          <p>Ninguna opción fue pasada</p>
        ) : (
          cards.map((card) => (
            <Col
              span={8}
              key={'key-' + card.title}
              style={{ display: 'flex', justifyContent: 'stretch' }}
            >
              <Card
                style={{
                  width: '100%',
                  boxShadow:
                    selectedEventType === card.type
                      ? '0 0 10px rgba(26, 57, 120, 0.7)'
                      : 'none',
                }}
                title={card.title}
                hoverable
                // description={card.description}
                // image={card.image}
                //  selected={card.key === selected}
                //  onSelect={buildSelectionHandler(card)}
                onClick={() => {
                  handleSelectEventType(card.type)
                }}
              >
                {card.description}
              </Card>
            </Col>
          ))
        )}
      </Row>
    </>
  )
}

export default EventTypeSection
