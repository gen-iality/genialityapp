import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import useHasRole from './userhasRole';
import { Spin } from 'antd';
import { HelperContext } from '../../../Context/HelperContext';
import { UseUserEvent } from '../../../Context/eventUserContext';

function ValidateAccessRouteCms({ children }) {
  // console.log('debug children', children.key);
  const { eventId } = children.props;
  const [cEventUserRolId, setCEventUserRolId] = useState(null);
  const [thisComponentIsLoading, setThisComponentIsLoading] = useState(true);
  const { theRoleExists } = useContext(HelperContext);

  let cEventUser = UseUserEvent();

  /** Validating role for the cms of an organization */
  useEffect(() => {
    showOrgCmsComponent();
  }, [children]);

  const showOrgCmsComponent = async () => {
    if (children?.key === 'cmsOrg') {
      setCEventUserRolId(children);
      setThisComponentIsLoading(false);
    }
  };

  /** validating role for the cms of an event */
  useEffect(() => {
    if (!cEventUser.value) return;
    showEventCmsComponent(cEventUser.value.rol_id);
  }, [cEventUser.value, children]);

  /** No se permite acceso al cms si el usuario no tiene eventUser */
  if (!cEventUser.value && cEventUser.status === 'LOADED') return <Redirect to={`/noaccesstocms/${eventId}`} />;

  const showEventCmsComponent = async (rol) => {
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
}

export default ValidateAccessRouteCms;
