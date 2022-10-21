import { OrganizationApi } from '@helpers/request';

/**
 * Get the user details for a member of an organization
 * @param orgId - The ID of the organization.
 * @param memberId - The ID of the user you want to get.
 * @returns The OrganizationUser object.
 */
export async function getOrganizationUser(orgId: string) {
  if (!orgId) return;
  const { data } = await OrganizationApi.getMeUser(orgId);

  return data;
}
