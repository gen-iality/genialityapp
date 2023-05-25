/** ant design */
import { notification } from 'antd'
import {
  WifiOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
  DiffOutlined,
} from '@ant-design/icons'

function notifications(setNotification, viewNotification) {
  notification.open({
    message: `${viewNotification.message}`,
    description: viewNotification.description,
    icon:
      viewNotification.type == 'open' ? (
        <WifiOutlined />
      ) : viewNotification.type == 'closed' ? (
        <LoadingOutlined />
      ) : viewNotification.type == 'ended' ? (
        <PlayCircleOutlined />
      ) : (
        <DiffOutlined />
      ),
    duration: viewNotification.type == 'open' ? 6 : 3,
    onClick:
      viewNotification.type == 'open'
        ? () => {
            if (viewNotification.type == 'open') {
              setNotification({
                message: null,
                type: null,
              })
            }
          }
        : viewNotification.type == 'survey'
        ? () => {}
        : null,
    onClose: () => {},
  })
}

export default notifications
