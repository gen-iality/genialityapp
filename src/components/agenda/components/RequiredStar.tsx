import { FunctionComponent } from 'react'

interface IRequiredStarProps {
  label?: any
}
const RequiredStar: FunctionComponent<IRequiredStarProps> = ({ label }) => (
  <>
    {label}
    <span style={{ color: 'red' }}>*</span>
  </>
)

export default RequiredStar
