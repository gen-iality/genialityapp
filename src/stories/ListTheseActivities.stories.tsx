import type { Meta, StoryObj } from '@storybook/react'

import '../App/App.less'
import '../styles/main.scss'
import { MemoryRouter } from 'react-router-dom'

import ListTheseActivities from '@components/agenda/components/ListTheseActivities'
import OnLiveRibbon from '@components/agenda/components/OnLiveRibbon'
import TakenActivityBadge from '@components/agenda/components/TakenActivityBadge'

import { TruncatedAgenda } from '@Utilities/types/AgendaType'
import { activityContentValues } from '@context/activityType/constants/ui'

const meta = {
  title: 'Public/ListTheseActivities',
  component: (props) => (
    <MemoryRouter>
      <ListTheseActivities {...props} />
    </MemoryRouter>
  ),
  tags: ['autodocs'],
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof ListTheseActivities>

export default meta
type Story = StoryObj<typeof meta>

const dataSource: TruncatedAgenda[] = [
  {
    title: 'Activity 1',
    isInfoOnly: false,
    module_name: 'Assignation',
    module_order: 7,
    type: activityContentValues.meeting,
    timeString: '23 minutos',
    link: 'http://localhost',
    host_picture: 'https://i.imgur.com/TDlxu0v.png',
    name_host: 'Anier',
    endComponents: [() => <TakenActivityBadge isTaken />, () => <>Test component</>],
    ItemWrapper: ({ children }) => (
      <OnLiveRibbon isOnLive={true}>{children}</OnLiveRibbon>
    ),
    short_description: 'Short description for activity 1',
    categories: [
      {
        color: 'red',
        name: 'Rojo',
      },
      {
        color: 'lime',
        name: 'Lima',
      },
    ],
  },
]

export const FullListTheseActivities: Story = {
  args: {
    dataSource,
  },
}
