import * as Moment from 'moment';

export default interface FormularyType {
  name: string,
  date: any,
  hour_start: string | Moment.Moment,
  hour_end: string | Moment.Moment,
  selectedHosts: any[],
  space_id: string,
  selectedCategories: any[],
  isPhysical: boolean,
  length: string,
  latitude: string,
  description: string,
  image: string,
};
