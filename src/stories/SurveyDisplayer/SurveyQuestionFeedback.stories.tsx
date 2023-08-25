import type { Meta, StoryObj } from '@storybook/react'

import SurveyQuestionFeedback from '@components/platform/SurveyDisplayer/SurveyQuestionFeedback'

import { surveyData } from './rawData'

const meta = {
  title: 'Public/SurveyDisplayer/SurveyQuestionFeedback',
  component: SurveyQuestionFeedback,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'close' },
  },
} satisfies Meta<typeof SurveyQuestionFeedback>

export default meta
type Story = StoryObj<typeof meta>

export const Feedback: Story = {
  args: {
    question: surveyData.questions[2] as any,
    isCorrect: true,
    points: 4,
    answer: surveyData.questions[2].choices,
  },
}

export const BadFeedback: Story = {
  args: {
    question: surveyData.questions[0] as any,
    isCorrect: false,
    points: 3,
    answer: surveyData.questions[2].choices,
  },
}

export const FinishFeedback: Story = {
  args: {
    question: surveyData.questions[5] as any,
    isCorrect: true,
    points: 0,
    showAsFinished: true,
    answer: surveyData.questions[2].correctAnswer,
  },
}
