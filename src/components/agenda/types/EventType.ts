export default interface EventType {
  sms_notification: boolean | undefined;
  _id: string;
  name: string;
  vimeo_id: string;
  dates: string[];
  date_start: string;
  date_end: string;
}
