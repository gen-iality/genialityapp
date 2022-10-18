// Base type
export interface Base {
  _id: string;
  created_at: Date | string;
  updated_at: Date | string;
}

// Dynamic
export interface WhereIs extends Base {
  event_id: string;
  title: string;
  start_date: Date | string;
  end_date: Date | string;

  published: boolean;
  active: boolean;

  points_per_like: number;
  posts: Post[];
}

export interface CreateWhereIsDto
  extends Omit<
    WhereIs,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'start_date'
    | 'end_date'
    | 'published'
    | 'active'
    | 'points_per_like'
    | 'posts'
  > {}

export interface UpdateWhereIsDto extends Partial<Omit<WhereIs, 'id' | 'created_at' | 'updated_at'>> {}

export interface Post extends Base {
  dynamic_id: string;
  user_id: string;
  image: string;
  thumb: string;
  title: string;
}
