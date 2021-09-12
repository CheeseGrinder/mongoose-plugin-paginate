import { Document, FilterQuery, Model, PaginateResult, PopulateOptions, Schema, PaginateOption } from 'mongoose';

interface PaginationContext<T extends Document> {
  limit: number;
  page: number;
  select?: string[];
  populate?: PopulateOptions[];
  query: FilterQuery<T>;
}

class Paginator<T extends Document> {
  private model: Model<T>;
  private context: PaginationContext<T> = {} as PaginationContext<T>;

  constructor(model: Model<T>, { page = 1, limit = 10 }: PaginateOption) {
    this.model = model;
    this.context = {
      page,
      limit,
      query: {}
    };
  }

  select(fields: string | string[]): Paginator<T> {
    if (!Array.isArray(fields)) fields = [fields];
    this.context.select = fields;

    return this;
  }

  populate(options: PopulateOptions | PopulateOptions[]): Paginator<T> {
    if (!Array.isArray(options)) options = [options];
    this.context.populate = options;

    return this;
  }

  query(options: FilterQuery<T>): Paginator<T> {
    this.context.query = options;

    return this;
  }

  async exec(): Promise<PaginateResult<T>> {
    const { model } = this;
    const { query, page, limit, select } = this.context;

    const documentCount = await this.model.find(query).countDocuments();
    const pages = this.parse(Math.ceil(documentCount / limit));
    const hasPrev = page > 1;
    const hasNext = page < pages;
    const skip = limit * (page - 1);

    const documentsQuery = model.find(query).skip(skip).limit(limit);

    this.context.populate?.forEach(populate => {
      documentsQuery.populate(populate);
    });
    const documents = await documentsQuery.select(select).exec();

    return {
      docs: documents,
      docsCount: documentCount,
      page: page,
      limit: limit,
      pagesCount: pages,
      hasPrev: hasPrev,
      hasNext: hasNext
    };
  }

  private parse(value: any, defaultValue = 1): number {
    const number = +value;

    if (isNaN(number) || number < 1) return defaultValue;
    return number;
  }
}

export function mongoosePaginate(schema: Schema): void {
  schema.statics.paginate = function <T extends Document>(options: PaginateOption) {
    const model = this as Model<T>;
    return new Paginator(model, options);
  };
}
