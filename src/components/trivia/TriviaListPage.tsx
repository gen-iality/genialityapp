import { FunctionComponent, useEffect, useState } from 'react'
import { SurveysApi } from '../../helpers/request'
import CMS from '../newComponent/CMS'
import { getColumnSearchProps } from '../speakers/getColumnSearch'
import { UnorderedListOutlined } from '@ant-design/icons'
import { deleteSurvey } from './services'
import { Result } from 'antd'
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed'
import { Link } from 'react-router-dom'

type SurveyType = any // TODO: define this, and move to Utilities/types I guess

export interface ITriviaListPageProps {
  event: any
}

const TriviaListPage: FunctionComponent<ITriviaListPageProps> = (props) => {
  const [columnsData, setColumnsData] = useState<any>({})
  const [typeEvent, setTypeEvent] = useState<string | undefined>()

  useEffect(() => {
    const eventType = recordTypeForThisEvent({ value: props.event })
    setTypeEvent(eventType)
  }, [props])

  const columns = [
    {
      title: 'Nombre de la evaluación',
      dataIndex: 'survey',
      ellipsis: true,
      sorter: (a: SurveyType, b: SurveyType) => a.survey.localeCompare(b.survey),
      ...getColumnSearchProps('survey', columnsData),
    },
    {
      title: 'Respuestas',
      width: 200,
      ellipsis: true,
      render: (survey: SurveyType) => <Link to={`${survey._id}`}>Ver respuestas</Link>,
    },
    {
      title: 'Informe global',
      width: 200,
      ellipsis: true,
      render: (survey: SurveyType) => (
        <Link to={`all-answers/${survey._id}`}>Ver informe</Link>
      ),
    },
    {
      title: 'Publicada',
      dataIndex: 'publish',
      ellipsis: true,
      width: 130,
      sorter: (a: SurveyType, b: SurveyType) => a.publish.localeCompare(b.publish),
      ...getColumnSearchProps('publish', columnsData),
      render(isPublished?: string) {
        return <p>{isPublished && isPublished !== 'false' ? 'Sí' : 'No'}</p>
      },
    },
  ]
  async function deleteCallback(surveyId: string) {
    await deleteSurvey(surveyId)
  }
  return (
    <>
      {typeEvent == 'UN_REGISTERED_PUBLIC_EVENT' ? (
        <Result title="Este modulo no esta habilitado para cursos publicos sin registro" />
      ) : (
        <CMS
          API={SurveysApi}
          eventId={props.event._id}
          title={'Evaluaciones'}
          back
          titleTooltip={'Agregue o edite las Agendas que se muestran en la aplicación'}
          addUrl={{
            pathname: `edit`,
            state: { new: true },
          }}
          columns={columns}
          key="_id"
          editPath={`edit`}
          editByParam
          pagination={false}
          actions
          search
          setColumnsData={setColumnsData}
          extraPath={`report`}
          extraPathIcon={<UnorderedListOutlined />}
          extraPathTitle="Detalle"
          extraPathId
          extraPathStateName={`ranking`}
          widthAction={160}
          deleteCallback={(surveyId: string) => deleteCallback(surveyId)}
        />
      )}
    </>
  )
}

export default TriviaListPage
