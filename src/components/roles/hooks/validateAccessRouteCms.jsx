import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useHasRole from './userhasRole';
import { Spin } from 'antd';
import { UseUserEvent } from '@context/eventUserContext';
import { theRoleExists } from '@Utilities/roleValidations';
import { getOrganizationUser } from '@Utilities/organizationValidations';

function ValidateAccessRouteCms({ children }) {
  const { eventId } = children.props;
  const [component, setComponent] = useState(null);
  const [thisComponentIsLoading, setThisComponentIsLoading] = useState(true);

  let cEventUser = UseUserEvent();

  /** Validating role for the cms of an organization */
  useEffect(() => {
    showOrgCmsComponent();
  }, [children]);

  const showOrgCmsComponent = async () => {
    if (children?.key === 'cmsOrg') {
      let organizationId = children.props.org._id;
      let organizationUser = await getOrganizationUser(organizationId);
      let userRol = organizationUser[0]?.rol_id;

      let ifTheRoleExists = await theRoleExists(userRol);

      /** Se valida si el rol es administrador, si es asi devuelve true */
      const canClaimWithRolAdmin = useHasRole(ifTheRoleExists, userRol);

      if (canClaimWithRolAdmin) {
        setComponent(children);
        setThisComponentIsLoading(false);
      } else {
        setComponent(<Redirect to={`/noaccesstocms/withoutPermissions/true`} />);
        setThisComponentIsLoading(false);
      }
    }
  };

  /** validating role for the cms of an event */
  useEffect(() => {
    if (!cEventUser.value) return;
    showEventCmsComponent(cEventUser.value.rol_id);
  }, [cEventUser.value, children]);

  /** No se permite acceso al cms si el usuario no tiene eventUser */
  if (!cEventUser.value && cEventUser.status === 'LOADED') return <Redirect to={`/noaccesstocms/${eventId}/true`} />;

  const showEventCmsComponent = async (rol) => {
    /** obtenemos el listado de permisos para el rol del usuario actual */
    let ifTheRoleExists = await theRoleExists(rol);

    /** Se valida si el rol es administrador, si es asi devuelve true */
    const canClaimWithRolAdmin = useHasRole(ifTheRoleExists, rol);
    if (children?.key === 'cms') {
      if (canClaimWithRolAdmin) {
        setComponent(children);
        setThisComponentIsLoading(false);
      } else {
        setComponent(<Redirect to={`/noaccesstocms/${eventId}/true`} />);
        setThisComponentIsLoading(false);
      }
    } else {
      setComponent(children);
      setThisComponentIsLoading(false);
    }
  };

  return (
    <Spin tip='Cargando...' size='large' spinning={thisComponentIsLoading}>
      {component}
    </Spin>
  );
}

export default ValidateAccessRouteCms;
