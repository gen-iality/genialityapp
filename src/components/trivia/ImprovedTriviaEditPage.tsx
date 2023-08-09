import { FunctionComponent, useState, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Col, Row } from 'antd'
import TriviaEditor from './TriviaEditor'

type ParamsType = {
  survey_id?: string
}

interface ITriviaEditPageProps {
  event: any
  parentUrl: string
}

const TriviaEditPage: FunctionComponent<ITriviaEditPageProps> = (props) => {
  const { event, parentUrl } = props
  const params = useParams<ParamsType>()
  const navigate = useNavigate()

  const goBack = () => navigate(`${parentUrl}`)

  return (
    <Row justify="center" wrap gutter={8}>
      <Col span={16}>
        <TriviaEditor
          surveyId={params.survey_id}
          eventId={event?._id}
          onDelete={(surveyId) => {
            console.log('delete survey', surveyId)
            goBack()
          }}
          onSave={(surveyId) => {
            console.log('save', surveyId)
            goBack()
          }}
          onCreated={(surveyId) => {
            console.log('create', surveyId)
          }}
        />
      </Col>
    </Row>
  )
}

export default TriviaEditPage
