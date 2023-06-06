import { Card, Result } from 'antd'
import { useParams } from 'react-router'
import PayForm from './payRegister'
import { useIntl } from 'react-intl'

const MessageRegister = () => {
  const intl = useIntl()
  const params = useParams()

  return (
    <>
      {params.type == 'pay' && <PayForm eventId={params.event_id} />}
      {params.type == 'free' && (
        <Card>
          <Result
            status="success"
            title={intl.formatMessage({ id: 'registration.message.success' })}
            subTitle={
              <h2 style={{ fontSize: '20px' }}>
                {intl.formatMessage({ id: 'registration.message.success.subtitle' })}
              </h2>
            }
          ></Result>
        </Card>
      )}
    </>
  )
}

export default MessageRegister
