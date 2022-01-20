const userHasRole = (rolesPermisionsForThisEvent, cEventUserRolId) => {
  let arrrayRolesPermisionsForThisEvent = rolesPermisionsForThisEvent.data;
  if (!cEventUserRolId) {
    return false;
  }
  if (typeof rolesPermisionsForThisEvent === 'string') {
    return cEventUserRolId === rolesPermisionsForThisEvent;
  } else if (Array.isArray(arrrayRolesPermisionsForThisEvent)) {
    const thisRoleExists = arrrayRolesPermisionsForThisEvent.find((role) => role.rol_id === cEventUserRolId);
    return thisRoleExists?.rol.type === 'admin';
  }
  return false;
};

export default userHasRole;
