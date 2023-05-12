import { useEffect, FunctionComponent, useState } from 'react'
import dayjs from 'dayjs'
import { utils, writeFileXLSX } from 'xlsx'

import { getTriviaRanking } from './services'

import Header from '@antdComponents/Header'
import Table from '@antdComponents/Table'
import { ColumnsType } from 'antd/lib/table'
import { Button } from 'antd'
import { VerticalAlignBottomOutlined } from '@ant-design/icons'

type UserResponseType = any // TODO: define this, and move to Utilities/types

const columns: ColumnsType<UserResponseType> = [
  {
    title: 'Creado',
    dataIndex: 'registerDate',
    key: 'registerDate',
    ellipsis: true,
    sorter: (a, b) => a.registerDate.localeCompare(b.registerDate),
  },
  {
    title: 'Nombre',
    dataIndex: 'userName',
    key: 'userName',
    ellipsis: true,
    sorter: (a, b) => a.userName.localeCompare(b.userName),
  },
  {
    title: 'Email',
    dataIndex: 'userEmail',
    key: 'userEmail',
    ellipsis: true,
    sorter: (a, b) => a.userEmail.localeCompare(b.userEmail),
  },
  {
    title: '# Preguntas',
    dataIndex: 'totalQuestions',
    key: 'totalQuestions',
    ellipsis: true,
    sorter: (a, b) => a.totalQuestions - b.totalQuestions,
  },
  {
    title: '# Respuestas OK',
    dataIndex: 'correctAnswers',
    key: 'correctAnswers',
    ellipsis: true,
    sorter: (a, b) => a.correctAnswers - b.correctAnswers,
  },
]

export interface ITriviaRankingPageProps {
  surveyId: string
}

const TriviaRankingPage: FunctionComponent<ITriviaRankingPageProps> = (props) => {
  const { surveyId } = props

  const [listOfUserResponse, setListOfUserResponse] = useState<any[]>([])

  const loadData = async () => {
    const response = await getTriviaRanking(surveyId)
    setListOfUserResponse(response)
  }

  const exportReport = () => {
    const exclude = (data: any) => {
      delete data._id
      return data
    }

    const data = listOfUserResponse.map((item) => exclude(item))
    console.debug('data of user responses', data)

    for (let i = 0; data.length > i; i++) {
      if (Array.isArray(data[i].response)) {
        data[i].response = data[i].response.toString()
      }
    }
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'ranking')

    writeFileXLSX(wb, `ranking_${surveyId}_${dayjs().format('DDMMYY')}.xls`)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
      <Header title="Ranking" back />

      <Button icon={<VerticalAlignBottomOutlined />} onClick={exportReport}>
        Exportar
      </Button>
      <Table
        header={columns}
        list={listOfUserResponse}
        pagination={false}
        fileName="Ranking"
      />
    </>
  )
}

export default TriviaRankingPage
