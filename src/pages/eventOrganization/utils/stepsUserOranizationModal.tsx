import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';

export const steps = [
  {
    title: 'First',
    icon: <AccountOutlineIcon style={{ fontSize: '32px' }} />,
  },
  {
    title: 'Second',
    icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px' }} />,
  },
  {
    title: 'Last',
    icon: <ScheduleOutlined style={{ fontSize: '32px' }} />,
  },
];
