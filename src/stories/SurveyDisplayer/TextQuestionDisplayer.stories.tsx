import type { Meta, StoryObj } from '@storybook/react'

import TextQuestionDisplayer from '@components/platform/SurveyDisplayer/components/TextQuestionDisplayer'
import { surveyData } from './rawData'

const meta = {
  title: 'Public/SurveyDisplayer/TextQuestionDisplayer',
  component: TextQuestionDisplayer,
  tags: ['autodocs'],
  argTypes: {
    onAnswer: { action: 'answer' },
  },
} satisfies Meta<typeof TextQuestionDisplayer>

export default meta
type Story = StoryObj<typeof meta>

export const TextQuestion: Story = {
  args: {
    question: surveyData.questions[5] as any,
  },
}
