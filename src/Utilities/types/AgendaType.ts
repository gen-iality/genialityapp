// printed agenda keys from frontend:
// _id,name,subtitle,bigmaker_meeting_id,datetime_start,datetime_end,space_id,image,description,registration_message,capacity,activity_categories_ids,access_restriction_type,access_restriction_rol_ids,has_date,meeting_id,vimeo_id,platform,start_url,join_url,requires_registration,host_ids,length,latitude,selected_document,event_id,date_start_zoom,date_end_zoom,updated_at,created_at,role_attendee_ids,access_restriction_types_available,activity_categories,space,hosts,type,access_restriction_roles
// NOTE: where is real the agenda schema?

export default interface AgendaType {
  _id?: string,
  name: string,
  subtitle: string,
  bigmaker_meeting_id: any,
  datetime_start: any,
  datetime_end: any,
  space_id: any,
  image: any,
  description: string,
  registration_message: string,
  capacity: number,
  activity_categories_ids: any[],
  access_restriction_type: string,
  access_restriction_rol_ids: any[],
  has_date: boolean,
  timeConference: any,
  selected_document: any[],
  meeting_id: any,
  vimeo_id: any,
  selectedTicket: any[],
  platform: any,
  start_url: any,
  join_url: any,
  name_host: any,
  key: any,
  requires_registration: boolean,
  host_ids: any[] | null,
  length: string,
  latitude: string,
};

export interface ExtendedAgendaType extends AgendaType {
  type?: { name: string },
  video?: string | null,
};
