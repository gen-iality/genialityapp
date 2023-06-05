import { Calendar, CalendarProps } from 'react-multi-date-picker';

interface Props extends CalendarProps {}

export const MyMultiPicker = ({ onChange, value, ...props }: Props) => {
  return <Calendar {...props} value={value}  onChange={onChange}/>;
};