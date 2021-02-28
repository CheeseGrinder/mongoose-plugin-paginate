declare module 'mongoose' {
  interface PaginateOption<T extends Document> {
    query?: FilterQuery<T>;
    page?: number;
    limit?: number;
    populate?: PopulateOptions | PopulateOptions[];
  }

  interface PaginateResult<T extends Document> {
    docs: T[];
    docsCount: number;
    page: number,
    logicalPage: number,
    limit: number;
    pagesCount: number;
    hasPrev: boolean;
    hasNext: boolean;
  }

  interface PaginateModel<T extends Document> extends Model<T> {
    paginate(): Promise<PaginateResult<T>>;
    paginate(options: PaginateOption<T>): Promise<PaginateResult<T>>;
  }

  function model<T extends Document>(name: string, schema?: Schema<T>, collection?: string, skipInit?: boolean): PaginateModel<T>;
}