export interface HttpRes<T> {
  code: number;
  data: T;
  message: string;

  [key: string]: any;
}
