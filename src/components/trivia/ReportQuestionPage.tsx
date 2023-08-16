import { FunctionComponent, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { utils, writeFileXLSX } from 'xlsx'
import { getAnswersByQuestion } from './services'
import Header from '@antdComponents/Header'
import Table from '@antdComponents/Table'
import { ColumnsType } from 'antd/lib/table'
import { Button } from 'antd'
import { VerticalAlignBottomOutlined } from '@ant-design/icons'

type UserResponseType = any // TODO: define this, and move to Utilities/types

const UserNameRendered = (name?: string) =>
  !name ? <span>Usuario invitado</span> : <span>{name}</span>

const columns: ColumnsType<UserResponseType> = [
  {
    title: 'Creado',
    dataIndex: 'creation_date_text',
    key: 'creation_date_text',
  },
  {
    title: 'Nombre',
    dataIndex: 'user_name',
    key: 'user_name',
    render: UserNameRendered,
  },
  {
    title: 'Respuesta',
    dataIndex: 'response',
    key: 'response',
  },
]

const ReportQuestionPage: FunctionComponent = () => {
  const { surveyId } = useParams<{ surveyId: string }>()

  const [questionText, setQuestionText] = useState<string>('')
  const [listOfUserResponse, setListOfUserResponse] = useState<UserResponseType[]>([])

  const location = useLocation()

  const loadData = async () => {
    setQuestionText(location.state.titleQuestion)
    const response = await getAnswersByQuestion(location.state.surveyId, surveyId)
    setListOfUserResponse(response)
  }

  const exportReport = () => {
    const exclude = (data: any) => {
      delete data._id
      return data
    }

    const data = listOfUserResponse.map((item) => exclude(item))

    for (let i = 0; data.length > i; i++) {
      if (Array.isArray(data[i].response)) {
        data[i].response = data[i].response.toString()
      }
    }
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    const sheetName = questionText.substring(0, 30).replace(/[.*+¿?^${}()|[\]\\]/g, '')
    utils.book_append_sheet(wb, ws, `${sheetName}`)

    writeFileXLSX(wb, `${sheetName}-${surveyId}_${dayjs().format('DDMMYY')}.xls`)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
      <Header title={questionText} back />

      <Button icon={<VerticalAlignBottomOutlined />} onClick={exportReport}>
        Exportar
      </Button>
      <Table header={columns} list={listOfUserResponse} pagination={false} />
    </>
  )
}

export default ReportQuestionPage
