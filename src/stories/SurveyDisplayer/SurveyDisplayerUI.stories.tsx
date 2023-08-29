import type { Meta, StoryObj } from '@storybook/react'

import { SurveyDisplayerUI } from '@components/platform/SurveyDisplayer'
import { surveyData } from './rawData'

const meta = {
  title: 'Public/SurveyDisplayer',
  component: SurveyDisplayerUI,
  tags: ['autodocs'],
  argTypes: {
    onChangeQuestionIndex: { action: 'change current page' },
    onFinish: { action: 'finish' },
    onAnswer: { action: 'answer a question' },
  },
} satisfies Meta<typeof SurveyDisplayerUI>

export default meta
type Story = StoryObj<typeof meta>

export const SurveyUI: Story = {
  args: {
    title: surveyData.survey,
    isGradable: surveyData.allow_gradable_survey,
    welcomeMessage: surveyData.initialMessage,
    finishMessage: surveyData.neutral_Message,
    winMessage: surveyData.win_Message,
    loseMessage: surveyData.lose_Message,
    questions: surveyData.questions as any,
    questionIndex: 0,
    minimumScore: 10,
  },
}

export const StartedSurveyUI: Story = {
  args: {
    ...SurveyUI.args,
    status: 'started',
  },
}

export const FinishedSurveyUI: Story = {
  args: {
    ...SurveyUI.args,
    status: 'finished',
  },
}

export const StartedTextSurveyUI: Story = {
  args: {
    ...SurveyUI.args,
    status: 'started',
    questionIndex: 5,
  },
}
