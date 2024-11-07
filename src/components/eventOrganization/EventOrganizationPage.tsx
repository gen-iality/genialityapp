import { Col, Row, Typography, Badge, Space, Divider, Image, Empty, Button } from 'antd'
import { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { OrganizationFuction } from '@helpers/request'
import EventCard from '../shared/eventCard'
import dayjs from 'dayjs'
import ModalLoginHelpers from '../authentication/ModalLoginHelpers'
import { EditOutlined } from '@ant-design/icons'
import Loading from '@components/profile/loading'
import { useCurrentUser } from '@context/userContext'
import { OrganizationApi, TicketsApi } from '@helpers/request'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import OrganizationPaymentConfirmationModal from '../../payments/OrganizationPaymentConfirmationModal'
import OrganizationPaymentSuccessModal from '../../payments/OrganizationPaymentSuccessModal'
import OrganizationPaymentModal from '../../payments/OrganizationPaymentModal'
import OrganizationPaymentContext from '@/payments/OrganizationPaymentContext'
import useIsDevOrStage from '@/hooks/useIsDevOrStage'
const { Title, Text, Paragraph } = Typography

const EventOrganizationPage = () => {
  const params = useParams()
  const orgId = params.id

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [lastEvents, setLastEvents] = useState<any[]>([])
  const [organization, setOrganization] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisibleRegister, setIsVisibleRegister] = useState(false)
  const [organizationUser, setOrganizationUser] = useState<any | null>(null)
  const [myEvents, setMyEvents] = useState<any[]>([])

  const [isAdminUser, setIsAdminUser] = useState(false)

  const cUser = useCurrentUser()
  const { helperDispatch } = useHelper()

  const { dispatch: paymentDispatch, ...paymentState } = useContext(
    OrganizationPaymentContext,
  )

  const { isNotProd } = useIsDevOrStage()

  const showAuthFormToOnlyAddOrganizationMember = () => {
    console.debug('calling showAuthFormToOnlyAddOrganizationMember', { orgId })
    let positionId = organization.default_position_id || undefined

    helperDispatch({
      type: 'showRegister',
      visible: true,
      organizationId: orgId,
      defaultPositionId: positionId,
      customPasswordLabel: organization.access_settings?.custom_password_label,
      onlyAddOrganizationMember: true,
    })
  }

  // Obtener los datos necesarios de la organización
  const fetchItem = async (orgId: string) => {
    const events: any[] = await OrganizationFuction.getEventsNextByOrg(orgId)
    const _upcomingEvents: any[] = []
    const _lastEvents: any[] = []
    const currentDateNow = dayjs()
    events.forEach((event) => {
      if (dayjs(event.datetime_from).isAfter(currentDateNow)) {
        _upcomingEvents.push(event)
      } else {
        _lastEvents.push(event)
      }
    })

    const _organization = await OrganizationFuction.obtenerDatosOrganizacion(orgId)
    if (events) {
      setUpcomingEvents(_upcomingEvents)
      setLastEvents(_lastEvents) // Reverse that list to show older events as first ._.
      setOrganization(_organization)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (orgId) {
      fetchItem(orgId).then(() => setIsLoading(false))
    }
  }, [orgId])

  useEffect(() => {
    if (cUser.value || !organization || !orgId) return
    if (!cUser.value && organization) {
      let positionId = organization.default_position_id || undefined

      console.log('5. positionId', positionId, 'orgId', orgId)
      helperDispatch({
        type: 'showRegister',
        visible: true,
        organizationId: orgId,
        defaultPositionId: positionId,
        customPasswordLabel: organization.access_settings?.custom_password_label,
      })
    }
  }, [cUser.value, organization, orgId])

  useEffect(() => {
    if (!organization) return
    if (!cUser.value) return
    if (organizationUser) return
    const { visibility, allow_register } = organization
    console.log('organization access', { visibility, allow_register })
    if (visibility === 'PUBLIC' && allow_register) {
      //helperDispatch({ type: 'showRegister', visible: true });
      setIsVisibleRegister(true)
    }
  }, [organizationUser, organization, cUser.value])

  useEffect(() => {
    if (!cUser.value) return
    if (!orgId) return

    OrganizationApi.getMeUser(orgId).then(({ data }) => {
      const [orgUser] = data
      setOrganizationUser(orgUser)
      console.debug('EventOrganization member rol:', orgUser, orgUser?.rol)
      setIsAdminUser(orgUser?.rol?.type === 'admin')
    })

    let load_minetickets = async () => {
      let MyEvents = await TicketsApi.getAll()
      setMyEvents(MyEvents)
      console.log('mis eventos', MyEvents)
    }
    load_minetickets()
  }, [cUser.value, orgId])

  useEffect(() => {
    if (!organization || !organizationUser) return
    console.log('member plan:', organizationUser.payment_plan)
    if (organization.access_settings?.type === 'payment') {
      console.log('organizationUser', organizationUser)

      // Check if the organization user has an available payment plan
      let memberHadPaid = false
      if (organizationUser.payment_plan?.date_until !== undefined) {
        const today = dayjs(Date.now())
        const memberDateUntil = dayjs(organizationUser.payment_plan.date_until)
        if (memberDateUntil.isValid()) {
          const diff = memberDateUntil.diff(today, 'day')
          if (diff > 0) {
            /* Congratulation!!! */
            memberHadPaid = true
          }
        }
      }
      if (!!organizationUser.payment_plan && !memberHadPaid) {
        console.log('assume user is premium ⭐️⭐️⭐️', organizationUser.payment_plan)
        memberHadPaid = true
      }

      //
      if (memberHadPaid) {
        // Nothing, ok
        console.log('This organization has paid access - the user too')
      } else {
        paymentDispatch({ type: 'REQUIRE_PAYMENT' })
        console.log('This organization has paid access - the user CAN NOT')
      }
    } else {
      console.log('This organization has free access :))))')
    }
  }, [organization, organizationUser])

  return (
    <div
      style={{
        backgroundImage: `url(${organization?.styles?.BackgroundImage})`,
        backgroundColor: `${organization?.styles?.containerBgColor || '#FFFFFF'}`,
      }}
    >
      <OrganizationPaymentConfirmationModal organization={organization} />

      <OrganizationPaymentModal
        organizationUser={organizationUser}
        organization={organization}
      />

      <OrganizationPaymentSuccessModal
        organizationUser={organizationUser}
        organization={organization}
      />
      {/*
        <div>
          <Button onClick={() => paymentDispatch({ type: 'REQUIRE_PAYMENT' })}>
            REQUIRE_PAYMENT
          </Button>
          <Button onClick={() => paymentDispatch({ type: 'DISPLAY_REGISTRATION' })}>
            DISPLAY_REGISTRATION
          </Button>
          <Button onClick={() => paymentDispatch({ type: 'DISPLAY_PAYMENT' })}>
            DISPLAY_PAYMENT
          </Button>

          <Button onClick={() => paymentDispatch({ type: 'DISPLAY_SUCCESS' })}>
            DISPLAY_SUCCESS
          </Button>
        </div>
      */}
      <ModalLoginHelpers />

      {!isLoading && orgId ? (
        <>
          {/* BANNER */}
          {organization !== null && (
            <div style={{ width: '100%' }}>
              {organization.styles?.banner_image !== null || '' ? (
                <img
                  style={{ objectFit: 'cover', width: '100%', maxHeight: '100%' }}
                  src={organization.styles?.banner_image}
                />
              ) : (
                ''
              )}
            </div>
          )}

          <div
            style={{
              paddingLeft: '5vw',
              paddingRight: '5vw',
              paddingBottom: '5vw',
              paddingTop: '0.5vw',
            }}
          >
            {organizationUser && (
              <Badge
                count={`${
                  organizationUser.payment_plan ? 'Plan Premium' : 'Plan gratuito'
                }`}
                style={{
                  backgroundColor: organizationUser.payment_plan ? '#797' : '#777',
                }}
              />
            )}
            {isAdminUser && (
              <Link
                to={`/admin/organization/${orgId}`}
                style={{
                  marginBottom: '-15px',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                <Button type="text" icon={<EditOutlined />}>
                  Administrar
                </Button>
              </Link>
            )}
            {organization.styles.show_icon_title_and_description_container && (
              <Row
                gutter={[10, 10]}
                style={{
                  marginBottom: '40px',
                  marginTop: '20px',
                  backgroundColor: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '20px',
                }}
              >
                <Col xs={24} sm={24} md={24} lg={8} xl={4} xxl={4}>
                  <Row justify="start">
                    <Image
                      style={{
                        borderRadius: '20px',
                        objectFit: 'cover',
                        border: '4px solid #FFFFFF',
                        backgroundColor: '#FFFFFF',
                      }}
                      preview={{ maskClassName: 'roundedMask' }}
                      src={organization?.styles?.event_image || 'error'}
                      fallback="http://via.placeholder.com/500/F5F5F7/CCCCCC?text=No%20Image"
                      width="100%"
                      height="100%"
                    />
                  </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={16} xl={20} xxl={20}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text
                      style={{
                        fontSize: '40px',
                        fontWeight: '600',
                        lineHeight: '2.25rem',
                      }}
                      type="secondary"
                    >
                      {organization.name}
                    </Text>
                    <Paragraph
                      ellipsis={{
                        rows: 3,
                        expandable: true,
                        symbol: (
                          <span style={{ color: '#2D7FD6', fontSize: '12px' }}>
                            Ver más
                          </span>
                        ),
                      }}
                    >
                      {organization?.description || ''}
                    </Paragraph>
                  </Space>
                </Col>
              </Row>
            )}
            {/* Lista de cursos pasados -> 'Disponibles' */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '20px',
              }}
            >
              <Row
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <Col>
                  <Badge offset={[60, 22]} count={`${lastEvents.length} Cursos`}>
                    <Title level={2}>Disponibles</Title>
                  </Badge>
                </Col>
                <Col>
                  {cUser.value &&
                    !organizationUser &&
                    organization?.access_settings?.type === 'payment' && (
                      <Button
                        danger
                        type="primary"
                        onClick={() => showAuthFormToOnlyAddOrganizationMember()}
                      >
                        Inscribirse
                      </Button>
                    )}
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                {lastEvents?.length > 0 ? (
                  [...lastEvents]
                    .sort(
                      (a, b) =>
                        Number(new Date(b.created_at)) - Number(new Date(a.created_at)),
                    )
                    .map((event, index) => (
                      <>
                        {/*  Si el curso es privado y no estoy inscrito no se ve en el listado de la organización*/}
                        {(event.visibility != 'PRIVATE' ||
                          myEvents.filter((mye) => mye.event_id == event._id).length >
                            0) && (
                          <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                            <EventCard
                              paymentDispatch={paymentDispatch}
                              organizationUser={organizationUser}
                              organization={organization}
                              noDates
                              bordered={false}
                              key={event._id}
                              event={event}
                              action={{ name: 'Ver', url: `landing/${event._id}` }}
                            />
                          </Col>
                        )}
                      </>
                    ))
                ) : (
                  <div
                    style={{
                      height: '250px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Empty description="No hay cursos pasados" />
                  </div>
                )}
              </Row>
            </div>
            <Divider />
            {/* Lista de cursos próximos */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '20px',
              }}
            >
              <Badge offset={[60, 22]} count={`${upcomingEvents.length} Cursos`}>
                <Title level={2}>Próximos</Title>
              </Badge>
              <Row gutter={[16, 16]}>
                {upcomingEvents?.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                      <EventCard
                        noDates
                        bordered={false}
                        key={event._id}
                        event={event}
                        action={{ name: 'Ver', url: `landing/${event._id}` }}
                        noAvailable
                        paymentDispatch={paymentDispatch}
                        organizationUser={organizationUser}
                        organization={organization}
                      />
                    </Col>
                  ))
                ) : (
                  <div
                    style={{
                      height: '250px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Empty description="No hay cursos próximos agendados" />
                  </div>
                )}
              </Row>
            </div>
          </div>
          {/* FOOTER */}
          {organization !== null && (
            <div style={{ width: '100%', maxHeight: '350px' }}>
              {organization.styles?.banner_footer || '' ? (
                <img
                  style={{ objectFit: 'cover', width: '100%', maxHeight: '250px' }}
                  src={organization.styles?.banner_footer}
                />
              ) : (
                ''
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
          <Loading />
        </div>
      )}
    </div>
  )
}

export default EventOrganizationPage
