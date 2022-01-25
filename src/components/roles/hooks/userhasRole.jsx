const userHasRole = (ifTheRoleExists, cEventUserRolId) => {
  if (!cEventUserRolId) {
    return false;
  }
  if (typeof ifTheRoleExists === 'string') {
    return cEventUserRolId === ifTheRoleExists;
  } else if (typeof ifTheRoleExists === 'object') {
    return ifTheRoleExists?.type === 'admin';
  }
  return false;
};

export default userHasRole;
