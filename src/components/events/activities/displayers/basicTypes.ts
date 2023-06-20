/**
 * The basic interface for all the components that render an activity
 */
export interface IBasicActivityProps {
  activity: any
  onActivityProgress?: (percent: number) => void
}
