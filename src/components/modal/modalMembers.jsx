/** React's libraries */
import { useState } from 'react'

/** Antd imports */
import { Grid, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

/** Helpers and utils */
import { OrganizationApi, PositionsApi } from '@helpers/request'

/** Context */
import { StateMessage } from '@context/MessageService'
import { useHelper } from '@context/helperContext/hooks/useHelper'

/** Components */
import FormComponent from '../events/registrationForm/form'
import RegisterUserAndOrgMember from '@components/authentication/RegisterUserAndOrgMember'

const { confirm } = Modal
const { useBreakpoint } = Grid

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

function ModalMembers(props) {
  const organizationId = props.organizationId
  const userId = props.value._id
  const screens = useBreakpoint()

  const { controllerLoginVisible } = useHelper()

  const [loadingregister, setLoadingregister] = useState(false)

  const options = [
    {
      type: 'danger',
      text: 'Eliminar/Borrar',
      icon: <DeleteOutlined />,
      action: () => deleteUser(props.value),
    },
  ]

  async function deleteUser(user) {
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        StateMessage.show(
          'loading',
          'loading',
          ' Por favor espere mientras se borra la información...',
        )
        const onHandlerRemove = async () => {
          try {
            await OrganizationApi.deleteUser(organizationId, user._id)
            props.closeOrOpenModalMembers()
            StateMessage.destroy('loading')
            StateMessage.show(null, 'success', 'Se eliminó la información correctamente!')
            props.startingComponent()
          } catch (e) {
            StateMessage.destroy('loading')
            StateMessage.show(null, 'error', 'Hubo un error al eliminar')
          }
        }
        onHandlerRemove()
      },
    })
    /* try {
      await OrganizationApi.deleteUser(organizationId, user._id);
      props.closeOrOpenModalMembers();
      message.success('Eliminado correctamente');
      props.startingComponent();
    } catch (e) {
      message.error('Hubo un error al eliminar');
    } */
  }

  async function editOrgMember(values) {
    setLoadingregister(true)

    let resp

    if (props.editMember) {
      resp = await OrganizationApi.editUser(organizationId, userId, values)
      if (values.position_id) {
        await PositionsApi.Organizations.addUser(
          organizationId,
          values.position_id,
          resp.account_id,
        )
      }
    }

    if (resp._id) {
      StateMessage.show(
        null,
        'success',
        `Usuario ${props.editMember ? 'editado ' : 'agregado'} correctamente`,
      )
      props.setIsLoading(true)
      props.closeOrOpenModalMembers()
      props.startingComponent()
    } else {
      StateMessage.show(
        null,
        'error',
        `No fue posible ${props.editMember ? 'editar ' : 'agregar'} el Usuario`,
      )
    }
  }

  return (
    <>
      <Modal
        closable
        footer={false}
        visible
        onCancel={() => props.closeOrOpenModalMembers()}
      >
        <div
          style={{
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            marginTop: '30px',
          }}
        >
          {!props.editMember ? (
            <RegisterUserAndOrgMember
              screens={screens}
              stylePaddingMobile={stylePaddingMobile}
              stylePaddingDesktop={stylePaddingDesktop}
              idOrganization={organizationId} // New!
              defaultPositionId={controllerLoginVisible.defaultPositionId} // New!
              requireAutomaticLogin={false}
              startingComponent={props.startingComponent}
            />
          ) : (
            <FormComponent
              conditionalsOther={[]}
              initialOtherValue={props.value}
              eventUserOther={{}}
              fields={props.extraFields}
              organization
              options={options}
              callback={editOrgMember}
              loadingregister={loadingregister}
              editUser={props.editMember}
            />
          )}
        </div>
      </Modal>
    </>
  )
}

export default ModalMembers
