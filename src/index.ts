import { Document, Model, PaginateOption, PaginateResult, Schema } from 'mongoose';

const defaultOptions: PaginateOption<any> = {
  query: {},
  page: 1,
  limit: 10
}

async function paginate<T extends Document>(options: PaginateOption<T> = defaultOptions): Promise<PaginateResult<T>> {
  const model = this as Model<T>;
  const documentCount = await model.estimatedDocumentCount();
  const query = options.query ?? defaultOptions.query;
  const page = parse(options?.page, defaultOptions.page);
  const limit = parse(options?.limit, defaultOptions.limit);
  const pages = parse(Math.ceil(documentCount / limit));
  const hasPrev = page > 1;
  const hasNext = page < pages;
  const skip = limit * (page - 1);
  const documentsQuery = model.find(query).skip(skip).limit(limit);

  if (options.populate) {
    if (!Array.isArray(options.populate)) options.populate = [ options.populate ];

    options.populate.forEach(populate => {
      documentsQuery.populate(populate);
    });
  }
  const documents = await documentsQuery.exec();

  return {
    docs: documents,
    docsCount: documentCount,
    page: page,
    limit: limit,
    pagesCount: pages,
    hasPrev: hasPrev,
    hasNext: hasNext,
  };
}

function parse(value: any, defaultValue: number = 1): number {
  const number = +value;

  if (isNaN(number) || number < 1) return defaultValue;
  return number;
}

export function mongoosePaginate(schema: Schema) {
  schema.statics.paginate = paginate;
}

export default mongoosePaginate;