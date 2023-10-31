import AgendaType from '@Utilities/types/AgendaType'

/**
 * The basic interface for all the components that render an activity
 */
export interface IBasicActivityProps {
  activity: AgendaType
  onActivityProgress?: (percent: number) => void
}
