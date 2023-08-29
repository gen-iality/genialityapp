import type { Meta, StoryObj } from '@storybook/react'

import OptionsQuestionDisplayer from '@components/platform/SurveyDisplayer/components/OptionsQuestionDisplayer'
import { surveyData } from './rawData'

const meta = {
  title: 'Public/SurveyDisplayer/OptionsQuestionDisplayer',
  component: OptionsQuestionDisplayer,
  tags: ['autodocs'],
  argTypes: {
    onAnswer: { action: 'answer' },
  },
} satisfies Meta<typeof OptionsQuestionDisplayer>

export default meta
type Story = StoryObj<typeof meta>

export const MultipleSelectionQuestion: Story = {
  args: {
    question: surveyData.questions[1] as any,
    multiple: true,
  },
}

export const UniqueSelectionQuestion: Story = {
  args: {
    question: surveyData.questions[0] as any,
    multiple: false,
  },
}
