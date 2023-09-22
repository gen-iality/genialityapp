export type GroupByResources = 'observers' | 'spaces';

export interface ObjectReturn {
    resources?: any[];
    events?: any[];
    resourceAccessor?:string;
    buttonGroupBy?:string
}

export interface ObjectConfig extends Record<GroupByResources, ObjectReturn> { }