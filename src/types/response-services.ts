import { IPagination } from '@/components/assembly/types';

export interface IResultGet<T = any> {
  ok: boolean;
  error: any | null;
  data: T;
  pagination?: IPagination;
}

export interface IResultPost<T = any> {
  ok: boolean;

  data?: T;
}

export interface IResultDelete {
  ok: boolean;
}

export type TErrorsServiceCartons = 'get' | 'add' | 'update' | 'delete';

export type TSuccesServiceCartons = 'add' | 'update' | 'delete';
