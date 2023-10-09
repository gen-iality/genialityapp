export interface GroupEvent {
  name: string;
  free_access_organization: boolean;
  event_ids: string[];
  organization_user_ids: string[];
}

export interface GroupEventMongo extends OptionType {
  item: {
    _id: string;
    organization_id: string;
    updated_at: string;
    created_at: string;
    amount_events: number;
  } & GroupEvent;
}

export interface OptionType {
  value: string;
  label: string;
  disabled?: boolean;
}
