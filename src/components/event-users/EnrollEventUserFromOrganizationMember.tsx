/**
 * This component will replace the legacy code.
 *
 * This is the 1 of 65 parts (?)
 *
 * NOTE: The name can change in a future...
 */

import { FunctionComponent, useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Button,
  Comment,
  Input,
  InputRef,
  List,
  Modal,
  Result,
  Space,
  Table,
  Tabs,
} from 'antd'
import Highlighter from 'react-highlight-words'
import RegisterUserAndEventUser from '@components/authentication/RegisterUserAndEventUser'
import { AttendeeApi, OrganizationApi } from '@helpers/request'
import {
  CheckOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { UsersApi } from '@helpers/request'
import { StateMessage } from '@context/MessageService'
import { useIntl } from 'react-intl'
import { ColumnsType } from 'antd/lib/table'
import { FilterConfirmProps } from 'antd/lib/table/interface'
import { ColumnType } from 'antd/es/table'

const stylePaddingDesktop = {
  paddingLeft: '30px',
  paddingRight: '30px',
  textAlign: 'center',
}

const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
}

interface IEnrollEventUserFromOrganizationMemberProps {
  orgId?: string
  eventId?: string
  onClose?: () => void
}

// TODO: take a enrolled user to show as added already

const EnrollEventUserFromOrganizationMember: FunctionComponent<
  IEnrollEventUserFromOrganizationMemberProps
> = (props) => {
  const { eventId, orgId, onClose = () => {} } = props

  const [isLoadingOrgMembers, setIsLoadingOrgMembers] = useState(false)
  const [isLoadingEventUsers, setIsLoadingEventUsers] = useState(false)
  const [thisOrganizationMemberIsEnrolling, setThisOrganizationMemberIsEnrolling] =
    useState<string | undefined>()
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [orgMembers, setOrgMembers] = useState<any[]>([])
  const [eventUsers, setEventUsers] = useState<any[]>([])
  const [canEnrollFromOrganization, setCanEnrollFromOrganization] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')

  const inputRef = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (
    alias: string,
    howToRender: (value: any) => string,
  ): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          placeholder={`Search ${alias}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, alias)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, alias)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(alias)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return howToRender(record)
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => inputRef.current?.select(), 100)
      }
    },
    render: (item) => {
      const renderedText = howToRender(item)
      return searchedColumn === alias ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={renderedText ? renderedText.toString() : ''}
        />
      ) : (
        renderedText
      )
    },
  })

  const [columns] = useState<ColumnsType>([
    {
      title: '',
      dataIndex: 'picture',
      render: (element) => <Avatar src={element} />,
    },
    {
      title: 'Cargo',
      render: (item) => <>{item.position_name || 'Sin cargo'}</>,
      sorter: (a: any, b: any) => a.position_name?.length - b.position_name?.length,
      ...getColumnSearchProps('cargo', (item) => item.position_name || 'Sin cargo'),
    },
    {
      title: 'Nombre',
      render: (item) => <>{item.user.names}</>,
      sorter: (a: any, b: any) => a.user.names.length - b.user.names.length,
      ...getColumnSearchProps('nombre', (item) => item.user.names),
    },
    {
      title: 'Email',
      render: (item) => <>{item.user.email}</>,
      sorter: (a: any, b: any) => a.user.email.length - b.user.email.length,
      ...getColumnSearchProps('correo', (item) => item.user.email),
    },
    {
      title: 'Opciones',
      render: (member) => (
        <Button
          key={member._id}
          type={checkEnrolling(member.user._id) ? 'primary' : 'dashed'}
          onClick={() => {
            console.log('enroll', { user: member.user })
            enrollOrganizationMember(member.user).then(() => loadEventUsers())
          }}
          disabled={
            thisOrganizationMemberIsEnrolling === member.user._id ||
            checkEnrolling(member.user._id)
          }
          icon={
            checkEnrolling(member.user._id) ? (
              <CheckOutlined />
            ) : thisOrganizationMemberIsEnrolling === member.user._id ? (
              <LoadingOutlined />
            ) : (
              <PlusOutlined />
            )
          }
        ></Button>
      ),
    },
  ])

  const intl = useIntl()

  const loadOrganizationMembers = async () => {
    const { data: orgUsers } = await OrganizationApi.getUsers(orgId)
    console.log('orgUsers', orgUsers)
    setOrgMembers(orgUsers)
  }

  const loadEventUsers = async () => {
    const { data: attendees } = await AttendeeApi.getAll(eventId)
    console.log('attendees:', attendees)
    setEventUsers(attendees)
  }

  const reloadOrganizationMembers = () => {
    if (orgId) {
      setIsLoadingOrgMembers(true)
      loadOrganizationMembers().finally(() => setIsLoadingOrgMembers(false))
    } else {
      setCanEnrollFromOrganization(true)
    }
  }

  const reloadEventUsers = () => {
    if (eventId) {
      setIsLoadingEventUsers(true)
      loadEventUsers().finally(() => setIsLoadingEventUsers(false))
    } else {
      setIsLoadingEventUsers(false)
    }
  }

  const enrollOrganizationMember = async (user: any) => {
    setThisOrganizationMemberIsEnrolling(user._id)

    // Back-End says that the required params are:
    const userProperties = {
      properties: {
        email: user.email,
        names: user.names,
      },
    }
    console.debug('send userProperties:', userProperties)
    const noSendMail = true

    try {
      const respUser = await UsersApi.createOne(userProperties, eventId, noSendMail)
      if (respUser && respUser._id) {
        StateMessage.show(
          null,
          'success',
          intl.formatMessage({
            id: 'text_error.successfully_registered',
            defaultMessage: 'Te has inscrito correctamente a este curso',
          }),
        )
      }
    } catch (err) {
      console.error(err)
      StateMessage.show(null, 'error', 'No se ha podido registrar a ese usuario')
    } finally {
      setThisOrganizationMemberIsEnrolling(undefined)
    }
  }

  const checkEnrolling = (userId: string) => {
    return eventUsers.some((attendee) => attendee.user._id === userId)
  }

  useEffect(() => {
    setIsModalOpened(true)

    reloadOrganizationMembers()
    reloadEventUsers()
  }, [orgId])

  return (
    <Modal
      closable
      open={isModalOpened}
      onCancel={() => {
        onClose()
        setIsModalOpened(false)
      }}
      footer={false}
    >
      <Tabs onChange={() => reloadOrganizationMembers()}>
        <Tabs.TabPane tab="Desde datos" key="from-data">
          <RegisterUserAndEventUser
            screens={[]}
            stylePaddingMobile={stylePaddingMobile}
            stylePaddingDesktop={stylePaddingDesktop}
            requireAutomaticLoguin={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Desde miembros" key="from-org-member">
          {canEnrollFromOrganization ? (
            <Result
              status="warning"
              title="No implementado"
              subTitle="No se puede usar esto porque no se ha proporcionado datos de la organización"
            />
          ) : (
            <Table
              size="small"
              loading={isLoadingEventUsers || isLoadingOrgMembers}
              dataSource={orgMembers}
              columns={columns}
            />
          )}
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}

export default EnrollEventUserFromOrganizationMember
