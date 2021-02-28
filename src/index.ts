import { Document, Model, PaginateOption, PaginateResult, Schema } from 'mongoose';

const defaultOptions: PaginateOption<any> = {
  query: {},
  page: 0,
  limit: 10
}

async function paginate<T extends Document>(options: NonNullable<PaginateOption<T>> = defaultOptions): Promise<PaginateResult<T>> {
  const model = this as Model<T>;
  const query = options.query ?? defaultOptions.query;
  const page = options.page ?? defaultOptions.page;
  const limit = options.limit ?? defaultOptions.limit;
  const documentCount = await model.estimatedDocumentCount();
  const pages = Math.ceil(documentCount / limit) || 1;
  const logicalPage = page + 1;
  const hasPrev = logicalPage > 1;
  const hasNext = logicalPage < pages;
  const skip = limit * (page);
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
    logicalPage: logicalPage,
    limit: limit,
    pagesCount: pages,
    hasPrev: hasPrev,
    hasNext: hasNext,
  };
}

export function mongoosePaginate(schema: Schema) {
  schema.statics.paginate = paginate;
}

export default mongoosePaginate;