const userHasRole = (roleNames, cEventUserRolId) => {
  //   console.log('debug validator', roleNames, cEventUserRolId);
  if (!cEventUserRolId) {
    return false;
  }
  if (typeof roleNames === 'string') {
    return cEventUserRolId === roleNames;
  } else if (Array.isArray(roleNames)) {
    const thisRoleExists = roleNames.find((role) => role.id === cEventUserRolId);
    return thisRoleExists?.type === 'administrador';
  }
  return false;
};

export default userHasRole;
