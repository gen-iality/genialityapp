import { FunctionComponent, useMemo } from 'react'
/** React's libraries */
import { FormattedMessage } from 'react-intl'

/** Antd imports */
import { Badge, Button, PageHeader, Typography } from 'antd'

/** Helpers and utils */
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed'

/** Context */
import { useEventContext } from '@context/eventContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useUserEvent } from '@context/eventUserContext'
import { useCurrentUser } from '@context/userContext'

const InfoEvent: FunctionComponent = () => {
  const cEvent = useEventContext()
  const { handleChangeTypeModal, eventIsActive } = useHelper()
  const cEventUser = useUserEvent()
  const cUser = useCurrentUser()

  const isSignedInShown = useMemo(() => {
    if (!cEvent.value) return false

    if (recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT') {
      if (cUser.value && cEventUser.value) {
        // Show the badge
        return true
      } else {
        return false
      }
    } else {
      // For public event, show the badge
      return true
    }
  }, [cUser.value, cEventUser.value, cEvent.value])

  return (
    <PageHeader
      style={{
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingTop: '10px',
        paddingBottom: '0', //20px
        margin: '20px',
        // border: `2px solid ${cEvent.value.styles.textMenu}`,
        border: `1px solid rgba(0,0,0,0.5)`,
        // boxShadow: '0px 0px 8px 5px #eee',
        borderRadius: '0.3em',
        backgroundColor: cEvent.value.styles.toolbarDefaultBg,
      }}
      title={
        <Typography.Title
          level={2}
          style={{
            color: cEvent.value.styles.textMenu,
            fontSize: '2.5rem',
            whiteSpace: 'normal',
          }}
        >
          {cEvent.value.name}
        </Typography.Title>
      }
      extra={
        isSignedInShown ? (
          <Badge
            style={{ backgroundColor: '#EA4602', marginRight: '3px' }}
            count="Inscrito"
          />
        ) : (
          <Button
            onClick={() => handleChangeTypeModal('registerForTheEvent')}
            type="primary"
            size="large"
            disabled={!eventIsActive}
          >
            <FormattedMessage id="Button.signup" defaultMessage="Inscribirme al curso" />
          </Button>
        )
      }
      // footer={
      //   <Space style={{ color: cEvent.value.styles.textMenu }}>
      //     <Space wrap>
      //       <Space>
      //         <CalendarOutlined />
      //         <time>{dayjs(cEvent.value.datetime_from).format('ll')}</time>
      //       </Space>
      //       <Space>
      //         <ClockCircleOutlined />
      //         <time>{dayjs(cEvent.value.datetime_from).format('LT')}</time>
      //       </Space>
      //     </Space>
      //     <Divider type="vertical"></Divider>
      //     <Space wrap>
      //       <Space>
      //         <CalendarOutlined />
      //         <time>{dayjs(cEvent.value.datetime_to).format('ll')}</time>
      //       </Space>
      //       <Space>
      //         <ClockCircleOutlined />
      //         <time>{dayjs(cEvent.value.datetime_to).format('LT')}</time>
      //       </Space>
      //     </Space>
      //   </Space>
      // }
    ></PageHeader>
  )
}

export default InfoEvent