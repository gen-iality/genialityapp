import { IPagination } from '@/components/assembly/types';

export interface IResultGet<T = any> {
  error: any | null;
  data: T;
  pagination?: IPagination;
}

export interface IResultPost<T = any> {
  error: null | any;

  data?: T;
  status?: number;
}
export interface IResultPut<T = any> {
  error: null | any;
  data?: T;
  status?: number;
}

export interface IResultDelete<T = any> {
  status?: number;
  error: null | any;
  data?: T;
}

export type TErrorsService = 'get' | 'add' | 'update' | 'delete';

export type TSuccesService = 'add' | 'update' | 'delete';

export interface IOptionsFeedbacks {
  overrideTitle?: string;
  plural?: boolean;
}

export interface IOptionsError extends IOptionsFeedbacks {}
export interface IOptionsSucces extends IOptionsFeedbacks {}
