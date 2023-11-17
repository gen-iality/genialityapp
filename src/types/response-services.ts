import { IPagination } from '@/components/assembly/types';

export interface IResultGet<T = any> {
  error: any | null;
  data: T;
  pagination?: IPagination;
}

export interface IResultPost<T = any> {
  error: null | any;

  data?: T;
}

export interface IResultDelete {
  error: null | any;
}

export type TErrorsService = 'get' | 'add' | 'update' | 'delete';

export type TSuccesService = 'add' | 'update' | 'delete';
