import type { Meta, StoryObj } from '@storybook/react'

import RatingQuestionDisplayer from '@components/platform/SurveyDisplayer/components/RatingQuestionDisplayer'
import { surveyData } from './rawData'

const meta = {
  title: 'Public/SurveyDisplayer/RatingQuestionDisplayer',
  component: RatingQuestionDisplayer,
  tags: ['autodocs'],
  argTypes: {
    onAnswer: { action: 'answer' },
  },
} satisfies Meta<typeof RatingQuestionDisplayer>

export default meta
type Story = StoryObj<typeof meta>

export const RatingQuestion: Story = {
  args: {
    question: surveyData.questions[3] as any,
  },
}
