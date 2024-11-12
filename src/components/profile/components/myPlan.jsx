import { useState, useEffect, useContext } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Upload,
  Alert,
  PageHeader,
  List,
  Skeleton,
} from 'antd'
import { PictureOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import { useIntl } from 'react-intl'
import { saveImageStorage } from '@helpers/helperSaveImage'
import { UsersApi, OrganizationApi, OrganizationMembership } from '@helpers/request'
import ShieldAccountIcon from '@2fd/ant-design-icons/lib/ShieldAccount'
import { uploadImagedummyRequest } from '@Utilities/imgUtils'
import * as dayjs from 'dayjs'
import OrganizationPaymentConfirmationModal from '@/payments/OrganizationPaymentConfirmationModal'
import OrganizationPaymentSuccessModal from '@/payments/OrganizationPaymentSuccessModal'
import OrganizationPaymentModal from '@/payments/OrganizationPaymentModal'

import OrganizationPaymentContext from '@/payments/OrganizationPaymentContext'

const MyPlan = ({ cUser }) => {
  const { dispatch: paymentDispatch, ...paymentState } = useContext(
    OrganizationPaymentContext,
  )

  if (!cUser || cUser.status == 'LOADING') {
    return <p>Cargando... {cUser.status}</p>
  }

  console.log('cUser', cUser)
  const { value, setCurrentUser } = cUser
  const { names, picture, _id } = value

  const validateDefaultPicture =
    picture ===
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
      ? null
      : picture

  const [imageAvatar, setImageAvatar] = useState(
    validateDefaultPicture ? [{ url: validateDefaultPicture }] : validateDefaultPicture,
  )
  const [sendRecovery, setSendRecovery] = useState(null)
  const [userDataSentSuccessfullyOrWrongly, setUserDataSentSuccessfullyOrWrongly] =
    useState('initial')

  const [myMemberships, setMyMemberships] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const intl = useIntl()

  const ruleName = [
    { required: true, message: 'Ingrese un nombre para su cuenta en Evius!' },
  ]

  const uploadNewUserPicture = async () => {
    const selectedLogo = imageAvatar ? imageAvatar[0] : imageAvatar

    if (selectedLogo) {
      if (selectedLogo.thumbUrl) return await saveImageStorage(selectedLogo.thumbUrl)
      return selectedLogo.url
    }

    return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  }

  const editUserData = async (value) => {
    setSendRecovery(null)
    setUserDataSentSuccessfullyOrWrongly('initial')
    setIsLoading(true)
    setSendRecovery(
      `${intl.formatMessage({
        id: 'modal.restore.alert.passwordRequest',
        defaultMessage: 'Actualizando informacion.',
      })}`,
    )

    const nuewUserPicture = await uploadNewUserPicture()

    const body = {
      names: value.names,
      picture: nuewUserPicture,
    }
    setTimeout(async () => {
      try {
        const response = await UsersApi.editProfile(body, _id)
        setCurrentUser({ status: 'LOADED', value: response })
        setIsLoading(false)
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.passwordSuccess',
            defaultMessage: 'Se ha actualizado la información satisfactoriamente',
          })}`,
        )
        setUserDataSentSuccessfullyOrWrongly(true)
      } catch (error) {
        console.error(
          `%c📌debugger start, element Selected : error📌`,
          'font-family:calibri; background-color:#0be881; color: #1e272e; font-size:16px; border-radius:5px; margin:5px; padding:2px;border: 5px #fff; border-style: solid dashed',
          error,
        )
        setIsLoading(false)
        setUserDataSentSuccessfullyOrWrongly(false)
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.passwordError',
            defaultMessage: 'Error al actualizar la informacion',
          })}`,
        )
      }
    }, 1000)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const myMembershipsLoaded = await OrganizationMembership.mine()
        setMyMemberships(myMembershipsLoaded)
        console.log('paymnet myMembershipsLoaded', myMembershipsLoaded)

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Error fetching data', error.message)
        setIsLoading(false)
      }
    }

    fetchData() // Call the async function to fetch data
  }, []) // Empty array ensures the effect runs only once

  return (
    <>
      <Card style={{ borderRadius: '15px' }}>
        <ShieldAccountIcon
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '10px',
            fontSize: '50px',
            color: '#D0EFC1',
          }}
        />
        <PageHeader
          // avatar={{
          //   icon: <LockOutlined />,
          //   style: { backgroundColor: '#52C41A' },
          // }}
          title="Editar mi Plan"
        />
        {isLoading && <Skeleton active />}
        {!isLoading && (
          <div style={{ padding: '24px' }}>
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={myMemberships}
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.organization.name}>
                    <p>
                      {console.log('orgi', item)}
                      <strong>Duración: </strong> {item?.payment_plan?.days}
                    </p>
                    <p>
                      <strong>Inicio del Plan: </strong>
                      {item?.payment_plan && item?.payment_plan?.created_at}

                      {/* //dayjs(item?.payment_plan?.created_at).format('YYYY-MMMM-DD') */}
                    </p>
                    <p>
                      <strong>Finalización del Plan: </strong>
                      {item?.payment_plan && item?.payment_plan?.date_until}
                      {/*dayjs(item?.payment_plan?.date_until).format('YYYY-MMMM-DD') */}
                    </p>
                    <p>
                      {item?.payment_plan &&
                        (dayjs(item?.payment_plan?.date_until).diff(dayjs(), 'day') >=
                        0 ? (
                          <Alert message="PLAN ACTIVO" type="success" />
                        ) : (
                          <>
                            <Alert
                              onClick={() => paymentDispatch({ type: 'REQUIRE_PAYMENT' })}
                              action={
                                <Space direction="vertical">
                                  <Button size="small" type="primary">
                                    RENOVAR
                                  </Button>
                                </Space>
                              }
                              message="PLAN VENCIDO"
                              type="warning"
                            ></Alert>

                            <OrganizationPaymentConfirmationModal
                              organization={item.organization}
                            />
                            <OrganizationPaymentModal
                              organizationUser={item}
                              organization={item.organization}
                            />

                            <OrganizationPaymentSuccessModal
                              organizationUser={item}
                              organization={item.organization}
                            />
                          </>
                        ))}
                    </p>

                    {item?.payment_plan &&
                      dayjs(item?.payment_plan?.date_until).diff(dayjs(), 'day') < 0 && (
                        <p>
                          <strong> Días sobre pasados </strong>
                          {item?.payment_plan &&
                            dayjs(item?.payment_plan?.date_until).diff(dayjs(), 'day')}
                        </p>
                      )}

                    <p>
                      <strong>Precio:</strong>{' '}
                      {item?.payment_plan &&
                        (item?.payment_plan?.price ?? '').toLocaleString()}
                    </p>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}
      </Card>
    </>
  )
}

export default MyPlan
