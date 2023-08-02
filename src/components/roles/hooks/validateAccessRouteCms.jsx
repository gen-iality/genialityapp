import { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import useHasRole from './userhasRole'
import { Spin } from 'antd'
import { useUserEvent } from '@context/eventUserContext'
import { theRoleExists } from '@Utilities/roleValidations'
import { getOrganizationUser } from '@Utilities/organizationValidations'
import { OrganizationApi } from '@helpers/request'

function ValidateAccessRouteCms({ children, isForEvent, isForOrganization }) {
  const { eventId } = children.props
  const [component, setComponent] = useState(null)
  const [thisComponentIsLoading, setThisComponentIsLoading] = useState(true)

  const cEventUser = useUserEvent()

  const showEventCmsComponent = async (rol) => {
    let canClaimWithOrganizationRolAdmin = false
    // Take the organization rol if exists
    const [organizationUser] = await OrganizationApi.mine()
    if (organizationUser) {
      const organizationRol = organizationUser.rol?._id
      const ifTheOrganizationRoleExists = await theRoleExists(organizationRol)
      /** Se valida si el rol es administrador, si es asi devuelve true */
      canClaimWithOrganizationRolAdmin = useHasRole(
        ifTheOrganizationRoleExists,
        organizationRol,
      )
    }
    /** obtenemos el listado de permisos para el rol del usuario actual */
    const ifTheRoleExists = await theRoleExists(rol)

    /** Se valida si el rol es administrador, si es asi devuelve true */
    const canClaimWithRolAdmin = useHasRole(ifTheRoleExists, rol)
    console.log('RolAdmin:', { canClaimWithRolAdmin, canClaimWithOrganizationRolAdmin })
    if (children?.key === 'cms') {
      if (canClaimWithRolAdmin || canClaimWithOrganizationRolAdmin) {
        setComponent(children)
        setThisComponentIsLoading(false)
      } else {
        setComponent(<Redirect to={`/noaccesstocms/${eventId}/true`} />)
        setThisComponentIsLoading(false)
      }
    } else {
      setComponent(children)
      setThisComponentIsLoading(false)
    }
  }

  const showOrgCmsComponent = async () => {
    const organizationId = children.props.org._id
    const organizationUser = await getOrganizationUser(organizationId)
    const userRol = organizationUser[0]?.rol_id

    const ifTheRoleExists = await theRoleExists(userRol)

    /** Se valida si el rol es administrador, si es asi devuelve true */
    const canClaimWithRolAdmin = useHasRole(ifTheRoleExists, userRol)

    if (canClaimWithRolAdmin) {
      setComponent(children)
      setThisComponentIsLoading(false)
    } else {
      setComponent(<Redirect to={`/noaccesstocms/withoutPermissions/true`} />)
      setThisComponentIsLoading(false)
    }
  }

  /** validating role for the cms of an event */
  useEffect(() => {
    if (isForOrganization) {
      showOrgCmsComponent()
      return
    }

    if (isForEvent) {
      if (!cEventUser.value) return
      showEventCmsComponent(cEventUser.value.rol_id)
      return
    }
  }, [cEventUser.value, children])

  /** No se permite acceso al cms si el usuario no tiene eventUser */
  if (!cEventUser.value && cEventUser.status === 'LOADED')
    return <Redirect to={`/noaccesstocms/${eventId}/true`} />

  return (
    <Spin tip="Cargando..." size="large" spinning={thisComponentIsLoading}>
      {component}
    </Spin>
  )
}

export default ValidateAccessRouteCms
