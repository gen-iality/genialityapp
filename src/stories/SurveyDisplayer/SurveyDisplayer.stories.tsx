import type { Meta, StoryObj } from '@storybook/react'

import SurveyDisplayer from '@components/platform/SurveyDisplayer'
import { SurveyDisplayerUI } from '@components/platform/SurveyDisplayer'
import { surveyData } from './rawData'

const meta = {
  title: 'Public/SurveyDisplayer',
  component: SurveyDisplayer,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof SurveyDisplayer>

export default meta
type Story = StoryObj<typeof meta>

export const Survey: Story = {
  args: {
    survey: surveyData as any,
    eventId: '64a482603e2a8d2d7f04f0b2',
    user: {
      _id: '64340a43d2a74e103a29d3b4',
      names: 'GEN.iality tester',
      email: 'contacto@geniality.com.co',
    },
    render(props) {
      return <SurveyDisplayerUI {...props} />
    },
  },
}
