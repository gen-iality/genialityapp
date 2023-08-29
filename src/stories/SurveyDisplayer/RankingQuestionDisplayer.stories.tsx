import type { Meta, StoryObj } from '@storybook/react'

import RankingQuestionDisplayer from '@components/platform/SurveyDisplayer/components/RankingQuestionDisplayer'
import { surveyData } from './rawData'

const meta = {
  title: 'Public/SurveyDisplayer/RankingQuestionDisplayer',
  component: RankingQuestionDisplayer,
  tags: ['autodocs'],
  argTypes: {
    onAnswer: { action: 'answer' },
  },
} satisfies Meta<typeof RankingQuestionDisplayer>

export default meta
type Story = StoryObj<typeof meta>

export const RankingQuestion: Story = {
  args: {
    question: surveyData.questions[2] as any,
  },
}
