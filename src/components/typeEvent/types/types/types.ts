export interface Event {
  type_event: string | null;
  address: string | null;
  venue: string | null;
  url_external: string | null;
  where_it_run: string | null;
}

export type typeEvent = {
  loading?: boolean;
  event?: Event;
  handleFormDataOfEventType: (data: {}) => void;
};
