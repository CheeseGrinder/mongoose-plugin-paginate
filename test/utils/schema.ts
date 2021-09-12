import { Document, Model, model, PaginateModel, Schema } from 'mongoose';
import { mongoosePaginate } from '../../src';

export interface Tag extends Document {
  name: string;
  description: string;
}

export interface Video extends Document {
  name: string;
  tags: Tag[];
  deleted: boolean;
}

export const TagsSchema = new Schema<Tag>({
  name: { type: String },
  description: { type: String }
});
export const TagModel: Model<Tag> = model('Tag', TagsSchema);

export const VideoSchema = new Schema<Video>({
  name: { type: String },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  deleted: { type: Boolean, default: false }
}).plugin(mongoosePaginate);
export const VideoModel: PaginateModel<Video> = model('Video', VideoSchema);
