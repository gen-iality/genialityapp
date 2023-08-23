import type { Meta, StoryObj } from '@storybook/react'
// import { expect } from '@storybook/jest'
// import { userEvent, waitFor, within } from '@storybook/testing-library'
// import { createMock, getMock } from 'storybook-addon-module-mock'
// import * as HelperAuth from '@helpers/HelperAuth'

import MarkAsViewedButton from '@components/agenda/components/MarkAsViewedButton'

const meta = {
  title: 'Public/MarkAsViewedButton',
  component: MarkAsViewedButton,
  tags: ['autodocs'],
} satisfies Meta<typeof MarkAsViewedButton>

export default meta
type Story = StoryObj<typeof meta>

export const Button: Story = {
  args: {
    eventUser: { _id: '' },
    activity: '',
    children: 'Reiniciar',
  },
  //   parameters: {
  //     mock: () => {
  //       const mock = createMock(HelperAuth, 'checkinAttendeeInActivity')
  //       mock.mockResolvedValue('yes')
  //       return [mock]
  //     },
  //   },
  //   play: async ({ canvasElement, parameters }) => {
  //     const canvas = within(canvasElement)
  //     expect(canvas.getByText('Reiniciar')).toBeInTheDocument()
  //     const mock = getMock(parameters, HelperAuth, 'checkinAttendeeInActivity')
  //     expect(mock).toBeCalled()
  //   },
}
