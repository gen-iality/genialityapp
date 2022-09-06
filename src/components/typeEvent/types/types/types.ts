export interface Event {
  type_event: string;
  address: string;
  venue: string;
  url_external: string;
  where_it_run: string;
}

export type typeEvent = {
  loading?: boolean;
  event?: Event;
  handleFormDataOfEventType: (data: {}) => void;
};
