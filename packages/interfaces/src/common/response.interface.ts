export interface IListResponse<T> {
  items: T[];
  totalCount: number;
}

export interface IUpdateResponse<T> {
  data: T;
  message: string;
}
