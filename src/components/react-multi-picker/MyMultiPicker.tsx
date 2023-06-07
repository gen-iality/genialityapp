import { Calendar, CalendarProps } from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/mobile.css';

interface Props extends CalendarProps {}

export const MyMultiPicker = ({ onChange, value, ...props }: Props) => {
  return <Calendar {...props} value={value}  onChange={onChange}/>;
};