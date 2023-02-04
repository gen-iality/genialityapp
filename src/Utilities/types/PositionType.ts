/**
 * This is the type of data from API.
 * 
 * I KNOW that we have to use the camelCase
 */
export interface PositionResponseType {
  _id: string,
  position_name: string,
  event_ids: string[],
  organization_id: string,
  organization?: any,
  events?: any[],
}

export default interface PositionType {
  id: string,
  name: string,
  eventIDs: string[],
  organizationId: string,
  organization?: any,
  events?: any[],
}
