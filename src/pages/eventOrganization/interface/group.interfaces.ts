export interface GroupEvent {
  name: string;
  free_access_organization : boolean;
}

export interface GroupEventMongo extends OptionType {
  item: {
    _id: string;
    name: string;
    organization_id: string;
    updated_at: string;
    created_at: string;
    amount_events: number;
    free_access_organization : boolean;
  };
}

export interface OptionType {
  value: string;
  label: string;
  disabled?: boolean;
}
