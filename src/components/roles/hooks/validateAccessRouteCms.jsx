import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import useHasRole from './userhasRole';
import { HelperContext } from '../../../Context/HelperContext';
import { UseUserEvent } from '../../../Context/eventUserContext';
import NoMatchPage from '../../notFoundPage/noMatchPage';

function ValidateAccessRouteCms({ children }) {
  // console.log('debug ', children);
  const { eventId } = children.props;
  const [cEventUserRolId, setCEventUserRolId] = useState(null);
  const { allRolls } = useContext(HelperContext);
  console.log('debug helperContext', allRolls);
  let cEventUser = UseUserEvent();

  const helperContextRols = [
    {
      id: '5c1a59b2f33bd40bb67f2322',
      type: 'administrador',
    },
    {
      id: '60e8a7e74f9fb74ccd00dc22',
      type: 'attendee',
    },
  ];

  useEffect(() => {
    if (!cEventUser.value) return;
    setCEventUserRolId(cEventUser.value.rol_id);
  }, [cEventUser.value]);

  if (!cEventUser.value && cEventUser.status === 'LOADED') return <Redirect to={`/noaccesstocms/${eventId}`} />;

  const showComponent = () => {
    if (!cEventUser.value) return;
    /** Se valida si el rol es administrador, si es asi devuelve true */
    const canClaimWithRolAdmin = useHasRole(helperContextRols, cEventUserRolId);
    if (children?.key === 'cms') {
      if (canClaimWithRolAdmin) return children;
    } else {
      return children;
    }
    return <Redirect to={`/noaccesstocms/${eventId}`} />;
  };

  return <>{cEventUserRolId && showComponent()}</>;
}

export default ValidateAccessRouteCms;
