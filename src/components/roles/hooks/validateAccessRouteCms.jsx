import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import useHasRole from './userhasRole';
import { Spin } from 'antd';
import { HelperContext } from '../../../Context/HelperContext';
import { UseUserEvent } from '../../../Context/eventUserContext';
import Loading from 'components/profile/loading';
function ValidateAccessRouteCms({ children }) {
  // console.log('debug ', children);
  const { eventId } = children.props;
  const [cEventUserRolId, setCEventUserRolId] = useState(null);
  const [rolesPermisionsForThisEvent, setRolesPermisionsForThisEvent] = useState(null);
  const [thisComponentIsLoading, setThisComponentIsLoading] = useState(true);
  const { theRoleExists } = useContext(HelperContext);

  let cEventUser = UseUserEvent();

  useEffect(() => {
    if (!cEventUser.value) return;
    // console.log('debug rolId   ', cEventUser.value.rol_id);
    showComponent(cEventUser.value.rol_id);
  }, [cEventUser.value, children]);

  /** No se permite acceso al cms si el usuario no tiene eventUser */
  if (!cEventUser.value && cEventUser.status === 'LOADED') return <Redirect to={`/noaccesstocms/${eventId}`} />;

  const showComponent = async (rol) => {
    if (!cEventUser.value) return;
    /** obtenemos el listado de permisos para el rol del usuario actual */
    let ifTheRoleExists = await theRoleExists(rol);

    /** Se valida si el rol es administrador, si es asi devuelve true */
    const canClaimWithRolAdmin = useHasRole(ifTheRoleExists, rol);
    if (children?.key === 'cms') {
      // console.log('debug ', children?.key, canClaimWithRolAdmin);
      if (canClaimWithRolAdmin) {
        setCEventUserRolId(children);
        setThisComponentIsLoading(false);
      } else {
        setCEventUserRolId(<Redirect to={`/noaccesstocms/${eventId}`} />);
        setThisComponentIsLoading(false);
      }
    } else {
      setCEventUserRolId(children);
      setThisComponentIsLoading(false);
    }
  };

  return (
    <Spin tip='Cargando...' size='large' spinning={thisComponentIsLoading}>
      {cEventUserRolId}
    </Spin>
  );
  // return <>{thisComponentIsLoading ? <Loading /> : cEventUserRolId}</>;
}

export default ValidateAccessRouteCms;
