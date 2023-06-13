import { useState, useEffect } from 'react'

import { Button, Input, Space, Alert } from 'antd'

import { SurveyStatus } from '@components/events/surveys/types'
import { FB } from '@helpers/firestore-request'

export interface QuizStatusEditorPageProps {}

const surveyId = 'surveyId-feo'
const userId = 'userId-feo'
const status = 'completed'

async function setCurrentUserSurveyStatus(
  surveyId: string,
  userId: string,
  status: string,
  nextRight: number,
) {
  const result = await FB.VotingStatus.SurveyStatus.get(userId, surveyId)

  const payload: SurveyStatus = {
    surveyCompleted: status,
    right: 0,
  }
  if (result) {
    const { right = 0 } = result as typeof payload
    payload.right = right + nextRight
  }

  await FB.VotingStatus.SurveyStatus.edit(userId, surveyId, payload)
}

export function QuizStatusEditorPage(props: QuizStatusEditorPageProps) {
  const [valueRight, setValueRight] = useState('')

  const [isBadTotal, setIsBadTotal] = useState(false)
  const [isBadRight, setIsBadRight] = useState(false)

  const [isBadAlertShown, setIsBadAlertShown] = useState(false)
  const [isGoodAlertShown, setIsGoodAlertShown] = useState(false)

  useEffect(() => {
    setIsBadRight(isNaN(parseInt(valueRight)))
  }, [valueRight])

  useEffect(() => {
    if (!isBadAlertShown) return
    setTimeout(() => setIsBadAlertShown(false), 4000)
  }, [isBadAlertShown])

  useEffect(() => {
    if (!isGoodAlertShown) return
    setTimeout(() => setIsGoodAlertShown(false), 4000)
  }, [isGoodAlertShown])

  const handleUpdate = () => {
    if (isBadTotal || isBadRight) {
      setIsBadAlertShown(true)
      return
    }

    setIsGoodAlertShown(false)
    setCurrentUserSurveyStatus(surveyId, userId, status, parseInt(valueRight)).then(() =>
      setIsGoodAlertShown(true),
    )
  }

  return (
    <Space direction="vertical">
      <Input
        addonBefore="Correctas"
        status={isBadRight ? 'error' : undefined}
        placeholder="Correctas"
        value={valueRight}
        onChange={(e) => setValueRight(e.target.value)}
      />
      <Button onClick={handleUpdate}>Actualizar</Button>
      {isBadAlertShown && <Alert type="error" message="No puedes enviar eso" />}
      {isGoodAlertShown && <Alert type="success" message="Datos enviados" />}
    </Space>
  )
}
