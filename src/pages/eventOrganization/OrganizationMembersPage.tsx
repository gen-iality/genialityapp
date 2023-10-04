/** React's libraries */
import { FunctionComponent, useEffect, useState } from 'react'
import { FormattedDate, FormattedTime } from 'react-intl'
import dayjs from 'dayjs'

/** export Excel */
import { utils, writeFileXLSX } from 'xlsx'

/** Antd imports */
import { Table, Button, Row, Col, Tag } from 'antd'
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons'

/** Components */
import Header from '@antdComponents/Header'
import ModalMembers from '@components/modal/modalMembers'
import { columns } from './tableColums/membersTableColumns'

/** Helpers and utils */
import { OrganizationApi, EventsApi, AgendaApi, PositionsApi } from '@helpers/request'

/** Context */
import { FB } from '@helpers/firestore-request'
import { StateMessage } from '@context/MessageService'

interface IOrganizationMembersPageProps {
  org: any
}

const OrganizationMembersPage: FunctionComponent<IOrganizationMembersPageProps> = (
  props,
) => {
  const { _id: organizationId, access_settings } = props.org

  /** Data States */
  const [membersDataSource, setMembersDataSource] = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<any>()
  const [orgUsersList, setOrgUsersList] = useState<any[]>([])
  const [orgEventsList, setOrgEventsList] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>({})
  const [userActivities, setUserActivities] = useState<any>({})

  /** Flag States */
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRenderModal, setShouldRenderModel] = useState(false)
  const [isEditingThetMember, setIsEditingThetMember] = useState(false)

  /** Columns CMS States */
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [extraFields, setExtraFields] = useState<any[]>([])

  const [filtersToDataSource, setFiltersToDataSource] = useState<any>({})

  useEffect(() => {
    startingComponent()
  }, [])

  useEffect(() => {
    updateDataMembers()
  }, [orgUsersList, userActivities])

  useEffect(() => {
    async function interna() {
      const userActivitiesData = await getEventsStatisticsData(
        orgUsersList,
        orgEventsList,
      )
      setUserActivities(userActivitiesData)
    }

    interna()
  }, [orgUsersList, orgEventsList])

  const startingComponent = async () => {
    setLastUpdate(new Date())
    await setFormFields()
    await getOrgUsersList()
    await getOrgEventsList()
  }

  const getEventsStatisticsData = async (orgUsersList: any[], orgEventsList: any[]) => {
    const userActivitiesData: any = {}

    for (
      let indexOrganization = 0;
      indexOrganization < orgUsersList.length;
      indexOrganization++
    ) {
      const userId = orgUsersList[indexOrganization].account_id
      const email = orgUsersList[indexOrganization].user?.email

      let totalActividades = 0
      let totalActividadesVistas = 0

      for (let indexEvent = 0; indexEvent < orgEventsList.length; indexEvent++) {
        const eventId = orgEventsList[indexEvent]._id

        const thing = await EventsApi.getStatusRegister(eventId, email)
        if (thing.data.length === 0) continue
        const eventUser = thing.data[0]

        const { data: activities } = (await AgendaApi.byEvent(eventId)) as { data: any[] }

        const allAttendees = await FB.Attendees.getEventUserActivities(
          activities.map((activity) => activity._id),
          eventUser._id,
        )

        // Filter non-null result that means that the user attendees them
        const attendee = allAttendees.filter((attendee) => attendee !== undefined)
        totalActividades += activities.length
        totalActividadesVistas += attendee.length
      }
      userActivitiesData[userId] = `${totalActividadesVistas}/${totalActividades}`
      console.log('2. userActivitiesData[userId]', userActivitiesData[userId])
    }

    console.log('2. userActivitiesData', userActivitiesData)

    return userActivitiesData
  }

  async function updateDataMembers() {
    const allMemberFields: any[] = []

    console.log('1. orgUsersList', orgUsersList)

    const positionList = await getPositionList()

    orgUsersList?.map(async (orgUser) => {
      console.log('Estado - Lista de cargos', positionList)

      const properties = {
        names: orgUser.user?.names,
        email: orgUser.user?.email,
        ...orgUser.properties,
        _id: orgUser._id,
        created_at: orgUser.created_at,
        updated_at: orgUser.updated_at,
        role: orgUser.rol?.name || 'Sin rol',
        rol_id: orgUser.rol_id || null,
        picture: orgUser.user?.picture,
        position: orgUser.position?.position_name || 'Sin cargo',
        position_id: orgUser.position?._id || null,
        stats: userActivities[orgUser.account_id],
        payment_plan: orgUser.payment_plan,
      }

      allMemberFields.push(properties)
    })

    console.log('Variable - Miembros de la organización', allMemberFields)

    setMembersDataSource(allMemberFields)
    setIsLoading(false)
  }

  async function getOrgUsersList() {
    const { data: orgUsers } = await OrganizationApi.getUsers(organizationId)
    console.log('Petición de solicitud - Usuarios de la organización: ', orgUsers)
    setOrgUsersList(orgUsers)
  }

  async function getOrgEventsList() {
    const { data: orgEvents } = await OrganizationApi.events(organizationId)
    console.log('Petición de solicitud - Cursos de la organización: ', orgEvents)
    setOrgEventsList(orgEvents)
  }

  async function getPositionList() {
    const positionListData: any[] = await PositionsApi.getAllByOrganization(
      organizationId,
    )
    console.log('Petición de solicitud - Lista de Cargos : ', positionListData)

    const positionsOptions = positionListData.map((position) => {
      return {
        label: position.position_name,
        value: position._id,
      }
    })

    return positionsOptions
  }

  const getRolesAsOptions = async () => {
    const roles: any[] = await OrganizationApi.Roles.getAll(organizationId)
    return (roles || []).map((role) => ({
      value: role._id,
      label: role.name,
      type: role.type,
    }))
  }

  async function setFormFields() {
    const positionList = await getPositionList()
    const rolList = await getRolesAsOptions()

    const positionField = {
      name: 'position_id',
      label: 'Cargo',
      unique: false,
      index: 2,
      mandatory: false,
      order_weight: 3,
      type: 'list',
      options: positionList,
      _id: { $oid: '614260d226e7862220497eac3' },
    }

    const rolField = {
      name: 'rol_id',
      label: 'Rol',
      mandatory: true,
      type: 'list',
      options: rolList,
    }

    setExtraFields([...props.org.user_properties, positionField, rolField])
  }

  const exportFile = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const ws = utils.json_to_sheet(
      membersDataSource
        .map((user) => {
          delete user._id
          delete user.created_at
          delete user.updated_at
          delete user.position
          delete user.position_id
          delete user.rol_id
          delete user.stats
          delete user.picture
          // What else?
          const { password } = user
          if (password) {
            user['documento de identidad'] = password
            delete user.password
          }
          return user
        })
        .map((user) => {
          if (user.payment_plan) {
            let fieldValue = 'Acceso'
            if (user.payment_plan.price) {
              fieldValue += ` pagado $${user.payment_plan.price}`
            }
            if (user.payment_plan.date_until) {
              fieldValue += ` - hasta ${dayjs(user.payment_plan.date_until).format(
                'DD/MM/YYYY',
              )}`
            }
            user.payment_plan = fieldValue
          } else {
            user.payment_plan = 'Sin acceso'
          }
          return user
        })
        .filter((user) => {
          // Before we send the user data, we have to check if its dataIndex
          // contains a filtered value to remove this value
          return Object.entries(filtersToDataSource).every(([key, value]) => {
            if (typeof user[key] === 'undefined' || user[key] === undefined) return true
            return user[key] === value
          })
        }),
    )
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Members')
    writeFileXLSX(wb, `Miembros_${dayjs().format('l')}.xlsx`)
  }

  const closeOrOpenModalMembers = () => {
    setShouldRenderModel((prevState) => !prevState)
  }

  const addUser = () => {
    setSelectedUser({})
    closeOrOpenModalMembers()
    setIsEditingThetMember(false)
  }

  const editModalUser = (item: any) => {
    setSelectedUser(item)
    closeOrOpenModalMembers()
    setIsEditingThetMember(true)
  }

  const thisDataIndexWasFiltered = (currentDataIndex: any, filterValue: any) => {
    console.info('this dataIndex was filtered', currentDataIndex, filterValue)

    setFiltersToDataSource((previous: any) => {
      const clone = { ...previous }
      if (typeof filterValue === 'undefined' || filterValue === undefined) {
        // Remove this dataIndex if the value is undefined only
        delete clone[currentDataIndex]
      } else {
        // Update the new value
        clone[currentDataIndex] = filterValue
      }
      return clone
    })
  }

  const togglePaymentPlan = async (_organizationMember: any) => {
    const organizationMember = {
      ..._organizationMember,
      payment_plan: _organizationMember.payment_plan
        ? null
        : {
            date_until: dayjs(Date.now())
              .add(access_settings?.days ?? 15, 'day')
              .toDate(),
            price: access_settings?.price ?? 0,
          },
    }

    const result = await OrganizationApi.editUser(
      organizationId,
      organizationMember._id,
      organizationMember,
    )
    console.debug('changing payment plan: ', result)
    setIsLoading(true)
    await updateDataMembers()

    const moreInfo = organizationMember.payment_plan ? 'pago' : 'no pago'
    StateMessage.show(null, 'success', 'Estado del usuario cambiado a: ' + moreInfo)
  }

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
    thisDataIndexWasFiltered,
  }

  return (
    <>
      <Header title="Miembros" back />

      <p>
        <small>
          Última Sincronización : <FormattedDate value={lastUpdate} />{' '}
          <FormattedTime value={lastUpdate} />
        </small>
      </p>

      <p>
        <Tag>Inscritos: {membersDataSource.length || 0}</Tag>
      </p>

      <Table
        columns={columns(
          columnsData,
          editModalUser,
          extraFields,
          togglePaymentPlan,
          props.org,
        )}
        dataSource={membersDataSource}
        size="small"
        rowKey="index"
        pagination={{ pageSize: 50 }}
        loading={isLoading || membersDataSource.length === 0}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify="end" gutter={[8, 8]}>
            <Col>
              {membersDataSource.length > 0 && (
                <Button type="primary" icon={<DownloadOutlined />} onClick={exportFile}>
                  Exportar
                </Button>
              )}
            </Col>
            <Col>
              <Button type="primary" icon={<PlusCircleOutlined />} onClick={addUser}>
                Agregar
              </Button>
            </Col>
          </Row>
        )}
      />

      {shouldRenderModal && (
        <ModalMembers
          extraFields={extraFields}
          value={selectedUser}
          editMember={isEditingThetMember}
          closeOrOpenModalMembers={closeOrOpenModalMembers}
          organizationId={organizationId}
          startingComponent={startingComponent}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  )
}
export default OrganizationMembersPage
