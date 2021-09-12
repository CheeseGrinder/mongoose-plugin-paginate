import 'mongoose';

declare module 'mongoose' {
  export interface Paginator<T extends Document> {
    select(...fields: string[]): Paginator<T>;
    select(fields: string | string[]): Paginator<T>;

    populate(options: PopulateOptions | PopulateOptions[]): Paginator<T>;
    query(options: FilterQuery<T>): Paginator<T>;

    exec(): Promise<PaginateResult<T>>;
  }

  export interface PaginateOption {
    page: number;
    limit: number;
  }

  export interface PaginateResult<T extends Document> {
    docs: T[];
    docsCount: number;
    page: number;
    limit: number;
    pagesCount: number;
    hasPrev: boolean;
    hasNext: boolean;
  }

  export interface PaginateModel<T extends Document> extends Model<T> {
    paginate(options: PaginateOption): Paginator<T>;
  }

  export function model<T extends Document>(
    name: string,
    schema?: Schema<T>,
    collection?: string,
    skipInit?: boolean
  ): PaginateModel<T>;
}

export * from './plugin';
