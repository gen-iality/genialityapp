import { DesktopOutlined, FileDoneOutlined, ReadFilled, VideoCameraOutlined } from '@ant-design/icons';
import { activityContentValues } from '@/context/activityType/constants/ui';
import { ActivityType } from '@/context/activityType/types/activityType';

interface ActivityCustomIconProps {
  type: ActivityType.ContentValue,
  [x: string]: any,
};

export const ActivityCustomIcon = ({type, ...props} : ActivityCustomIconProps) => {
  switch (type) {
    case activityContentValues.file:
    case activityContentValues.url:
      return <VideoCameraOutlined {...props} />
    case activityContentValues.meet:
    case activityContentValues.meeting:
    case activityContentValues.rtmp:
    case activityContentValues.youtube:
    case activityContentValues.vimeo:
    case activityContentValues.streaming:
      return <DesktopOutlined {...props}/>
    case activityContentValues.quizing:
    case activityContentValues.survey:
      return <FileDoneOutlined {...props}/>
    default: return <ReadFilled {...props}/>;
  }
};
