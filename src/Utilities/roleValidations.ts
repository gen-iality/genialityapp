import { RolAttApi } from '@/helpers/request';

/**
 * Get the permissions for a role in a given event.
 * @param rolId - The id of the role you want to check permissions for.
 * @returns The array of permissions for this role.
 */
export async function rolHasPermissions(rolId: string) {
  if (!rolId) return;
  let permissionsForThisRole = await RolAttApi.getRoleHasPermissionsinThisEvent(rolId);
  return permissionsForThisRole;
}

/**
 * Validate the existence of a specific role
 * @param rolId - The id of the role you want to validate exists
 * @returns The role object data.
 */
export async function theRoleExists(rolId: string) {
  if (!rolId) return;
  let ifTheRoleExists = await RolAttApi.ifTheRoleExists(rolId);

  return ifTheRoleExists;
}
