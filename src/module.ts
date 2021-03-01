declare module 'mongoose' {

  export interface PaginateOption<T extends Document> {
    query?: FilterQuery<T>;
    page?: number;
    limit?: number;
    populate?: PopulateOptions | PopulateOptions[];
  }

  export interface PaginateResult<T extends Document> {
    docs: T[];
    docsCount: number;
    page: number,
    limit: number;
    pagesCount: number;
    hasPrev: boolean;
    hasNext: boolean;
  }

  export interface PaginateModel<T extends Document> extends Model<T> {
    paginate(): Promise<PaginateResult<T>>;
    paginate(options: PaginateOption<T>): Promise<PaginateResult<T>>;
  }

  export function model<T extends Document>(name: string, schema?: Schema<T>, collection?: string, skipInit?: boolean): PaginateModel<T>;
}