import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { FunctionComponent, useEffect, useState } from 'react'
import ActivityTypeModal from './ActivityTypeModal'
import { Alert, Button, Col, Modal, Row } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { AvailableActivityType } from './ActivityContentSelector2'
import editActivityType from './utils/editActivityType'
import { StateMessage } from '@context/MessageService'

type ActivityTypeSelectorRebornProps = {
  eventId: string
  activity: ExtendedAgendaType
}

const ActivityTypeSelectorReborn: FunctionComponent<ActivityTypeSelectorRebornProps> = (
  props,
) => {
  const { eventId, activity } = props

  const [isModalShown, setIsModalShown] = useState(false)
  const [selected, setSelected] = useState<AvailableActivityType | null>(null)
  const [activityType, setActivityType] = useState<AvailableActivityType | null>(
    activity?.type?.name ?? null,
  )
  const [initialActivityType, setInitialActivityType] =
    useState<AvailableActivityType | null>(activity?.type?.name ?? null)
  const [confirmedSelection, setConfirmedSelection] =
    useState<AvailableActivityType | null>(null)

  const handleSetActivityType = () => {
    setIsModalShown(true)
  }

  const handleCloseModal = (success: boolean = false) => {
    setIsModalShown(false)
    console.log('this stuff was closed, success:', success)
  }

  const handleSelectionChange = (selected: AvailableActivityType) => {
    console.log('[activity type modal] selected changes:', selected)
    setSelected(selected)
  }

  useEffect(() => {
    if (selected) {
      setActivityType(selected)
      setConfirmedSelection(selected)
    }
  }, [selected])

  useEffect(() => {
    if (confirmedSelection && activityType) {
      Modal.confirm({
        title: '¿Quiere definir este valor?',
        content: `Se va a fijar el tipo de actividad a: ${activityType}`,
        onOk: () => {
          editActivityType(eventId, activity._id!, activityType)
            .then(() => {
              setInitialActivityType(activityType)
              StateMessage.show(
                null,
                'success',
                `Nuevo tipo de actividad definido: ${activityType}`,
              )
            })
            .catch((err) => {
              console.error(err)
              const { status } = err.response ?? {}
              StateMessage.show(
                null,
                'error',
                `No se ha podido actualizar el tipo de actividad -  estado: ${status}`,
              )
            })
        },
        onCancel: () => {
          setActivityType(initialActivityType)
        },
      })
    }
  }, [confirmedSelection])

  return (
    <>
      <ActivityTypeModal
        open={isModalShown}
        onClose={handleCloseModal}
        onSelectionChange={handleSelectionChange}
      />

      {activityType !== null ? (
        <Alert type="info" message={`Actividad de tipo: ${activityType}`} />
      ) : (
        <Row>
          <Col span={2}>
            <WarningOutlined width="auto" />
          </Col>
          <Col span={14}>
            <p>Todavía no has definido el tipo de actividad</p>
          </Col>
          <Col span={8}>
            <Button onClick={handleSetActivityType} type="primary">
              Escoge un tipo de actividad
            </Button>
          </Col>
        </Row>
      )}
    </>
  )
}

export default ActivityTypeSelectorReborn
