import { QuestionOutlined } from '@ant-design/icons'
import { Button, Result, Space } from 'antd'
import { FunctionComponent } from 'react'
import ReactQuill from 'react-quill'

interface IWelcomeSurveyProps {
  extraMessage?: string
  onStart?: () => void
}

const WelcomeSurvey: FunctionComponent<IWelcomeSurveyProps> = (props) => {
  const { extraMessage, onStart } = props

  const onClick = () => {
    if (typeof onStart === 'function') {
      onStart()
    }
  }

  return (
    <Result
      status={'info'}
      title="Encuesta"
      extra={
        <Space direction="vertical" align="center">
          Click en INICIAR para comenzar
          <Button onClick={onClick} type="primary">
            Empezar
          </Button>
        </Space>
      }
      icon={<QuestionOutlined />}
      subTitle={
        extraMessage && (
          <ReactQuill
            style={{ color: '#212121' }}
            value={extraMessage}
            readOnly
            className="hide-toolbar ql-toolbar"
            theme="bubble"
          />
        )
      }
    />
  )
}

export default WelcomeSurvey
