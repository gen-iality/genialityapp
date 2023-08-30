import { FunctionComponent, useState } from 'react'
import { SurveyQuestion } from '../types'
import { Button, Image, Modal, Space, Typography } from 'antd'
import TextQuestionDisplayer from './TextQuestionDisplayer'
import OptionsQuestionDisplayer from './OptionsQuestionDisplayer'
import RankingQuestionDisplayer from './RankingQuestionDisplayer'
import RatingQuestionDisplayer from './RatingQuestionDisplayer'
import LikertScaleQuestionDisplayer from './LikertScaleQuestionDisplayer'
import ReactPlayer from 'react-player'
import { LoadingOutlined } from '@ant-design/icons'

interface IQuestionDisplayerProps {
  question: SurveyQuestion
  onAnswer: (answer: any, isCorrect: boolean, points: number) => Promise<void> | void
}

const QuestionDisplayer: FunctionComponent<IQuestionDisplayerProps> = (props) => {
  const { question, onAnswer: onReply } = props

  const [isSaving, setIsSaving] = useState(false)
  const [answer, setAnswer] = useState<any | undefined>()
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [points, setPoints] = useState(0)

  const images = (question.image as unknown as any[]) ?? []
  const videos = (question.video as unknown as any[]) ?? []

  const onClickNext = async () => {
    console.log('sent the answer', { answer, isCorrect, points })

    if (
      typeof question !== 'undefined' &&
      question.isRequired &&
      (typeof answer === 'undefined' || answer === null)
    ) {
      Modal.error({
        title: 'Falta la respuesta',
        content: 'Esta pregunta requiere que se conteste',
      })
      return
    }

    setIsSaving(true)
    await onReply(answer, isCorrect, points)
    setIsSaving(false)

    setAnswer(undefined)
    setIsCorrect(false)
    setPoints(0)
  }

  const onAnswer = (answer: any, isCorrect: boolean, points: number) => {
    setAnswer(answer)
    setIsCorrect(isCorrect)
    setPoints(points)
  }

  return (
    <Space.Compact block direction="vertical">
      <aside
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {images.map((image, index) => (
          <Image
            alt="Imagen desconocida - esto es un error"
            key={index}
            src={image.imageLink}
            width={400}
          />
        ))}
        {videos.map((video, index) => (
          <div key={index}>
            {video?.html ? (
              <div dangerouslySetInnerHTML={{ __html: video.html }}></div>
            ) : (
              <ReactPlayer
                // style={{ objectFit: 'cover' }}
                width="100%"
                height="100%"
                url={video}
                controls
              />
            )}
          </div>
        ))}
        {question.url && (
          <iframe style={{ width: '100%', height: '100%' }} src={question.url} />
        )}
      </aside>
      <Typography.Title level={5}>{question.title}</Typography.Title>

      {question.type === 'text' ? (
        <TextQuestionDisplayer question={question} onAnswer={onAnswer} />
      ) : question.type === 'radiogroup' ? (
        <OptionsQuestionDisplayer question={question} onAnswer={onAnswer} />
      ) : question.type === 'checkbox' ? (
        <OptionsQuestionDisplayer question={question} onAnswer={onAnswer} multiple />
      ) : question.type === 'ranking' ? (
        <RankingQuestionDisplayer question={question} onAnswer={onAnswer} />
      ) : question.type.toLowerCase() === 'rating' ? (
        <RatingQuestionDisplayer question={question} onAnswer={onAnswer} />
      ) : question.type === 'matrix' ? (
        <LikertScaleQuestionDisplayer question={question} onAnswer={onAnswer} />
      ) : null}

      <br />
      <br />

      <footer style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Button
          danger
          type="primary"
          onClick={onClickNext}
          shape="round"
          icon={isSaving ? <LoadingOutlined /> : undefined}
          disabled={
            (question !== undefined && question.isRequired && answer === undefined) ||
            isSaving
          }
        >
          {isSaving ? 'Guardando...' : 'Contestar'}
        </Button>
      </footer>
    </Space.Compact>
  )
}

export default QuestionDisplayer
