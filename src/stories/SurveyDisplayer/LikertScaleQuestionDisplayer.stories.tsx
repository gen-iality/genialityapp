import type { Meta, StoryObj } from '@storybook/react'

import LikertScaleQuestionDisplayer from '@components/platform/SurveyDisplayer/components/LikertScaleQuestionDisplayer'

import { surveyData } from './rawData'

const meta = {
  title: 'Public/SurveyDisplayer/LikertScaleQuestionDisplayer',
  component: LikertScaleQuestionDisplayer,
  tags: ['autodocs'],
  argTypes: {
    onAnswer: { action: 'answer' },
  },
} satisfies Meta<typeof LikertScaleQuestionDisplayer>

export default meta
type Story = StoryObj<typeof meta>

export const LikertScaleSelectionQuestion: Story = {
  args: {
    question: surveyData.questions[4] as any,
  },
}
