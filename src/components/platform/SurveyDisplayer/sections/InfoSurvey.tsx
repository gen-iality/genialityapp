import { QuestionOutlined } from '@ant-design/icons'
import { Button, Result, Space } from 'antd'
import { FunctionComponent } from 'react'
import ReactQuill from 'react-quill'

interface IWelcomeSurveyProps {
  extraMessage?: string
  onClick?: () => void
  btnText: string
  infoText: string
  /**
   * default "Encuesta"
   */
  title?: string
}

const InfoSurvey: FunctionComponent<IWelcomeSurveyProps> = (props) => {
  const { title, extraMessage, onClick, infoText, btnText } = props

  return (
    <Result
      status={'info'}
      title={title ?? 'Encuesta'}
      extra={
        <Space direction="vertical" align="center">
          {infoText}
          <Button
            onClick={() => typeof onClick === 'function' && onClick()}
            type="primary"
          >
            {btnText}
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

export default InfoSurvey
